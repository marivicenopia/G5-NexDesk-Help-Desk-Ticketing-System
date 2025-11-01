import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Ticket } from '../../../types/ticket';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [userFilter, setUserFilter] = useState<string>('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/tickets');
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ticketId: string | number) => {
        if (!confirm('Are you sure you want to delete this ticket?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
            alert('Ticket deleted successfully');
        } catch (err) {
            alert('Failed to delete ticket');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setCategoryFilter('all');
        setUserFilter('all');
    };

    // Filter tickets based on search and filters
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
        const matchesUser = userFilter === 'all' ||
            ticket.submittedBy === userFilter ||
            ticket.assignedTo === userFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesUser;
    });

    // Get unique categories from tickets
    const uniqueCategories = [...new Set(tickets.filter(t => t.category).map(t => t.category))].sort();

    // Get unique users from tickets (submitted by and assigned to)
    const uniqueSubmitters = [...new Set(tickets.filter(t => t.submittedBy).map(t => t.submittedBy))];
    const uniqueAssignees = [...new Set(tickets.filter(t => t.assignedTo).map(t => t.assignedTo))];
    const uniqueUsers = [...new Set([...uniqueSubmitters, ...uniqueAssignees])].sort();

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'critical': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-indigo-100 text-indigo-800';
            case 'in progress': return 'bg-yellow-100 text-yellow-800';
            case 'on hold': return 'bg-orange-100 text-orange-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading tickets...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">Error Loading Tickets</div>
                    <div className="text-sm text-red-500">{error}</div>
                    <button
                        onClick={fetchTickets}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#031849] mb-1">Ticket Management</h1>
                        <p className="text-gray-600">Manage and track all support tickets</p>
                    </div>
                    <Link
                        to="/admin/tickets/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Create Ticket
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                        <option value="in progress">In Progress</option>
                        <option value="on hold">On Hold</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* User Filter */}
                    <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Users</option>
                        {uniqueUsers.map(user => (
                            <option key={user} value={user}>{user}</option>
                        ))}
                    </select>

                    {/* Results Count */}
                    <div className="flex items-center text-sm text-gray-500">
                        Showing {filteredTickets.length} of {tickets.length} tickets
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                            {tickets.length === 0 ? 'No tickets found' : 'No tickets match your filters'}
                        </div>
                        {tickets.length === 0 && (
                            <Link
                                to="/admin/tickets/create"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                            >
                                <FiPlus className="w-4 h-4" />
                                Create First Ticket
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticket
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{ticket.id}
                                                </div>
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {ticket.title}
                                                </div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {ticket.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {ticket.customerName || ticket.submittedBy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {ticket.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(ticket.submittedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => alert(`View ticket #${ticket.id}`)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Ticket"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => alert(`Edit ticket #${ticket.id}`)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Edit Ticket"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ticket.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Delete Ticket"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketManagement;
