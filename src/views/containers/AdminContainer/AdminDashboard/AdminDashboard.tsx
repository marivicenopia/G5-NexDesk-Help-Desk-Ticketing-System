import React, { useEffect, useState } from "react";
import { AuthService } from "../../../../services/auth/AuthService";
import { TicketService } from "../../../../services/ticket/TicketService";
import { UserService } from "../../../../services/users/UserService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard: React.FC = () => {
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    "in progress": 0,
    resolved: 0,
  });

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAgents, setTotalAgents] = useState(0);
  const [departmentAgents, setDepartmentAgents] = useState(0);
  const [departmentTickets, setDepartmentTickets] = useState(0);
  const [activeDepartmentAgents, setActiveDepartmentAgents] = useState(0);

  // Get current user's role and department
  const currentUserRole = AuthService.getRole();
  const currentUserDepartment = AuthService.getUserDepartment();
  const isAgent = currentUserRole === 'agent';

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch tickets
        const tickets = await TicketService.fetchAll();

        // Fetch users
        const users = await UserService.getAll();

        if (isAgent && currentUserDepartment) {
          // Agent view: Show department-specific data
          const departmentTickets = tickets.filter(t => t.department === currentUserDepartment);
          const departmentUsers = users.filter(u => u.department === currentUserDepartment && u.role === 'agent');
          const activeDeptAgents = departmentUsers.filter(u => u.isActive);

          const counts = {
            open: departmentTickets.filter((t) => t.status === "open").length,
            "in progress": departmentTickets.filter((t) => t.status === "in progress").length,
            resolved: departmentTickets.filter((t) => t.status === "resolved").length,
          };

          setStatusCounts(counts);
          setDepartmentAgents(departmentUsers.length);
          setDepartmentTickets(departmentTickets.length);
          setActiveDepartmentAgents(activeDeptAgents.length);
        } else {
          // Admin view: Show all data
          const counts = {
            open: tickets.filter((t) => t.status === "open").length,
            "in progress": tickets.filter((t) => t.status === "in progress").length,
            resolved: tickets.filter((t) => t.status === "resolved").length,
          };
          setStatusCounts(counts);
          setTotalUsers(users.length);

          // Fetch agents
          const agents = await UserService.getAgents();
          setTotalAgents(agents.length);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, []);

  const chartData = [
    { name: "Open", value: statusCounts.open },
    { name: "In Progress", value: statusCounts["in progress"] },
    { name: "Resolved", value: statusCounts.resolved },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#031849] mb-1">
          {isAgent ? 'Agent Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600">
          {isAgent
            ? `Overview of your department: ${currentUserDepartment}`
            : 'Overview of your help desk system'
          }
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isAgent ? (
          // Agent-specific cards
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Department Agents</h3>
                  <p className="text-3xl font-bold text-blue-600">{departmentAgents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <div className="w-6 h-6 bg-yellow-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Department Tickets</h3>
                  <p className="text-3xl font-bold text-yellow-600">{departmentTickets}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
                  <p className="text-3xl font-bold text-green-600">{activeDepartmentAgents}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Admin-specific cards
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <div className="w-6 h-6 bg-yellow-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Open Tickets</h3>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.open}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Agents</h3>
                  <p className="text-3xl font-bold text-green-600">{totalAgents}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ticket Status Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#031849] mb-2">Ticket Status Overview</h2>
          <p className="text-gray-600">
            {isAgent
              ? `Current distribution of ticket statuses in ${currentUserDepartment}`
              : 'Current distribution of ticket statuses'
            }
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
