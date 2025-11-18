import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTicketAlt, FaUser, FaClock, FaExclamationTriangle, FaBuilding, FaUserCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import type { Ticket } from '../../../types/ticket';
import { AuthService } from '../../../services/auth/AuthService';

const ViewTicketDetail: React.FC = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingPriority, setIsEditingPriority] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Get current user role for determining back navigation
    const currentUserRole = AuthService.getRole();

    // Define status and priority options
    const statusOptions = ['open', 'assigned', 'in progress', 'on hold', 'resolved', 'closed'];
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
            const response = await axios.get(`/api/tickets/${ticketId}`, { withCredentials: true });
            const data = response.data?.response ?? response.data;
            setTicket(data);
            setNewStatus(data.status);
            setNewPriority(data.priority);
        } catch (err) {
            console.error('Error fetching ticket details:', err);
            setError('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!ticket || newStatus === ticket.status) {
            setIsEditingStatus(false);
            return;
        }

        try {
            setUpdateLoading(true);
            const response = await axios.put(`/api/tickets/${ticketId}`, {
                ...ticket,
                status: newStatus,
                lastUpdated: new Date().toISOString()
            }, { withCredentials: true });
            setTicket((response.data?.response ?? response.data));
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

    const handlePriorityUpdate = async () => {
        if (!ticket || newPriority === ticket.priority) {
            setIsEditingPriority(false);
            return;
        }

        try {
            setUpdateLoading(true);
            const response = await axios.put(`/api/tickets/${ticketId}`, {
                ...ticket,
                priority: newPriority,
                lastUpdated: new Date().toISOString()
            }, { withCredentials: true });
            setTicket((response.data?.response ?? response.data));
            setIsEditingPriority(false);
            setSuccessMessage('Ticket priority updated successfully');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error updating ticket priority:', err);
            setError('Failed to update ticket priority');
        } finally {
            setUpdateLoading(false);
        }
    };

    const canUpdateStatus = () => {
        if (currentUserRole === 'admin' || currentUserRole === 'superadmin') return true;
        if (currentUserRole === 'agent' && ticket?.assignedTo) return true;
        if (currentUserRole === 'user' && ticket?.status === 'open') return true; // Users can only close their own tickets
        return false;
    };

    const canUpdatePriority = () => {
        return currentUserRole === 'admin' || currentUserRole === 'superadmin' || currentUserRole === 'agent';
    };

    const getAvailableStatusOptions = () => {
        if (currentUserRole === 'user') {
            // Users can only close their own tickets
            return ['closed'];
        }
        return statusOptions;
    };

    const formatForDisplay = (text: string) => {
        return text.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const handleAssignTicket = () => {
        // Navigate to ticket assignment page with current ticket context
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
            navigate(-1); // Go back to previous page
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'assigned':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'on hold':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'resolved':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'closed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-blue-600 hover:text-blue-800 mx-auto"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Tickets
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

            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Tickets
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
            </div>

            {/* Ticket Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FaTicketAlt className="w-6 h-6 mr-3" />
                            <div>
                                <h2 className="text-xl font-semibold">Ticket #{ticket.id}</h2>
                                <p className="text-blue-100">{ticket.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                                {formatForDisplay(ticket.priority)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                                {formatForDisplay(ticket.status)}
                            </span>
                            {/* Show assign button for unassigned tickets and for agents/admins */}
                            {(!ticket.assignedTo || ticket.status === 'open') && (currentUserRole === 'admin' || currentUserRole === 'superadmin' || currentUserRole === 'agent') && (
                                <button
                                    onClick={handleAssignTicket}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-colors"
                                    title="Assign Ticket"
                                >
                                    <FaUserCheck className="w-3 h-3" />
                                    Assign
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ticket Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FaTicketAlt className="w-4 h-4 text-gray-400 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ticket ID</label>
                                        <p className="text-gray-900">{ticket.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaBuilding className="w-4 h-4 text-gray-400 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Department</label>
                                        <p className="text-gray-900">{ticket.department || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaExclamationTriangle className="w-4 h-4 text-gray-400 mr-3" />
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        {isEditingPriority && canUpdatePriority() ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <select
                                                    value={newPriority}
                                                    onChange={(e) => setNewPriority(e.target.value)}
                                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled={updateLoading}
                                                >
                                                    {priorityOptions.map((priority) => (
                                                        <option key={priority} value={priority}>
                                                            {formatForDisplay(priority)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handlePriorityUpdate}
                                                    disabled={updateLoading}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <FaSave className="w-3 h-3" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingPriority(false);
                                                        setNewPriority(ticket?.priority || '');
                                                    }}
                                                    disabled={updateLoading}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                                    {formatForDisplay(ticket.priority)}
                                                </span>
                                                {canUpdatePriority() && (
                                                    <button
                                                        onClick={() => setIsEditingPriority(true)}
                                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                                        title="Edit Priority"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaClock className="w-4 h-4 text-gray-400 mr-3" />
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        {isEditingStatus && canUpdateStatus() ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled={updateLoading}
                                                >
                                                    {getAvailableStatusOptions().map((status) => (
                                                        <option key={status} value={status}>
                                                            {formatForDisplay(status)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleStatusUpdate}
                                                    disabled={updateLoading}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <FaSave className="w-3 h-3" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingStatus(false);
                                                        setNewStatus(ticket?.status || '');
                                                    }}
                                                    disabled={updateLoading}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                                                    {formatForDisplay(ticket.status)}
                                                </span>
                                                {canUpdateStatus() && (
                                                    <button
                                                        onClick={() => setIsEditingStatus(true)}
                                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                                        title="Edit Status"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                                        <p className="text-gray-900">{ticket.submittedBy || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaClock className="w-4 h-4 text-gray-400 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                                        <p className="text-gray-900">
                                            {ticket.submittedDate
                                                ? new Date(ticket.submittedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                                        <p className="text-gray-900">{ticket.assignedTo || 'Unassigned'}</p>
                                    </div>
                                </div>

                                {ticket.customerName && (
                                    <div className="flex items-center">
                                        <FaUser className="w-4 h-4 text-gray-400 mr-3" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                                            <p className="text-gray-900">{ticket.customerName}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900 whitespace-pre-wrap">{ticket.description || 'No description provided'}</p>
                        </div>
                    </div>

                    {/* Resolution Information (if resolved) */}
                    {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Resolution Details</h3>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                {ticket.resolvedBy && (
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Resolved By</label>
                                        <p className="text-gray-900">{ticket.resolvedBy}</p>
                                    </div>
                                )}
                                {ticket.resolvedDate && (
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Resolved Date</label>
                                        <p className="text-gray-900">
                                            {new Date(ticket.resolvedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )}
                                {ticket.resolutionDescription && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Resolution Description</label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{ticket.resolutionDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Agent Feedback (if available) */}
                    {ticket.agentFeedback && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Agent Feedback</h3>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-gray-900 whitespace-pre-wrap">{ticket.agentFeedback}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Last updated: {ticket.submittedDate
                                ? new Date(ticket.submittedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'N/A'
                            }
                        </p>
                        <button
                            onClick={handleGoBack}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Back to Tickets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTicketDetail;
