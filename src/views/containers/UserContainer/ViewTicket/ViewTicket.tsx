import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthService } from '../../../../services/auth/AuthService';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    department: string;
    submittedBy: string;
    submittedDate: string;
    assignedTo?: string;
    resolvedBy?: string;
    resolvedDate?: string;
    resolutionDescription?: string;
    agentFeedback?: string;
}

const ViewTicket: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true);

                // Get current user info for authorization
                const userId = AuthService.getToken();
                if (!userId) {
                    setError('Please log in to view tickets');
                    return;
                }

                const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
                const user = userResponse.data;

                // Fetch the specific ticket
                const ticketResponse = await axios.get(`http://localhost:3001/tickets/${ticketId}`);
                const ticketData = ticketResponse.data;

                // Check if the ticket belongs to the current user
                if (ticketData.submittedBy !== user.email) {
                    setError('You do not have permission to view this ticket');
                    return;
                }

                setTicket(ticketData);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                {ticket.status}
                            </span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                                {ticket.priority}
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
