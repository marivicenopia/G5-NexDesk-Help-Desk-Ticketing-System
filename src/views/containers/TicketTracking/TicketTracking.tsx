import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiUser, FiUserCheck } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import type { Ticket } from '../../../types/ticket';
import { Pagination } from '../../components/Pagination';
import { DeleteModal } from '../../components/DeleteModal';
import { AuthService } from '../../../services/auth/AuthService';
// Import the standard color helpers
import { getStatusColor, getPriorityColor } from '../../../utils/statusColors';

// Local lightweight agent type for assignment list
type AgentOption = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    isActive?: boolean;
};

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
    
    // Modal & Action states
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const ticketsPerPage = 10;
    const navigate = useNavigate();
    const currentUserRole = AuthService.getRole();

    useEffect(() => {
        fetchTickets();
        fetchAgents();
    }, []);

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
            const assignedValue = agent?.email || agent?.id || selectedAgent;
            
            const payload = { 
                ...ticketToAssign,
                assignedTo: assignedValue,
                status: ticketToAssign.status === 'resolved' || ticketToAssign.status === 'closed' ? ticketToAssign.status : 'assigned'
            };

            if ((payload as any).submittedDate instanceof Date) {
                (payload as any).submittedDate = (payload as any).submittedDate.toISOString();
            }

            await axios.put(`/api/tickets/${ticketToAssign.id}`, payload, { withCredentials: true });
            
            alert('Ticket assigned successfully!');
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
            fetchTickets();
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

    // Filters & Pagination Logic
    const uniqueDepartments = Array.from(new Set(tickets.map(ticket => ticket.department).filter(Boolean)));
    const uniqueCategories = [...new Set(tickets.filter(t => t.category).map(t => t.category))].sort();
    const uniqueUsers = [...new Set([...tickets.map(t => t.submittedBy), ...tickets.map(t => t.assignedTo)].filter(Boolean))].sort();

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
        const matchesUser = selectedUser === 'all' || ticket.submittedBy === selectedUser || ticket.assignedTo === selectedUser;

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesCategory && matchesUser;
    });

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage);

    // NOTE: Local getPriorityColor and getStatusColor functions were removed 
    // because we are now importing the standard ones from utils/statusColors.

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
                    <button onClick={handleCreateTicket} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                        <FiPlus size={20} /> Create Ticket
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                    </select>

                    <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="all">All Departments</option>
                        {uniqueDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>

                    <select className="border border-gray-300 rounded-lg px-3 py-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <button onClick={clearFilters} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Clear Filters</button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                                        <div className="text-xs text-gray-500">#{ticket.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {ticket.assignedTo || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium flex gap-2">
                                        <button onClick={() => handleView(ticket)} className="text-blue-600 hover:text-blue-900 p-1" title="View">
                                            <FiEye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredTickets.length} itemsPerPage={ticketsPerPage} onPageChange={setCurrentPage} startIndex={startIndex} />
                </div>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent:</label>
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
                            <button onClick={cancelAssignment} disabled={assignLoading} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50">Cancel</button>
                            <button onClick={confirmAssignment} disabled={assignLoading || !selectedAgent} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {assignLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
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