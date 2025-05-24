import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch tickets
        const tickets = await TicketService.fetchAll();
        const counts = {
          open: tickets.filter((t) => t.status === "open").length,
          "in progress": tickets.filter((t) => t.status === "in progress").length,
          resolved: tickets.filter((t) => t.status === "resolved").length,
        };
        setStatusCounts(counts);

        // Fetch users
        const users = await UserService.getAll();
        setTotalUsers(users.length);

        // Fetch agents
        const agents = await UserService.getAgents();
        setTotalAgents(agents.length);
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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Open Tickets</h2>
          <p className="text-3xl font-bold text-yellow-600">{statusCounts.open}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Agents</h2>
          <p className="text-3xl font-bold text-green-600">{totalAgents}</p>
        </div>
      </div>

      {/* Ticket Status Chart */}
      <div className="mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ticket Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
