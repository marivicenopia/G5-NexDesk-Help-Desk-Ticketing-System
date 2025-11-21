import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTicketAlt, FaUser, FaClock, FaExclamationTriangle, FaBuilding, FaUserCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import type { Ticket } from '../../../types/ticket';
import { AuthService } from '../../../services/auth/AuthService';
import { TicketService } from '../../../services/ticket/TicketService';
import { getStatusColor, getPriorityColor } from '../../../utils/statusColors';

// FIX: Use Omit to remove the original 'lastUpdated' from Ticket so we can redefine it
// This prevents the "Interface correctly extends interface" error
interface ExtendedTicket extends Omit<Ticket, 'lastUpdated'> {
    lastUpdated?: string | Date; // Now it accepts a string OR a Date object
    resolvedBy?: string;
    resolvedDate?: string;
    resolutionDescription?: string;
    agentFeedback?: string;
}

const ViewTicketDetail: React.FC = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState<ExtendedTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Global Edit State
    const [isEditing, setIsEditing] = useState(false);
    
    // Form States
    const [newStatus, setNewStatus] = useState('');
    const [newPriority, setNewPriority] = useState('');
    
    const [updateLoading, setUpdateLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // --- FIX: Force role to lowercase to match permissions ---
    const rawRole = AuthService.getRole();
    const currentUserRole = rawRole ? String(rawRole).toLowerCase() : '';

    // Options
    const statusOptions = ['open', 'assigned', 'in progress', 'resolved', 'closed'];
    const priorityOptions = ['low', 'medium', 'high', 'urgent', 'critical'];

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await TicketService.fetchById(ticketId!);
            // Cast data to unknown first, then ExtendedTicket to bypass strict overlap checks
            setTicket(data as unknown as ExtendedTicket);
            setNewStatus(data.status);
            setNewPriority(data.priority);
        } catch (err) {
            console.error('Error fetching ticket details:', err);
            setError('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!ticket) return;

        try {
            setUpdateLoading(true);
            // Send PUT request
            const response = await axios.put(`/api/tickets/${ticketId}`, {
                ...ticket,
                status: newStatus,
                priority: newPriority,
                lastUpdated: new Date().toISOString()
            }, { withCredentials: true });

            // Update local state with response
            const updatedTicket = response.data?.response ?? response.data;
            // Cast response to avoid type conflicts
            setTicket(updatedTicket as unknown as ExtendedTicket);
            
            setIsEditing(false);
            setSuccessMessage('Ticket updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error updating ticket:', err);
            setError('Failed to update ticket');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form values to current ticket values
        if (ticket) {
            setNewStatus(ticket.status);
            setNewPriority(ticket.priority);
        }
    };

    const canEdit = () => {
        return currentUserRole === 'admin' || currentUserRole === 'superadmin' || currentUserRole === 'agent';
    };

    const formatForDisplay = (text: string) => {
        if (!text) return '';
        return text.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const handleAssignTicket = () => {
        if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
            navigate('/admin/tickets/assignment', { state: { ticketId: ticket?.id } });
        } else if (currentUserRole === 'agent') {
            navigate('/agent/tickets/assignment', { state: { ticketId: ticket?.id } });
        }
    };

    const handleGoBack = () => {
        if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
            navigate('/admin/tickets');
        } else if (currentUserRole === 'agent') {
            navigate('/agent/tickets');
        } else {
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">{error || 'Ticket not found'}</div>
                    <button onClick={handleGoBack} className="flex items-center text-blue-600 hover:text-blue-800 mx-auto">
                        <FaArrowLeft className="mr-2" /> Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {/* Top Navigation */}
            <div className="mb-6 flex justify-between items-center">
                <button onClick={handleGoBack} className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaArrowLeft className="mr-2" /> Back to Tickets
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                
                {/* Blue Header Bar */}
                <div className="bg-blue-600 text-white px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center">
                            <FaTicketAlt className="w-6 h-6 mr-3" />
                            <div>
                                <h2 className="text-xl font-semibold">Ticket #{ticket.id}</h2>
                                <p className="text-blue-100 text-sm opacity-90">{ticket.title}</p>
                            </div>
                        </div>

                        {/* Header Actions: Edit/Save Buttons */}
                        <div className="flex items-center gap-3">
                            {canEdit() && !isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium text-sm backdrop-blur-sm"
                                >
                                    <FaEdit /> Edit Ticket
                                </button>
                            )}

                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handleSaveChanges}
                                        disabled={updateLoading}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all font-medium text-sm disabled:opacity-50"
                                    >
                                        <FaSave /> Save
                                    </button>
                                    <button 
                                        onClick={handleCancelEdit}
                                        disabled={updateLoading}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all font-medium text-sm disabled:opacity-50"
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                        
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Ticket Information</h3>
                            
                            <div className="flex items-center">
                                <FaTicketAlt className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Ticket ID</label>
                                    <p className="text-gray-900 font-medium">{ticket.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FaBuilding className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Department</label>
                                    <p className="text-gray-900">{ticket.department || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Priority Section */}
                            <div className="flex items-center">
                                <FaExclamationTriangle className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Priority</label>
                                    {isEditing ? (
                                        <select
                                            value={newPriority}
                                            onChange={(e) => setNewPriority(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                        >
                                            {priorityOptions.map(opt => (
                                                <option key={opt} value={opt}>{formatForDisplay(opt)}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                                            {formatForDisplay(ticket.priority)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="flex items-center">
                                <FaClock className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</label>
                                    {isEditing ? (
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>{formatForDisplay(opt)}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                            {formatForDisplay(ticket.status)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">User & Assignment</h3>

                            <div className="flex items-center">
                                <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Submitted By</label>
                                    <p className="text-gray-900">{ticket.submittedBy || 'N/A'}</p>
                                    {ticket.customerName && <p className="text-sm text-gray-500">({ticket.customerName})</p>}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FaClock className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Date Submitted</label>
                                    <p className="text-gray-900">
                                        {ticket.submittedDate ? new Date(ticket.submittedDate).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FaUserCheck className="w-4 h-4 text-gray-400 mr-3" />
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 uppercase">Assigned To</label>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-900 font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                                        {/* Assign Button: Visible only if not editing, and user has permission */}
                                        {!isEditing && canEdit() && (
                                            <button 
                                                onClick={handleAssignTicket}
                                                className="text-sm text-blue-600 hover:text-blue-800 underline ml-2"
                                            >
                                                {ticket.assignedTo ? 'Reassign' : 'Assign Agent'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {ticket.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Attachments Section (Only if exists) */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Attachments</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ticket.attachments.map((att) => (
                                    <a 
                                        key={att.id} 
                                        href={att.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
                                    >
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 group-hover:bg-blue-200">
                                            <FaTicketAlt />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 truncate">{att.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(att.size / 1024).toFixed(1)} KB • {att.type}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolution (Only if resolved/closed) */}
                    {(ticket.status === 'resolved' || ticket.status === 'closed') && ticket.resolutionDescription && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Resolution Details</h3>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <p className="text-green-900 whitespace-pre-wrap">{ticket.resolutionDescription}</p>
                                <p className="text-xs text-green-700 mt-2">Resolved by {ticket.resolvedBy} on {new Date(ticket.resolvedDate!).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Last updated: {new Date(ticket.lastUpdated || ticket.submittedDate).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewTicketDetail;