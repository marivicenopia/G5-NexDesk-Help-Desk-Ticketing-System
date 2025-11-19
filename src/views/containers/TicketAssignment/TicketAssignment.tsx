import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../../views/components/Pagination/Pagination';

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
            const ticketsResp = await fetch('/api/tickets', { credentials: 'include', headers: { 'Accept': 'application/json' } });
            let ticketsArr: any[] = [];
            if (ticketsResp.ok) {
                const txt = await ticketsResp.text();
                let parsed: any; try { parsed = txt ? JSON.parse(txt) : []; } catch { parsed = []; }
                ticketsArr = Array.isArray(parsed) ? parsed : (parsed.response || parsed.tickets || parsed.items || parsed.data || []);
            }
            setTickets(ticketsArr as Ticket[]);

            // Attempt primary users endpoint
            const usersResp = await fetch('/api/user', { credentials: 'include', headers: { 'Accept': 'application/json' } });
            let agentsList: Agent[] = [];
            if (usersResp.ok) {
                const utxt = await usersResp.text();
                let uParsed: any; try { uParsed = utxt ? JSON.parse(utxt) : []; } catch { uParsed = []; }
                const rawUsers: any[] = Array.isArray(uParsed) ? uParsed : (uParsed.response || uParsed.users || uParsed.user || []);
                agentsList = rawUsers.map(u => ({
                    id: String(u.id ?? u.userId ?? u.email ?? Math.random()),
                    firstname: String(u.firstName ?? u.firstname ?? '').trim(),
                    lastname: String(u.lastName ?? u.lastname ?? '').trim(),
                    email: String(u.email ?? u.userName ?? u.username ?? ''),
                    department: String(u.departmentId ?? u.department ?? ''),
                    isActive: u.isActive ?? true,
                    role: String((u.role ?? (Array.isArray(u.roles) ? u.roles[0] : '')) || '').toLowerCase()
                })).filter(a => a.isActive && (a.role === 'agent' || a.role === 'admin' || a.role === 'superadmin'));
            } else {
                console.warn('[TicketAssignment] /api/user missing (status', usersResp.status, '). Ensure controller route matches frontend.');
            }
            setAgents(agentsList);
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
            // Build full payload to satisfy backend validation (may require all fields)
            const fullPayload: any = {
                ...ticket,
                assignedTo: selectedAgent,
                status: ticket.status === 'resolved' || ticket.status === 'closed' ? ticket.status : 'assigned'
            };
            // Normalize date fields to ISO strings if they are Date objects
            if (fullPayload.submittedDate instanceof Date) {
                fullPayload.submittedDate = fullPayload.submittedDate.toISOString();
            }
            // Attempt full PUT first
            let resp = await fetch(`/api/tickets/${assigningTicket}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(fullPayload)
            });
            if (!resp.ok) {
                const txt1 = await resp.text();
                console.warn('[TicketAssignment] Full PUT failed, trying minimal payload. Status:', resp.status, 'Body:', txt1);
                // Fallback: minimal assignment payload
                const minimalPayload = { assignedTo: selectedAgent, status: 'assigned' };
                resp = await fetch(`/api/tickets/${assigningTicket}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(minimalPayload)
                });
                if (!resp.ok) {
                    // Second fallback: attempt PATCH if supported
                    const txt2 = await resp.text();
                    console.warn('[TicketAssignment] Minimal PUT failed. Status:', resp.status, 'Body:', txt2);
                    const patchResp = await fetch(`/api/tickets/${assigningTicket}`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(minimalPayload)
                    }).catch(err => {
                        console.error('[TicketAssignment] PATCH attempt error:', err);
                        return null;
                    });
                    if (!patchResp || !patchResp.ok) {
                        const patchTxt = patchResp ? await patchResp.text() : 'No response';
                        throw new Error(`Assign failed after retries. PUT(Full) & PUT(Minimal) & PATCH all failed. Last status ${patchResp?.status ?? 'n/a'}: ${patchTxt}`);
                    }
                    // Success via PATCH
                    setTickets(prev => prev.map(t => t.id === assigningTicket ? { ...t, ...minimalPayload } : t));
                } else {
                    // Success via minimal PUT
                    setTickets(prev => prev.map(t => t.id === assigningTicket ? { ...t, ...minimalPayload } : t));
                }
            } else {
                // Success via full PUT
                setTickets(prev => prev.map(t => t.id === assigningTicket ? { ...fullPayload } : t));
            }

            setShowAssignModal(false);
            setAssigningTicket(null);
            setSelectedAgent('');
            alert('Ticket assigned successfully!');
        } catch (error) {
            console.error('Error assigning ticket:', error);
            // Try to surface structured server error if available in message
            const msg = error instanceof Error ? error.message : String(error);
            alert(`Failed to assign ticket. Details: ${msg}`);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

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
                    <div>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            {!loading && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                    {searchTerm && ` matching "${searchTerm}"`}
                    {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                </div>
            )}

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
                            {paginatedTickets.length > 0 ? (
                                paginatedTickets.map((ticket) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        {filteredTickets.length === 0 ? 'No tickets found matching your criteria.' : 'No tickets to display.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {paginatedTickets.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredTickets.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            startIndex={startIndex}
                        />
                    </div>
                )}
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center z-50">
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
                            {agents.length === 0 ? (
                                <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                                    No agents available. Backend /api/users endpoint not found (404). Implement users API or create agent accounts.
                                </div>
                            ) : (
                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose an agent...</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.email}>
                                            {agent.firstname} {agent.lastname} ({agent.department || agent.role})
                                        </option>
                                    ))}
                                </select>
                            )}
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
