import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthService } from "../../../../services/auth/AuthService";
import { PATHS } from "../../../../routes/constant";

interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
}

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    department: string;
    submittedBy: string;
    submittedDate: string;
    assignedTo?: string;
}

const UserDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
    });

    const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserTicketsAndStats = async () => {
            try {
                setLoading(true);

                // Get current user info
                const userId = AuthService.getToken();
                if (!userId) {
                    console.error('No user ID found');
                    return;
                }

                const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
                const user = userResponse.data;

                // Fetch all tickets and filter by user email
                const ticketsResponse = await axios.get('http://localhost:3001/tickets');
                const allTickets = ticketsResponse.data;

                // Filter tickets submitted by the current user
                const userTickets = allTickets.filter((ticket: Ticket) =>
                    ticket.submittedBy === user.email
                );

                // Calculate statistics
                const totalTickets = userTickets.length;
                const openTickets = userTickets.filter((t: Ticket) => t.status === 'open').length;
                const inProgressTickets = userTickets.filter((t: Ticket) =>
                    t.status === 'assigned' || t.status === 'in progress'
                ).length;
                const resolvedTickets = userTickets.filter((t: Ticket) =>
                    t.status === 'resolved' || t.status === 'closed'
                ).length;

                setStats({
                    totalTickets,
                    openTickets,
                    inProgressTickets,
                    resolvedTickets,
                });

                // Set recent tickets (last 5, sorted by submission date)
                const sortedTickets = userTickets
                    .sort((a: Ticket, b: Ticket) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                    .slice(0, 5);

                setRecentTickets(sortedTickets);
            } catch (error) {
                console.error('Error fetching user tickets and stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTicketsAndStats();
    }, []);

    const getStatusBadgeClass = (status: string) => {
        const statusClasses: { [key: string]: string } = {
            "open": "bg-green-100 text-green-800",
            "assigned": "bg-blue-100 text-blue-800",
            "in progress": "bg-blue-100 text-blue-800",
            "on hold": "bg-yellow-100 text-yellow-800",
            "resolved": "bg-purple-100 text-purple-800",
            "closed": "bg-gray-100 text-gray-800"
        };
        return statusClasses[status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadgeClass = (priority: string) => {
        const priorityClasses: { [key: string]: string } = {
            "low": "bg-blue-100 text-blue-800",
            "medium": "bg-orange-100 text-orange-800",
            "high": "bg-red-100 text-red-800",
            "urgent": "bg-red-200 text-red-900",
            "critical": "bg-red-300 text-red-900"
        };
        return priorityClasses[priority.toLowerCase()] || "bg-gray-100 text-gray-800";
    };

    const statCards = [
        {
            title: "Total Tickets",
            value: stats.totalTickets,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
            color: "bg-blue-500",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Open Tickets",
            value: stats.openTickets,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            color: "bg-green-500",
            textColor: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "In Progress",
            value: stats.inProgressTickets,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-yellow-500",
            textColor: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Resolved",
            value: stats.resolvedTickets,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-gray-500",
            textColor: "text-gray-600",
            bgColor: "bg-gray-50",
        },
    ];

    const quickActions = [
        {
            title: "Create New Ticket",
            description: "Submit a new support request",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            link: PATHS.USER.CREATE_TICKET.path,
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            title: "Browse Knowledge Base",
            description: "Find answers to common questions",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            link: PATHS.USER.KNOWLEDGEBASE.path,
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            title: "Submit Feedback",
            description: "Help us improve our service",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            link: PATHS.USER.CREATE_FEEDBACK.path,
            color: "bg-purple-500 hover:bg-purple-600",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                        <p className="text-gray-600">Here's what's happening with your tickets today.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`${card.bgColor} ${card.textColor} p-3 rounded-lg`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`${action.color} text-white p-2 rounded-lg`}>
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">{action.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
                    <Link
                        to={PATHS.USER.MY_TICKETS.path}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View All →
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentTickets.length > 0 ? (
                        recentTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">#{ticket.id} - {ticket.title}</h4>
                                    <p className="text-xs text-gray-500">{ticket.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <p className="text-gray-500">No tickets found</p>
                            <Link
                                to={PATHS.USER.CREATE_TICKET.path}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Create your first ticket
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
