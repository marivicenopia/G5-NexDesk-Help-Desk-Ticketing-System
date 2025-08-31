// ViewTicket.tsx - Display All Tickets with Filtering (View Only)
import React, { useState, useEffect, type JSX } from 'react';
import { ticketService } from './services/ticketService';
import type { Ticket } from './services/ticketService';

function ViewTicket(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    search: ''
  });

  // Available filter options
  const statusOptions = ['open', 'in-progress', 'resolved', 'closed'];
  const priorityOptions = ['Critical', 'High', 'Medium', 'Low'];
  const categoryOptions = ['Software', 'Hardware', 'Network', 'Security', 'Database', 'Other'];

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ticketsData = await ticketService.getAllTickets();
        
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever tickets or filters change
  useEffect(() => {
    let filtered = [...tickets];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(ticket => 
        ticket.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(ticket => 
        ticket.priorityStatus.toLowerCase() === filters.priority.toLowerCase()
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(ticket => 
        ticket.ticketCategory.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by assigned user
    if (filters.assignedTo) {
      filtered = filtered.filter(ticket => 
        ticket.assignedTo?.toLowerCase().includes(filters.assignedTo.toLowerCase())
      );
    }

    // Filter by search term (searches in customer name, email, description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.customerName.toLowerCase().includes(searchTerm) ||
        ticket.customerEmail.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, filters]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      assignedTo: '',
      search: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-purple-100 text-purple-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-5 bg-white w-full h-screen overflow-y-auto text-center">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-5 bg-white w-full h-screen overflow-y-auto text-red-500 text-center">Error: {error}</div>;
  }

  // Get unique assigned users for filter dropdown
  const assignedUsers = Array.from(new Set(
    tickets
      .map(t => t.assignedTo)
      .filter((user): user is string => Boolean(user))
  ));

  return (
    <div className="p-5 bg-white w-full h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">View Tickets</h1>
      
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by customer name, email, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Assigned To Filter */}
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              <option value="">Unassigned</option>
              {assignedUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b grid grid-cols-7 text-sm font-medium text-gray-700">
          <div className="flex items-center">
            <span className="mr-1.5 text-yellow-500">📋</span> ID
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-purple-500">👤</span> CUSTOMER
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-blue-500">📧</span> EMAIL
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-green-500">📁</span> CATEGORY
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-orange-500">⚡</span> PRIORITY
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-blue-500">🔄</span> STATUS
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-gray-500">👥</span> ASSIGNED
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {tickets.length === 0 ? 'No tickets found' : 'No tickets match the current filters'}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="grid grid-cols-7 p-3 border-b hover:bg-gray-50">
                <div className="text-[#333] font-medium">{ticket.id}</div>
                <div className="text-[#333] truncate">{ticket.customerName}</div>
                <div className="text-[#333] truncate" title={ticket.customerEmail}>
                  {ticket.customerEmail}
                </div>
                <div className="text-[#333] text-sm">{ticket.ticketCategory}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priorityStatus)}`}>
                    {ticket.priorityStatus?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status?.toUpperCase()}
                  </span>
                </div>
                <div className="text-[#333] text-sm truncate">
                  {ticket.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-yellow-800 font-semibold">Open</div>
          <div className="text-2xl font-bold text-yellow-900">
            {tickets.filter(t => t.status === 'open').length}
          </div>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-blue-800 font-semibold">In Progress</div>
          <div className="text-2xl font-bold text-blue-900">
            {tickets.filter(t => t.status === 'in-progress').length}
          </div>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-green-800 font-semibold">Resolved</div>
          <div className="text-2xl font-bold text-green-900">
            {tickets.filter(t => t.status === 'resolved').length}
          </div>
        </div>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="text-gray-800 font-semibold">Total</div>
          <div className="text-2xl font-bold text-gray-900">
            {tickets.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTicket;