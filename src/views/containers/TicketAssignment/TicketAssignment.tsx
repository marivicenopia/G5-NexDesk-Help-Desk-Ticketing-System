import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    submittedBy: string;
    submittedDate: string;
    assignedTo?: string;
    department: string;
}

interface Agent {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    department: string;
    isActive: boolean;
    role: string;
}

const TicketAssignment: React.FC = () => {
    const location = useLocation();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningTicket, setAssigningTicket] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<string>('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    // Handle pre-selected ticket from navigation state
    useEffect(() => {
        const state = location.state as { ticketId?: string };
        if (state?.ticketId) {
            setAssigningTicket(state.ticketId);
            setShowAssignModal(true);
        }
    }, [location.state]);

    const fetchData = async () => {
        try {
            const [ticketsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:3001/tickets'),
                axios.get('http://localhost:3001/users')
            ]);

            setTickets(ticketsRes.data);
            // Filter only active agents
            const activeAgents = usersRes.data.filter((user: Agent) =>
                user.isActive && user.role === 'agent'
            );
            setAgents(activeAgents);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTicket = (ticketId: string) => {
        setAssigningTicket(ticketId);
        setShowAssignModal(true);
        setSelectedAgent('');
    };

    const confirmAssignment = async () => {
        if (!assigningTicket || !selectedAgent) return;

        try {
            const ticket = tickets.find(t => t.id === assigningTicket);
            if (!ticket) return;

            const updatedTicket = {
                ...ticket,
                assignedTo: selectedAgent,
                status: 'assigned'
            };

            await axios.patch(`http://localhost:3001/tickets/${assigningTicket}`, updatedTicket);

            // Update local state
            setTickets(prev => prev.map(t =>
                t.id === assigningTicket ? updatedTicket : t
            ));

            setShowAssignModal(false);
            setAssigningTicket(null);
            setSelectedAgent('');
            alert('Ticket assigned successfully!');
        } catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Failed to assign ticket');
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status: string) => {
        const statusClasses: { [key: string]: string } = {
            "open": "bg-green-100 text-green-800",
            "assigned": "bg-blue-100 text-blue-800",
            "in progress": "bg-yellow-100 text-yellow-800",
            "on hold": "bg-orange-100 text-orange-800",
            "resolved": "bg-purple-100 text-purple-800",
            "closed": "bg-gray-100 text-gray-800"
        };
        return statusClasses[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadgeClass = (priority: string) => {
        const priorityClasses: { [key: string]: string } = {
            "low": "bg-blue-100 text-blue-800",
            "medium": "bg-yellow-100 text-yellow-800",
            "high": "bg-orange-100 text-orange-800",
            "urgent": "bg-red-100 text-red-800",
            "critical": "bg-red-100 text-red-800"
        };
        return priorityClasses[priority] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ticket Assignment</h1>
                <p className="text-gray-600">Assign tickets to available agents</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="in progress">In Progress</option>
                            <option value="on hold">On Hold</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticket
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned To
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
                                                {ticket.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {ticket.description}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                ID: {ticket.id}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.submittedBy}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.assignedTo || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleAssignTicket(ticket.id)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {ticket.assignedTo ? 'Reassign' : 'Assign'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Assign Ticket</h3>

                        {/* Selected Ticket Info */}
                        {assigningTicket && (
                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm font-medium">
                                    Ticket: {tickets.find(t => t.id === assigningTicket)?.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    ID: {assigningTicket}
                                </p>
                            </div>
                        )}

                        {/* Agent Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Agent
                            </label>
                            <select
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Choose an agent...</option>
                                {agents.map(agent => (
                                    <option key={agent.id} value={agent.email}>
                                        {agent.firstname} {agent.lastname} ({agent.department})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssignment}
                                disabled={!selectedAgent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Assign Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketAssignment;
