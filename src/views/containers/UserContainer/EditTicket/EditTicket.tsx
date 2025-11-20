import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthService } from '../../../../services/auth/AuthService';
import { TicketService } from '../../../../services/ticket/TicketService';
import type { Ticket as TicketType, TicketAttachment } from '../../../../types/ticket';

type Ticket = TicketType;

const EditTicket: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: '',
        department: ''
    });
    const [loading, setLoading] = useState(true);
    const [existingAttachments, setExistingAttachments] = useState<TicketAttachment[]>([]);
    const [removedIds, setRemovedIds] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const departments = [
        "IT Support",
        "Software Support",
        "Hardware Support",
        "Network Operations",
        "Email Support",
        "Human Resources",
        "Facility Management",
        "Security",
        "Repair and Maintenance",
        "Other"
    ];

    const priorities = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
        { value: "critical", label: "Critical" }
    ];

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
                    const id = a.id ?? a.attachmentId ?? `${idx}`;
                    const name = a.name ?? a.fileName ?? a.filename ?? `file-${idx}`;
                    const type = a.type ?? a.contentType ?? a.mimeType ?? '';
                    const size = Number(a.size ?? a.fileSize ?? 0);
                    const url = a.url ?? a.fileUrl ?? (tid && id ? `/api/tickets/${tid}/attachments/${id}` : undefined);
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
                    setError('Please log in to edit tickets');
                    return;
                }
                // Fetch the specific ticket from C# API
                const resp = await fetch(`/api/tickets/${ticketId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                });
                if (!resp.ok) {
                    const txt = await resp.text();
                    console.warn('Ticket fetch failed', resp.status, txt);
                    throw new Error('Failed to load ticket');
                }
                const raw = await resp.text();
                let parsed: any;
                try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = {}; }
                const ticketData: Ticket = Array.isArray(parsed) ? parsed[0] : (parsed.response || parsed);

                // Check if the ticket belongs to the current user
                if (ticketData.submittedBy !== userEmail) {
                    setError('You do not have permission to edit this ticket');
                    return;
                }

                // Check if ticket can be edited (only open, assigned, or in progress tickets)
                const editableStatuses = ['open', 'assigned', 'in progress'];
                if (!editableStatuses.includes(ticketData.status.toLowerCase())) {
                    setError('This ticket cannot be edited as it has been resolved or closed');
                    return;
                }

                setTicket(ticketData);
                setFormData({
                    title: ticketData.title,
                    description: ticketData.description,
                    priority: ticketData.priority,
                    department: ticketData.department
                });
                const normalized = normalizeAttachments(ticketData, ticketId);
                setExistingAttachments(normalized);

                // Debug logging
                console.log('Ticket data loaded:', {
                    priority: ticketData.priority,
                    department: ticketData.department,
                    title: ticketData.title
                });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticket) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            // Validate form data
            if (!formData.title.trim() || !formData.description.trim()) {
                setError('Title and description are required');
                return;
            }

            // Update via service: will send FormData if files/removals provided
            await TicketService.update(ticket.id as string, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority as any,
                department: formData.department,
                files: newFiles as any,
                removeAttachmentIds: removedIds,
            });

            setSuccess('Ticket updated successfully!');

            // Redirect to view page after a short delay
            setTimeout(() => {
                navigate(`/user/tickets/view/${ticketId}`);
            }, 1500);
        } catch (error) {
            // Surface detailed error message from service (includes server response when available)
            console.error('Error updating ticket:', error);
            const msg = error instanceof Error ? error.message : String(error ?? 'Failed to update ticket');
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const onFilesSelected = (files: FileList | null) => {
        if (!files) return;
        const toAdd = Array.from(files);
        setNewFiles(prev => [...prev, ...toAdd]);
    };

    const removeExistingAttachment = (id?: string) => {
        if (!id) return;
        setRemovedIds(prev => prev.includes(id) ? prev : [...prev, id]);
        setExistingAttachments(prev => prev.filter(a => a.id !== id));
    };

    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

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

    if (error && !ticket) {
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Ticket</h1>
                    <p className="text-gray-600">Update your support ticket information</p>
                </div>
                <button
                    onClick={() => navigate('/user/tickets')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    ← Back to Tickets
                </button>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-blue-900">#{ticket.id}</h2>
                            <p className="text-blue-700">Current Status</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="text-red-800">{error}</div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="text-green-800">{success}</div>
                </div>
            )}

            {/* Edit Form */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter ticket title"
                                />
                            </div>

                            {/* Department and Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                        Department *
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Priority</option>
                                        {priorities.map((priority) => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>

                            {/* Attachments Management */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                                {/* Existing */}
                                {existingAttachments.length > 0 ? (
                                    <div className="space-y-2 mb-4">
                                        {existingAttachments.map((att) => (
                                            <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded">
                                                <div className="flex items-center space-x-3">
                                                    {att.type?.startsWith('image/') && att.url ? (
                                                        <img src={att.url} alt={att.name} className="w-12 h-12 object-cover rounded" />
                                                    ) : (
                                                        <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{att.name}</p>
                                                        <p className="text-xs text-gray-500">{att.type || 'file'}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeExistingAttachment(att.id)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mb-2">No existing attachments.</p>
                                )}

                                {/* New Files */}
                                <div className="mb-2">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 border rounded hover:bg-gray-50">Add Files</button>
                                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e.target.files)} />
                                </div>
                                {newFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {newFiles.map((f, idx) => (
                                            <div key={`${f.name}-${idx}`} className="flex items-center justify-between p-3 bg-white border rounded">
                                                <div className="flex items-center space-x-3">
                                                    {f.type?.startsWith('image/') ? (
                                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">IMG</div>
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">FILE</div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{f.name}</p>
                                                        <p className="text-xs text-gray-500">{Math.round(f.size / 1024)} KB</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeNewFile(idx)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/user/tickets/view/${ticketId}`)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                            >
                                {saving && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
                                {saving ? 'Updating...' : 'Update Ticket'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Note */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> You can only edit tickets that are currently open, assigned, or in progress.
                            Once a ticket is resolved or closed, it cannot be modified.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTicket;
