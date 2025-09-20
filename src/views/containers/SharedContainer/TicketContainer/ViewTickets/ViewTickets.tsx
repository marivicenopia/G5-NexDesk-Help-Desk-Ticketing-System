import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import type { Ticket } from '../../../../../types/ticket';
import TicketTable from '../../../../components/TicketTable';
import ResolveTicketModal from '../../../../components/ResolveTicketModal';
import AssignTicketModal, { type AssignmentData } from '../../../../components/AssignTicketModal';
import { DeleteModal } from '../../../../components/DeleteModal';
import { AuthService } from '../../../../../services/auth/AuthService';
import { PreferencesService } from '../../../../../services/preferences/PreferencesService';

const ViewTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedTicketForResolve, setSelectedTicketForResolve] = useState<Ticket | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Load user preferences on component mount
  useEffect(() => {
    const userId = AuthService.getToken();
    const userRole = AuthService.getRole();

    // Load preferences for staff and agents
    if (userId && (userRole === 'staff' || userRole === 'agent')) {
      const preferences = PreferencesService.getPreferences(userId);
      setStatusFilter(preferences.defaultStatus);
      setPriorityFilter(preferences.defaultPriority);
      setItemsPerPage(preferences.itemsPerPage);
    }
  }, []);

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

      // Filter tickets based on user role
      const userRole = AuthService.getRole();
      const userEmail = AuthService.getUserEmail();
      const userDepartment = AuthService.getUserDepartment();

      let filteredData = data;

      // For agents, only show tickets assigned to them or in their department
      if (userRole === 'agent' && userEmail) {
        filteredData = data.filter((ticket: Ticket) => {
          // Show tickets assigned to this agent
          const isAssignedToAgent = ticket.assignedTo === userEmail;

          // Show tickets in the same department (with department mapping)
          const isDepartmentMatch = userDepartment &&
            (ticket.department === userDepartment ||
              // Map common department names
              (userDepartment === 'IT' && (
                ticket.department === 'IT Support' ||
                ticket.department === 'Software Support' ||
                ticket.department === 'Hardware Support' ||
                ticket.department === 'Network Operations' ||
                ticket.department === 'Email Support'
              )) ||
              (userDepartment === 'HR' && (
                ticket.department === 'Human Resources' ||
                ticket.department === 'Facility Management'
              )));

          return isAssignedToAgent || isDepartmentMatch;
        });
      } setTickets(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    const matchesUser = userFilter === 'all' ||
      ticket.submittedBy === userFilter ||
      ticket.assignedTo === userFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesUser;
  });

  // Apply user's preferred sorting
  const sortedTickets = React.useMemo(() => {
    const userId = AuthService.getToken();
    const userRole = AuthService.getRole();

    if (userId && (userRole === 'staff' || userRole === 'agent')) {
      const preferences = PreferencesService.getPreferences(userId);
      const sortBy = preferences.defaultSortBy;
      const sortOrder = preferences.defaultSortOrder;

      return [...filteredTickets].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'priority':
            const priorityOrder = { 'critical': 4, 'urgent': 3, 'high': 2, 'medium': 1, 'low': 0 };
            aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'submittedDate':
            aValue = new Date(a.submittedDate || 0).getTime();
            bValue = new Date(b.submittedDate || 0).getTime();
            break;
          case 'title':
            aValue = a.title || '';
            bValue = b.title || '';
            break;
          case 'department':
            aValue = a.department || '';
            bValue = b.department || '';
            break;
          default:
            aValue = a.submittedDate || '';
            bValue = b.submittedDate || '';
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filteredTickets;
  }, [filteredTickets, statusFilter, priorityFilter]);

  // Get unique categories from tickets
  const uniqueCategories = [...new Set(tickets.filter(t => t.category).map(t => t.category))].sort();

  // Get unique users from tickets (submitted by and assigned to)
  const uniqueSubmitters = [...new Set(tickets.filter(t => t.submittedBy).map(t => t.submittedBy))];
  const uniqueAssignees = [...new Set(tickets.filter(t => t.assignedTo).map(t => t.assignedTo))];
  const uniqueUsers = [...new Set([...uniqueSubmitters, ...uniqueAssignees])].sort();

  const handleView = (ticket: Ticket) => {
    // Navigate to ticket detail view
    navigate(`/agent/tickets/view/${ticket.id}`);
  };

  const handleEdit = (ticket: Ticket) => {
    // Navigate to edit ticket form
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
      const response = await fetch(`http://localhost:3001/tickets/${ticketToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      setTickets(tickets.filter(t => t.id !== ticketToDelete.id));
      setShowDeleteModal(false);
      setTicketToDelete(null);
    } catch (err) {
      alert('Failed to delete ticket');
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleResolve = (ticket: Ticket) => {
    setSelectedTicketForResolve(ticket);
    setIsResolveModalOpen(true);
  };

  const handleResolveConfirm = async (ticketId: string | number, resolutionData: {
    resolutionDescription: string;
    agentFeedback: string;
    resolvedBy: string;
    resolvedDate: string;
  }) => {
    try {
      const ticketToUpdate = tickets.find(t => t.id === ticketId);
      if (!ticketToUpdate) {
        throw new Error('Ticket not found');
      }

      const updatedTicket: Ticket = {
        ...ticketToUpdate,
        status: 'resolved' as const,
        ...resolutionData
      };

      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket)
      });

      if (!response.ok) {
        throw new Error('Failed to resolve ticket');
      }

      // Update the tickets list with the resolved ticket
      setTickets(tickets.map(t =>
        t.id === ticketId ? updatedTicket : t
      ));

      alert('Ticket resolved successfully!');
    } catch (error) {
      console.error('Error resolving ticket:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleAssign = (ticket: Ticket) => {
    console.log('Assignment button clicked for ticket:', ticket);
    setSelectedTicketForAssign(ticket);
    setIsAssignModalOpen(true);
  };

  const handleAssignConfirm = async (ticketId: string | number, assignmentData: AssignmentData) => {
    try {
      const ticketToUpdate = tickets.find(t => t.id === ticketId);
      if (!ticketToUpdate) {
        throw new Error('Ticket not found');
      }

      const updatedTicket: Ticket = {
        ...ticketToUpdate,
        assignedTo: assignmentData.assignedTo,
        // Add assignment metadata if your ticket type supports it
        // assignedBy: assignmentData.assignedBy,
        // assignedDate: assignmentData.assignedDate,
        // assignmentNotes: assignmentData.assignmentNotes
      };

      const response = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket)
      });

      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }

      // Update the tickets list with the assigned ticket
      setTickets(tickets.map(t =>
        t.id === ticketId ? updatedTicket : t
      ));

      setIsAssignModalOpen(false);
      setSelectedTicketForAssign(null);
      alert('Ticket assigned successfully!');
    } catch (error) {
      console.error('Error assigning ticket:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleAddTicket = () => {
    navigate('/admin/tickets/create');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setUserFilter('all');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading tickets...</div>
          <div className="mt-2 text-sm text-gray-500">Please wait while we fetch the ticket data.</div>
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
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#031849] mb-1">Manage Tickets</h1>
            <p className="text-gray-600">Manage and track all support tickets</p>
          </div>
          <button
            onClick={handleAddTicket}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Ticket
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <TicketTable
          data={sortedTickets}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResolve={handleResolve}
          onAssign={handleAssign}
          showResolveAction={true}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Resolve Ticket Modal */}
      <ResolveTicketModal
        ticket={selectedTicketForResolve}
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onResolve={handleResolveConfirm}
      />

      {/* Assign Ticket Modal */}
      <AssignTicketModal
        ticket={selectedTicketForAssign}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignConfirm}
      />

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

export default ViewTickets;
