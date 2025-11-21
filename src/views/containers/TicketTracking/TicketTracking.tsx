import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiUser, FiUserCheck } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import type { Ticket } from '../../../types/ticket';
// Local lightweight agent type for assignment list
type AgentOption = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    isActive?: boolean;
};
import { Pagination } from '../../components/Pagination';
import { DeleteModal } from '../../components/DeleteModal';
import { AuthService } from '../../../services/auth/AuthService';

const TicketTracking: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [agents, setAgents] = useState<AgentOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedUser, setSelectedUser] = useState('all');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const ticketsPerPage = 10;
    const navigate = useNavigate();

    // Get current user role for permissions
    const currentUserRole = AuthService.getRole();

    useEffect(() => {
        fetchTickets();
        fetchAgents();
    }, []);

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedPriority, selectedDepartment, selectedCategory, selectedUser]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/tickets', { withCredentials: true });
            const data = Array.isArray(response.data) ? response.data : (response.data?.response ?? []);
            setTickets(data);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            const resp = await fetch('/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
            if (!resp.ok) {
                // Fallback: attempt /api/user/all or provide empty list
                const alt = await fetch('/api/user/all', { credentials: 'include', headers: { 'Accept': 'application/json' } }).catch(() => null);
                let finalResp: Response | null = null;
                if (alt && alt.ok) finalResp = alt;
                if (!finalResp) {
                    console.warn('[TicketTracking] Agents endpoint missing (404). Backend route likely /api/user not /api/users; ensure controller route matches.');
                    setAgents([]);
                    return;
                }
                const bodyAlt = await finalResp.text();
                let parsedAlt: any; try { parsedAlt = bodyAlt ? JSON.parse(bodyAlt) : []; } catch { parsedAlt = []; }
                const arrAlt: any[] = Array.isArray(parsedAlt) ? parsedAlt : (parsedAlt.response || parsedAlt.users || []);
                setAgents(arrAlt.map((u: any) => ({
                    id: String(u.id ?? u.userId ?? u.email ?? Math.random()),
                    firstname: String(u.firstName ?? u.firstname ?? '').trim(),
                    lastname: String(u.lastName ?? u.lastname ?? '').trim(),
                    email: String(u.email ?? ''),
                    role: String((u.role ?? (Array.isArray(u.roles) ? u.roles[0] : '')) || '').toLowerCase(),
                    isActive: u.isActive ?? true
                })).filter(a => a.isActive && ['agent','admin','superadmin'].includes(a.role)));
                return;
            }
            const raw = await resp.text();
            let parsed: any; try { parsed = raw ? JSON.parse(raw) : []; } catch { parsed = []; }
            const arr: any[] = Array.isArray(parsed) ? parsed : (parsed.response || parsed.users || parsed.user || []);
            const normalized: AgentOption[] = arr.map((u: any) => ({
                id: String(u.id ?? u.userId ?? u.email ?? u.username ?? Math.random()),
                firstname: String(u.firstName ?? u.firstname ?? '').trim(),
                lastname: String(u.lastName ?? u.lastname ?? '').trim(),
                email: String(u.email ?? u.userName ?? u.username ?? ''),
                role: String((u.role ?? (Array.isArray(u.roles) ? u.roles[0] : '')) || '').toLowerCase(),
                isActive: u.isActive ?? u.active ?? true,
            }));
            setAgents(normalized.filter(u => u.isActive && ['agent','admin','superadmin'].includes(u.role)));
        } catch (err) {
            console.error('[TicketTracking] Error fetching agents:', err);
            setAgents([]);
        }
    };

    const handleAssign = (ticket: Ticket) => {
        setTicketToAssign(ticket);
        setSelectedAgent(ticket.assignedTo || '');
        setShowAssignModal(true);
    };

    const confirmAssignment = async () => {
        if (!ticketToAssign || !selectedAgent) return;
        try {
            setAssignLoading(true);
            const agent = agents.find(a => a.id === selectedAgent);
            // Prefer email; fallback to id if backend expects identifier like USRxxx
            const assignedValue = agent?.email || agent?.id || selectedAgent;
            const fullPayload: any = {
                ...ticketToAssign,
                assignedTo: assignedValue,
                status: ticketToAssign.status === 'resolved' || ticketToAssign.status === 'closed' ? ticketToAssign.status : 'assigned'
            };
            if (fullPayload.submittedDate instanceof Date) {
                fullPayload.submittedDate = fullPayload.submittedDate.toISOString();
            }
            let resp = await fetch(`/api/tickets/${ticketToAssign.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(fullPayload)
            });
            if (!resp.ok) {
                const txt1 = await resp.text();
                console.warn('[TicketTracking] Full PUT failed, attempting minimal payload. Status:', resp.status, 'Body:', txt1);
                const minimalPayload = { assignedTo: assignedValue, status: 'assigned' };
                resp = await fetch(`/api/tickets/${ticketToAssign.id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(minimalPayload)
                });
                if (!resp.ok) {
                    const txt2 = await resp.text();
                    console.warn('[TicketTracking] Minimal PUT failed, attempting PATCH. Status:', resp.status, 'Body:', txt2);
                    const patchResp = await fetch(`/api/tickets/${ticketToAssign.id}`, {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(minimalPayload)
                    }).catch(err => {
                        console.error('[TicketTracking] PATCH attempt error:', err);
                        return null;
                    });
                    if (!patchResp || !patchResp.ok) {
                        const patchTxt = patchResp ? await patchResp.text() : 'No response';
                        throw new Error(`Assign failed after retries. PUT(Full) & PUT(Minimal) & PATCH all failed. Last status ${patchResp?.status ?? 'n/a'}: ${patchTxt}`);
                    }
                    // Success via PATCH
                    alert('Ticket assigned successfully!');
                } else {
                    alert('Ticket assigned successfully!');
                }
            } else {
                alert('Ticket assigned successfully!');
            }
            setShowAssignModal(false);
            setTicketToAssign(null);
            setSelectedAgent('');
            fetchTickets();
        } catch (e) {
            console.error('Error assigning ticket:', e);
            const msg = e instanceof Error ? e.message : String(e);
            alert(`Failed to assign ticket. Details: ${msg}`);
        } finally {
            setAssignLoading(false);
        }
    };

    const cancelAssignment = () => {
        setShowAssignModal(false);
        setTicketToAssign(null);
        setSelectedAgent('');
    };

    const handleView = (ticket: Ticket) => {
        navigate(`/admin/tickets/view/${ticket.id}`);
    };

    const handleEdit = (ticket: Ticket) => {
        // Navigate to edit ticket page (to be implemented if needed)
        alert(`Edit ticket #${ticket.id}: ${ticket.title}`);
    };

    const handleDelete = (ticket: Ticket) => {
        setTicketToDelete(ticket);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!ticketToDelete) return;

        setDeleteLoading(true);
        try {
            await axios.delete(`/api/tickets/${ticketToDelete.id}`, { withCredentials: true });
            alert('Ticket deleted successfully!');
            fetchTickets(); // Refresh the list
            setShowDeleteModal(false);
            setTicketToDelete(null);
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Failed to delete ticket');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCreateTicket = () => {
        navigate('/admin/tickets/create');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedPriority('all');
        setSelectedDepartment('all');
        setSelectedCategory('all');
        setSelectedUser('all');
        setCurrentPage(1);
    };

    // Get unique departments for filter dropdown
    const uniqueDepartments = Array.from(new Set(tickets.map(ticket => ticket.department).filter(Boolean)));

    // Filter tickets based on search and filters
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id?.toString().includes(searchTerm);

        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
        const matchesDepartment = selectedDepartment === 'all' || ticket.department === selectedDepartment;
        const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
        const matchesUser = selectedUser === 'all' ||
            ticket.submittedBy === selectedUser ||
            ticket.assignedTo === selectedUser;

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesCategory && matchesUser;
    });

    // Get unique categories from tickets
    const uniqueCategories = [...new Set(tickets.filter(t => t.category).map(t => t.category))].sort();

    // Get unique users from tickets (submitted by and assigned to)
    const uniqueSubmitters = [...new Set(tickets.filter(t => t.submittedBy).map(t => t.submittedBy))];
    const uniqueAssignees = [...new Set(tickets.filter(t => t.assignedTo).map(t => t.assignedTo))];
    const uniqueUsers = [...new Set([...uniqueSubmitters, ...uniqueAssignees])].sort();

    // Paginate tickets
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage);

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
            case 'critical':
                return 'text-red-600 bg-red-100';
            case 'high':
                return 'text-orange-600 bg-orange-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'text-green-600 bg-green-100';
            case 'assigned':
                return 'text-blue-600 bg-blue-100';
            case 'in progress':
                return 'text-yellow-600 bg-yellow-100';
            case 'on hold':
                return 'text-gray-600 bg-gray-100';
            case 'resolved':
                return 'text-purple-600 bg-purple-100';
            case 'closed':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <FaTicketAlt className="mr-3 text-blue-600" />
                            Ticket Tracking
                        </h1>
                        <p className="text-gray-600 mt-1">Track and manage all support tickets</p>
                    </div>
                    <button
                        onClick={handleCreateTicket}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                    >
                        <FiPlus size={20} />
                        Create Ticket
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
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

                    {/* Priority Filter */}
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                        >
                            <option value="all">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {uniqueDepartments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {uniqueCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* User Filter */}
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="all">All Users</option>
                            {uniqueUsers.map(user => (
                                <option key={user} value={user}>{user}</option>
                            ))}
                        </select>
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
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
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned To
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
                            {paginatedTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <FaTicketAlt className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    #{ticket.id}
                                                </div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {ticket.title}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.department || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.submittedBy || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.assignedTo || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ticket.submittedDate ? new Date(ticket.submittedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(ticket)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                title="View Ticket"
                                            >
                                                <FiEye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Unified Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredTickets.length}
                    itemsPerPage={ticketsPerPage}
                    onPageChange={setCurrentPage}
                    startIndex={startIndex}
                />
            </div>

            {/* Assignment Modal */}
            {showAssignModal && ticketToAssign && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-white bg-opacity-10" onClick={cancelAssignment}></div>
                    <div className="relative bg-white w-96 p-6 rounded-lg shadow-lg z-10">
                        <h3 className="text-lg font-semibold mb-4">
                            {ticketToAssign.assignedTo ? 'Reassign Ticket' : 'Assign Ticket'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Ticket #{ticketToAssign.id}: {ticketToAssign.title}
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Agent:
                            </label>
                            {agents.length === 0 ? (
                                <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
                                    No agents loaded (backend /api/users 404). Implement users endpoint or add agent accounts.
                                </div>
                            ) : (
                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={assignLoading}
                                >
                                    <option value="">Select an agent...</option>
                                    {agents.map((agent) => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.firstname} {agent.lastname} ({agent.role})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelAssignment}
                                disabled={assignLoading}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssignment}
                                disabled={assignLoading || !selectedAgent}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {assignLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredTickets.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedDepartment !== 'all'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Get started by creating a new ticket.'}
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={handleCreateTicket}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <FiPlus className="mr-2 h-4 w-4" />
                            Create New Ticket
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Ticket Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setTicketToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Confirm Ticket Deletion"
                message={`Are you sure you want to delete ticket #${ticketToDelete?.id}: ${ticketToDelete?.title}?`}
                confirmText="Yes, Delete Ticket"
                loading={deleteLoading}
            />
        </div>
    );
};

export default TicketTracking;
