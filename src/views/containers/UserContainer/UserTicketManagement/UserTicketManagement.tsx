import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthService } from "../../../../services/auth/AuthService";
import { PATHS } from "../../../../routes/constant";

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

const UserTicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserTickets = async () => {
            try {
                setLoading(true);

                // Get current user email from AuthService
                const userEmail = AuthService.getUserEmail();
                if (!userEmail) {
                    console.error('No user email found');
                    return;
                }

                // Fetch all tickets and filter by user email
                const ticketsResponse = await axios.get('http://localhost:3001/tickets');
                const allTickets = ticketsResponse.data;

                // Filter tickets submitted by the current user
                const userTickets = allTickets.filter((ticket: Ticket) =>
                    ticket.submittedBy === userEmail
                );

                setTickets(userTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === "all" || ticket.priority.toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleViewTicket = (ticketId: string) => {
        navigate(`/user/tickets/view/${ticketId}`);
    };

    const handleEditTicket = (ticketId: string) => {
        navigate(`/user/tickets/edit/${ticketId}`);
    };

    const handleDeleteTicket = async (ticket: Ticket) => {
        if (!confirm(`Are you sure you want to delete ticket #${ticket.id}?`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/tickets/${ticket.id}`);

            // Remove the deleted ticket from the list
            setTickets(tickets.filter(t => t.id !== ticket.id));
            alert('Ticket deleted successfully');
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket. Please try again.');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            "open": "bg-green-100 text-green-800",
            "assigned": "bg-blue-100 text-blue-800",
            "in progress": "bg-blue-100 text-blue-800",
            "on hold": "bg-yellow-100 text-yellow-800",
            "resolved": "bg-purple-100 text-purple-800",
            "closed": "bg-gray-100 text-gray-800"
        };
        return statusClasses[status.toLowerCase() as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadge = (priority: string) => {
        const priorityClasses = {
            "low": "bg-blue-100 text-blue-800",
            "medium": "bg-orange-100 text-orange-800",
            "high": "bg-red-100 text-red-800",
            "urgent": "bg-red-200 text-red-900",
            "critical": "bg-red-300 text-red-900"
        };
        return priorityClasses[priority.toLowerCase() as keyof typeof priorityClasses] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>
                    <p className="text-gray-600">View and track all your support tickets</p>
                </div>
                <Link
                    to={PATHS.USER.CREATE_TICKET.path}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Create New Ticket
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search Tickets
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="in progress">In Progress</option>
                            <option value="on hold">On Hold</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-lg shadow-sm">
                {filteredTickets.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredTickets.map((ticket) => (
                            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                #{ticket.id} - {ticket.title}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{ticket.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                                            <span>Created: {formatDate(ticket.submittedDate)}</span>
                                            <span>•</span>
                                            <span>Department: {ticket.department}</span>
                                        </div>
                                    </div>
                                    <div className="ml-6 flex-shrink-0">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewTicket(ticket.id)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleEditTicket(ticket.id)}
                                                className="text-green-600 hover:text-green-800 font-medium text-sm px-3 py-1 rounded border border-green-600 hover:bg-green-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTicket(ticket)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                                ? "Try adjusting your filters to find tickets."
                                : "You haven't created any tickets yet."
                            }
                        </p>
                        {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                            <Link
                                to={PATHS.USER.CREATE_TICKET.path}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Your First Ticket
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Open</p>
                            <p className="text-2xl font-bold text-green-600">
                                {tickets.filter(t => t.status === 'open').length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {tickets.filter(t => t.status === 'in progress' || t.status === 'assigned').length}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Resolved</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTicketManagement;
