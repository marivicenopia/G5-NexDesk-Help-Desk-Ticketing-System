import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthService } from '../../../../services/auth/AuthService';
import type { Ticket as TicketType, TicketAttachment } from "../../../../types/ticket";

type Ticket = TicketType;

const ViewTicket: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const normalizeAttachments = (raw: any, tid?: string): TicketAttachment[] => {
            try {
                let atts: any = raw?.attachments;
                if (!atts) atts = raw?.ticketAttachments || raw?.files || raw?.attachmentsJson;
                if (typeof atts === 'string') {
                    try { atts = JSON.parse(atts); } catch { atts = []; }
                }
                if (!Array.isArray(atts)) return [];
                return atts.map((a: any, idx: number) => {
                    const id = a.id ?? a.Id ?? a.attachmentId ?? `${idx}`;
                    const name = a.name ?? a.Name ?? a.fileName ?? a.filename ?? `file-${idx}`;
                    const type = a.type ?? a.Type ?? a.contentType ?? a.mimeType ?? '';
                    const size = Number(a.size ?? a.Size ?? a.fileSize ?? 0);
                    const url = a.url ?? a.Url ?? a.fileUrl ?? (tid && id ? `/api/tickets/${tid}/attachments/${id}` : undefined);
                    const uploadDate = a.uploadDate ?? a.createdAt ?? new Date().toISOString();
                    return { id: String(id), name, type, size, url, uploadDate } as TicketAttachment;
                });
            } catch {
                return [];
            }
        };

        const fetchTicket = async () => {
            try {
                setLoading(true);

                // Get current user info for authorization
                const userEmail = AuthService.getUserEmail();
                if (!userEmail) {
                    setError('Please log in to view tickets');
                    return;
                }

                // Fetch the specific ticket from C# API via Vite proxy
                const token = AuthService.getToken();
                const headers: HeadersInit = {
                    'Accept': 'application/json'
                };
                if (token) {
                    (headers as any)['Authorization'] = `Bearer ${token}`;
                }

                const resp = await fetch(`/api/tickets/${ticketId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers
                });
                if (!resp.ok) {
                    const txt = await resp.text();
                    console.warn('Ticket fetch failed', resp.status, txt);
                    throw new Error('Failed to load ticket');
                }
                let raw = await resp.text();
                let parsed: any;
                try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = {}; }
                const ticketData: Ticket = Array.isArray(parsed) ? parsed[0] : (parsed.response || parsed);
                // Normalize attachments from various backend shapes
                const normalized = normalizeAttachments(ticketData, ticketId);
                (ticketData as any).attachments = normalized;

                // Check if the ticket belongs to the current user
                if (ticketData.submittedBy !== userEmail) {
                    setError('You do not have permission to view this ticket');
                    return;
                }

                setTicket(ticketData);
                setNewStatus(ticketData.status);
            } catch (error) {
                console.error('Error fetching ticket:', error);
                setError('Failed to load ticket. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (ticketId) {
            fetchTicket();
        }
    }, [ticketId]);

    const getStatusBadgeClass = (status: string) => {
        const statusClasses: { [key: string]: string } = {
            "open": "bg-green-100 text-green-800",
            "assigned": "bg-blue-100 text-blue-800",
            "in progress": "bg-blue-100 text-blue-800",
            "on hold": "bg-yellow-100 text-yellow-800",
            "resolved": "bg-purple-100 text-purple-800",
            "closed": "bg-gray-100 text-gray-800"
        };
        return statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadgeClass = (priority: string) => {
        const priorityClasses: { [key: string]: string } = {
            "low": "bg-blue-100 text-blue-800",
            "medium": "bg-orange-100 text-orange-800",
            "high": "bg-red-100 text-red-800",
            "urgent": "bg-red-200 text-red-900",
            "critical": "bg-red-300 text-red-900"
        };
        return priorityClasses[priority.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateLike: string | Date) => {
        return new Date(dateLike as any).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = async () => {
        if (!ticket || newStatus === ticket.status) {
            setIsEditingStatus(false);
            return;
        }

        try {
            setUpdateLoading(true);
            const token = AuthService.getToken();
            const updateHeaders: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            if (token) {
                (updateHeaders as any)['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: updateHeaders,
                body: JSON.stringify({ ...ticket, status: newStatus })
            });
            if (!response.ok) {
                const txt = await response.text();
                console.error('Error updating ticket status:', response.status, txt);
                throw new Error('Failed to update ticket status');
            }
            const updatedRaw = await response.text();
            let updatedParsed: any = {};
            try { updatedParsed = updatedRaw ? JSON.parse(updatedRaw) : {}; } catch { }
            const updatedTicket: Ticket = Array.isArray(updatedParsed) ? updatedParsed[0] : (updatedParsed.response || updatedParsed);
            setTicket(updatedTicket);
            setIsEditingStatus(false);
            setSuccessMessage('Ticket status updated successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error updating ticket status:', err);
            setError('Failed to update ticket status');
        } finally {
            setUpdateLoading(false);
        }
    };

    const canUpdateStatus = () => {
        // Users can only close their own open tickets
        return ticket?.status === 'open' || ticket?.status === 'assigned';
    };

    const formatForDisplay = (text: string) => {
        return text.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading ticket...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
                    <div className="text-red-700 mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/user/tickets')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-gray-600">Ticket not found</div>
                    <button
                        onClick={() => navigate('/user/tickets')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
                    <p className="text-gray-600">View your support ticket information</p>
                </div>
                <button
                    onClick={() => navigate('/user/tickets')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    ← Back to Tickets
                </button>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-blue-900">#{ticket.id}</h2>
                            <p className="text-blue-700">{ticket.title}</p>
                        </div>
                        <div className="flex space-x-2">
                            <div className="flex items-center space-x-2">
                                {!isEditingStatus ? (
                                    <>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                            {formatForDisplay(ticket.status)}
                                        </span>
                                        {canUpdateStatus() && (
                                            <button
                                                onClick={() => {
                                                    setIsEditingStatus(true);
                                                    setNewStatus(ticket.status);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                title="Edit Status"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                                            disabled={updateLoading}
                                        >
                                            <option value="open">Open</option>
                                            <option value="in progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={updateLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-sm rounded disabled:opacity-50"
                                        >
                                            {updateLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingStatus(false);
                                                setNewStatus(ticket.status);
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-sm rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                                {formatForDisplay(ticket.priority)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                            <p className="text-gray-900">{ticket.department}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Submitted Date</h3>
                            <p className="text-gray-900">{formatDate(ticket.submittedDate)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Submitted By</h3>
                            <p className="text-gray-900">{ticket.submittedBy}</p>
                        </div>
                        {ticket.assignedTo && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
                                <p className="text-gray-900">{ticket.assignedTo}</p>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                    </div>

                    {/* Attachments */}
                    {Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Attachments</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ticket.attachments.map((att: TicketAttachment, idx: number) => (
                                    <div key={att.id || idx} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        {att.type?.startsWith('image/') && att.url ? (
                                            <a href={att.url} target="_blank" rel="noreferrer" className="flex items-center space-x-3">
                                                <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{att.name}</p>
                                                    <p className="text-xs text-gray-500">{Math.round((att.size || 0) / 1024)} KB</p>
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-between w-full">
                                                <div className="flex items-center space-x-3">
                                                    <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{att.name}</p>
                                                        <p className="text-xs text-gray-500">{att.type || 'file'} • {Math.round((att.size || 0) / 1024)} KB</p>
                                                    </div>
                                                </div>
                                                {att.url && (
                                                    <a href={att.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">Download</a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolution Information */}
                    {(ticket.status === 'resolved' || ticket.status === 'closed') && ticket.resolutionDescription && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Resolution Information
                            </h3>

                            {ticket.resolvedBy && ticket.resolvedDate && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Resolved By</h4>
                                        <p className="text-gray-900">{ticket.resolvedBy}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Resolved Date</h4>
                                        <p className="text-gray-900">{formatDate(ticket.resolvedDate)}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Resolution Description</h4>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-gray-900 whitespace-pre-wrap">{ticket.resolutionDescription}</p>
                                </div>
                            </div>

                            {ticket.agentFeedback && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Agent Feedback</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-gray-900 whitespace-pre-wrap">{ticket.agentFeedback}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Section */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => navigate(`/user/tickets/edit/${ticket.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Edit Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTicket;
