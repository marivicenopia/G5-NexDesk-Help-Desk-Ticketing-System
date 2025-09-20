import React, { useEffect, useState } from "react";
import { AuthService } from "../../../../services/auth/AuthService";
import { TicketService } from "../../../../services/ticket/TicketService";
import {
    FiUsers,
    FiClock,
    FiCheckCircle,
    FiTrendingUp,
    FiMessageSquare,
    FiCalendar,
    FiArrowRight,
    FiClipboard,
} from "react-icons/fi";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface DashboardStats {
    assignedTickets: number;
    pendingTickets: number;
    resolvedTickets: number;
    totalTickets: number;
    todayResolved: number;
    thisWeekResolved: number;
}

const AgentDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        assignedTickets: 0,
        pendingTickets: 0,
        resolvedTickets: 0,
        totalTickets: 0,
        todayResolved: 0,
        thisWeekResolved: 0,
    });

    const [recentTickets, setRecentTickets] = useState<any[]>([]);
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [priorityData, setPriorityData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const currentAgent = {
        id: AuthService.getToken(), // Using token as user ID for now
        firstName: AuthService.getUserEmail()?.split('@')[0] || 'Agent',
        email: AuthService.getUserEmail(),
        department: AuthService.getUserDepartment(),
    };
    const agentId = currentAgent?.id;

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all tickets
            const allTickets = await TicketService.fetchAll();

            // Filter tickets assigned to current agent
            const agentTickets = allTickets.filter(ticket =>
                ticket.assignedTo === agentId
            );

            // Calculate statistics
            const assigned = agentTickets.filter(t => t.status === 'open' || t.status === 'in progress').length;
            const pending = agentTickets.filter(t => t.status === 'open').length;
            const resolved = agentTickets.filter(t => t.status === 'resolved').length;
            const total = agentTickets.length;

            // Today's resolved tickets
            const today = new Date().toDateString();
            const todayResolved = agentTickets.filter(t =>
                t.status === 'resolved' &&
                new Date(t.submittedDate).toDateString() === today
            ).length;

            // This week's resolved tickets
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const thisWeekResolved = agentTickets.filter(t =>
                t.status === 'resolved' &&
                new Date(t.submittedDate) >= weekStart
            ).length;

            // Recent tickets (last 5 assigned to agent)
            const recent = agentTickets
                .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                .slice(0, 5);

            // Weekly performance data
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toDateString();
            }).reverse();

            const weeklyPerformance = last7Days.map(dateStr => {
                const dayTickets = agentTickets.filter(t =>
                    new Date(t.submittedDate).toDateString() === dateStr
                );
                const dayResolved = dayTickets.filter(t => t.status === 'resolved').length;

                return {
                    day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
                    resolved: dayResolved,
                    assigned: dayTickets.length,
                };
            });

            // Priority distribution
            const priorityCounts = {
                low: agentTickets.filter(t => t.priority === 'low').length,
                medium: agentTickets.filter(t => t.priority === 'medium').length,
                high: agentTickets.filter(t => t.priority === 'high').length,
                urgent: agentTickets.filter(t => t.priority === 'urgent').length,
            };

            const priorityChart = [
                { name: 'Low', value: priorityCounts.low, color: '#10B981' },
                { name: 'Medium', value: priorityCounts.medium, color: '#F59E0B' },
                { name: 'High', value: priorityCounts.high, color: '#EF4444' },
                { name: 'Urgent', value: priorityCounts.urgent, color: '#7C3AED' },
            ];

            setStats({
                assignedTickets: assigned,
                pendingTickets: pending,
                resolvedTickets: resolved,
                totalTickets: total,
                todayResolved,
                thisWeekResolved,
            });

            setRecentTickets(recent);
            setWeeklyData(weeklyPerformance);
            setPriorityData(priorityChart);

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, change, color = "blue" }: any) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <FiTrendingUp className="h-4 w-4 mr-1" />
                            {change}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            open: "bg-yellow-100 text-yellow-800",
            "in progress": "bg-blue-100 text-blue-800",
            resolved: "bg-green-100 text-green-800",
        };
        return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            low: "bg-green-100 text-green-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
            urgent: "bg-purple-100 text-purple-800",
        };
        return styles[priority as keyof typeof styles] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">
                    Welcome back, {currentAgent?.firstName || 'Agent'}!
                </h1>
                <p className="mt-2 opacity-90">
                    Here's your support dashboard overview for today
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={FiClipboard}
                    title="Assigned Tickets"
                    value={stats.assignedTickets}
                    color="blue"
                />
                <StatCard
                    icon={FiClock}
                    title="Pending"
                    value={stats.pendingTickets}
                    color="yellow"
                />
                <StatCard
                    icon={FiCheckCircle}
                    title="Resolved Today"
                    value={stats.todayResolved}
                    change="+12% from yesterday"
                    color="green"
                />
            </div>            {/* Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Performance Chart */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Weekly Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                            <Bar dataKey="assigned" fill="#3B82F6" name="Assigned" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Ticket Priority Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={priorityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {priorityData.map((entry) => (
                            <div key={entry.name} className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: entry.color }}
                                ></div>
                                <span className="text-sm text-gray-600">
                                    {entry.name}: {entry.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Tickets
                        </h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                            View all
                            <FiArrowRight className="ml-1 h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {recentTickets.length > 0 ? (
                        recentTickets.map((ticket) => (
                            <div key={ticket.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {ticket.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {ticket.description?.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center mt-2 space-x-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(
                                                    ticket.priority
                                                )}`}
                                            >
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                <FiCalendar className="inline h-3 w-3 mr-1" />
                                                {new Date(ticket.submittedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <FiMessageSquare className="h-8 w-8 mx-auto mb-2" />
                            <p>No recent tickets assigned</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                        <FiClipboard className="h-6 w-6 text-blue-600 mb-2" />
                        <h4 className="font-medium text-gray-900">View My Tickets</h4>
                        <p className="text-sm text-gray-600">Manage assigned tickets</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                        <FiUsers className="h-6 w-6 text-green-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Knowledge Base</h4>
                        <p className="text-sm text-gray-600">Browse help articles</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                        <FiMessageSquare className="h-6 w-6 text-purple-600 mb-2" />
                        <h4 className="font-medium text-gray-900">Customer Feedback</h4>
                        <p className="text-sm text-gray-600">Review feedback</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
