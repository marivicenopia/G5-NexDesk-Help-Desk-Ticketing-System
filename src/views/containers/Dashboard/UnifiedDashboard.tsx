import React, { useState, useEffect } from 'react';
import { DashboardApiService, type DashboardData } from '../../../services/dashboard/DashboardApiService';
import {
    FaTicketAlt,
    FaUsers,
    FaExclamationTriangle,
    FaClock,
    FaCheckCircle,
    FaTasks,
    FaUserCheck
} from 'react-icons/fa';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
// Add this with your other imports
import { getStatusColor, getPriorityColor } from '../../../utils/statusColors';

// Define types locally since we may not have the exact type files
type RoleOption = 'staff' | 'admin' | 'agent' | 'superadmin';

interface DashboardProps {
    role: RoleOption;
}

const UnifiedDashboard: React.FC<DashboardProps> = ({ role }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, [role]);
    
    // const loadDashboardDataTest = setInterval(function(){
    //     const dataTest = await DashboardApiService.getDashboardData();
    //     setDashboardData(data);
    // }, 1000)
    
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get dashboard data from backend API
            const data = await DashboardApiService.getDashboardData();
            setDashboardData(data);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={loadDashboardData}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return null;
    }

    const { stats, ticketsByPriority, ticketTrends, recentTickets } = dashboardData;
    // Define Hex colors for the Pie Chart to match your badges
    const priorityHexColors: { [key: string]: string } = {
    low: '#DBEAFE',      // Blue-100 (matches 'bg-blue-100')
    medium: '#FEF9C3',   // Yellow-100
    high: '#FFEDD5',     // Orange-100
    urgent: '#FEE2E2',   // Red-100
    critical: '#FECACA', // Red-200
    };

    const getStatCards = () => {
        const baseCards = [
            {
                title: "Total Tickets",
                value: stats.totalTickets,
                icon: FaTicketAlt,
                color: "bg-blue-500",
                textColor: "text-blue-600",
                bgColor: "bg-blue-50",
            },
            {
                title: "Open Tickets",
                value: stats.openTickets,
                icon: FaExclamationTriangle,
                color: "bg-red-500",
                textColor: "text-red-600",
                bgColor: "bg-red-50",
            },
            {
                title: "In Progress",
                value: stats.inProgressTickets,
                icon: FaClock,
                color: "bg-yellow-500",
                textColor: "text-yellow-600",
                bgColor: "bg-yellow-50",
            },
            {
                title: "Resolved",
                value: stats.resolvedTickets,
                icon: FaCheckCircle,
                color: "bg-green-500",
                textColor: "text-green-600",
                bgColor: "bg-green-50",
            },
        ];

        // Add role-specific cards for admins
        if (role === 'superadmin' || role === 'admin') {
            baseCards.push(
                {
                    title: "Total Users",
                    value: stats.totalUsers,
                    icon: FaUsers,
                    color: "bg-indigo-500",
                    textColor: "text-indigo-600",
                    bgColor: "bg-indigo-50",
                },
                {
                    title: "Active Users",
                    value: stats.activeUsers,
                    icon: FaUserCheck,
                    color: "bg-teal-500",
                    textColor: "text-teal-600",
                    bgColor: "bg-teal-50",
                },
                {
                    title: "Total Agents",
                    value: stats.totalAgents,
                    icon: FaTasks,
                    color: "bg-purple-500",
                    textColor: "text-purple-600",
                    bgColor: "bg-purple-50",
                }
            );
        }

        return baseCards;
    };

    const getRoleTitle = () => {
        switch (role) {
            case 'superadmin': return 'Super Administrator Dashboard';
            case 'admin': return 'Administrator Dashboard';
            case 'agent': return 'Agent Dashboard';
            case 'staff': return 'User Dashboard';
            default: return 'Dashboard';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const statCards = getStatCards();

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{getRoleTitle()}</h1>
                <p className="text-gray-600 mt-2">
                    Welcome back! Here's what's happening with your system.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow`}>
                        <div className="flex items-center">
                            <div className={`${card.color} p-3 rounded-lg text-white mr-4`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Trends (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={ticketTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Created" />
                            <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ticketsByPriority.map(item => ({
                                name: item.priority,
                                value: item.count,
                                // We ignore the 'item.color' from the API and force our own Hex color
                                color: priorityHexColors[item.priority.toLowerCase()] || '#E5E7EB'
                                }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {ticketsByPriority.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={priorityHexColors[entry.priority.toLowerCase()] || '#E5E7EB'} 
                                />
                            ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Recent Tickets
                        {role === 'staff' && ' (My Tickets)'}
                        {role === 'agent' && ' (Assigned to Me)'}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticket ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{ticket.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {ticket.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(ticket.submittedDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UnifiedDashboard;