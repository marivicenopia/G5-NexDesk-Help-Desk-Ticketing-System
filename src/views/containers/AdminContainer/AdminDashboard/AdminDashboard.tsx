import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthService } from "../../../../services/auth/AuthService";
import {
  FaTicketAlt,
  FaChartBar,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import type { Ticket } from '../../../../types/ticket';
import type { User } from '../../../../types/user';

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  assignedTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
}

interface CategoryStats {
  [key: string]: number;
}

interface PriorityStats {
  low: number;
  medium: number;
  high: number;
  urgent: number;
  critical: number;
}

interface UserActivityStats {
  [key: string]: {
    name: string;
    ticketsSubmitted: number;
    ticketsResolved: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user's role and department
  const currentUserRole = AuthService.getRole();
  const currentUserDepartment = AuthService.getUserDepartment();
  const isAgent = currentUserRole === 'agent';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3001/tickets'),
        axios.get('http://localhost:3001/users')
      ]);
      setTickets(ticketsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate ticket statistics
  const getTicketStats = (): TicketStats => {
    const filteredTickets = isAgent && currentUserDepartment
      ? tickets.filter(t => t.department === currentUserDepartment)
      : tickets;

    return {
      totalTickets: filteredTickets.length,
      openTickets: filteredTickets.filter(t => t.status === 'open').length,
      assignedTickets: filteredTickets.filter(t => t.status === 'assigned').length,
      inProgressTickets: filteredTickets.filter(t => t.status === 'in progress').length,
      resolvedTickets: filteredTickets.filter(t => t.status === 'resolved').length,
      closedTickets: filteredTickets.filter(t => t.status === 'closed').length,
    };
  };

  // Calculate category statistics
  const getCategoryStats = (): CategoryStats => {
    const filteredTickets = isAgent && currentUserDepartment
      ? tickets.filter(t => t.department === currentUserDepartment)
      : tickets;

    const stats: CategoryStats = {};
    filteredTickets.forEach(ticket => {
      const category = ticket.department || 'Uncategorized';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  };

  // Calculate priority statistics
  const getPriorityStats = (): PriorityStats => {
    const filteredTickets = isAgent && currentUserDepartment
      ? tickets.filter(t => t.department === currentUserDepartment)
      : tickets;

    return {
      low: filteredTickets.filter(t => t.priority === 'low').length,
      medium: filteredTickets.filter(t => t.priority === 'medium').length,
      high: filteredTickets.filter(t => t.priority === 'high').length,
      urgent: filteredTickets.filter(t => t.priority === 'urgent').length,
      critical: filteredTickets.filter(t => t.priority === 'critical').length,
    };
  };

  // Calculate user activity statistics
  const getUserActivityStats = (): UserActivityStats => {
    const filteredTickets = isAgent && currentUserDepartment
      ? tickets.filter(t => t.department === currentUserDepartment)
      : tickets;

    const stats: UserActivityStats = {};

    // Initialize with all users
    users.forEach(user => {
      const fullName = `${user.firstname} ${user.lastname}`;
      stats[user.email] = {
        name: fullName,
        ticketsSubmitted: 0,
        ticketsResolved: 0,
      };
    });

    // Count submitted tickets
    filteredTickets.forEach(ticket => {
      if (ticket.submittedBy && stats[ticket.submittedBy]) {
        stats[ticket.submittedBy].ticketsSubmitted++;
      }
    });

    // Count resolved tickets
    filteredTickets.forEach(ticket => {
      if (ticket.resolvedBy && stats[ticket.resolvedBy]) {
        stats[ticket.resolvedBy].ticketsResolved++;
      }
    });

    return stats;
  };

  const ticketStats = getTicketStats();
  const categoryStats = getCategoryStats();
  const priorityStats = getPriorityStats();
  const userActivityStats = getUserActivityStats();

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#031849] flex items-center">
          <FaChartBar className="mr-3 text-blue-600" />
          {isAgent ? 'Agent Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAgent
            ? `Overview of ticket data for ${currentUserDepartment} department`
            : 'Overview of ticket data by category, status, priority, and user activity'
          }
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaTicketAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{ticketStats.totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaClock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{ticketStats.openTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{ticketStats.inProgressTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{ticketStats.resolvedTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries({
              'Open': { count: ticketStats.openTickets, color: 'bg-green-500' },
              'Assigned': { count: ticketStats.assignedTickets, color: 'bg-blue-500' },
              'In Progress': { count: ticketStats.inProgressTickets, color: 'bg-yellow-500' },
              'Resolved': { count: ticketStats.resolvedTickets, color: 'bg-purple-500' },
              'Closed': { count: ticketStats.closedTickets, color: 'bg-red-500' },
            }).map(([status, { count, color }]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${ticketStats.totalTickets ? (count / ticketStats.totalTickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {Object.entries({
              'Critical': { count: priorityStats.critical, color: 'bg-red-600' },
              'Urgent': { count: priorityStats.urgent, color: 'bg-red-500' },
              'High': { count: priorityStats.high, color: 'bg-orange-500' },
              'Medium': { count: priorityStats.medium, color: 'bg-yellow-500' },
              'Low': { count: priorityStats.low, color: 'bg-blue-500' },
            }).map(([priority, { count, color }]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{priority}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${ticketStats.totalTickets ? (count / ticketStats.totalTickets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate mr-2">{category}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${ticketStats.totalTickets ? (count / ticketStats.totalTickets) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">User</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Submitted</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(userActivityStats)
                  .filter(([, stats]) => stats.ticketsSubmitted > 0 || stats.ticketsResolved > 0)
                  .sort(([, a], [, b]) => (b.ticketsSubmitted + b.ticketsResolved) - (a.ticketsSubmitted + a.ticketsResolved))
                  .slice(0, 10)
                  .map(([email, stats]) => (
                    <tr key={email}>
                      <td className="py-2 text-sm text-gray-900 truncate max-w-32">{stats.name}</td>
                      <td className="py-2 text-sm text-gray-900">{stats.ticketsSubmitted}</td>
                      <td className="py-2 text-sm text-gray-900">{stats.ticketsResolved}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
