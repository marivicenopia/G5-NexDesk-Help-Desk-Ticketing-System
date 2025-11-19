import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../services/auth/AuthService";
import { FiClock, FiCheckCircle, FiUser, FiChevronDown } from "react-icons/fi";
import axios from 'axios';

interface AgentHeaderProps {
    title?: string;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ title = "Dashboard" }) => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("Agent");
    const [initials, setInitials] = useState("A");
    const [showProfile, setShowProfile] = useState(false);
    const [agentStats, setAgentStats] = useState({
        activeTasks: 0,
        completedToday: 0
    });

    useEffect(() => {
        fetchCurrentUser();
        fetchAgentStats();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const storedFullName = AuthService.getUserFullName();
            if (storedFullName) {
                setDisplayName(storedFullName);
                const parts = storedFullName.split(' ');
                setInitials(`${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase() || 'A');
                return;
            }
            // Attempt backend current-user endpoint
            const resp = await fetch('/api/user/me', { credentials: 'include', headers: { 'Accept': 'application/json' } });
            if (resp.ok) {
                const user = await resp.json();
                const first = user.firstName || user.firstname || '';
                const last = user.lastName || user.lastname || '';
                const full = `${first} ${last}`.trim();
                setDisplayName(full || user.email || 'Agent');
                setInitials(`${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'A');
            } else {
                const email = AuthService.getUserEmail();
                setDisplayName(email || 'Agent');
                setInitials((email ? email[0] : 'A').toUpperCase());
            }
        } catch (e) {
            console.error('Error fetching current user:', e);
            const email = AuthService.getUserEmail();
            setDisplayName(email || 'Agent');
            setInitials((email ? email[0] : 'A').toUpperCase());
        }
    };

    const fetchAgentStats = async () => {
        try {
            const resp = await fetch('/api/tickets', { credentials: 'include', headers: { 'Accept': 'application/json' } });
            let tickets: any[] = [];
            if (resp.ok) {
                const body = await resp.text();
                let parsed: any;
                try { parsed = body ? JSON.parse(body) : []; } catch { parsed = []; }
                tickets = Array.isArray(parsed) ? parsed : (parsed.response || parsed.tickets || parsed.items || parsed.data || []);
            }
            const email = AuthService.getUserEmail();
            const fullName = AuthService.getUserFullName();
            const agentTickets = tickets.filter(t => t.assignedTo === email || t.assignedTo === fullName);
            const activeTasks = agentTickets.filter(t => ['assigned', 'in progress'].includes((t.status || '').toLowerCase())).length;
            const today = new Date().toDateString();
            const completedToday = agentTickets.filter(t => (t.status || '').toLowerCase() === 'resolved' && new Date(t.resolvedDate || '').toDateString() === today).length;
            setAgentStats({ activeTasks, completedToday });
        } catch (e) {
            console.error('Error fetching agent stats:', e);
        }
    };

    const handleLogout = () => {
        AuthService.logout && AuthService.logout();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                    <p className="text-sm text-gray-500">Agent Dashboard</p>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-6 ml-8">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <FiClock className="text-blue-600" />
                        <div>
                            <div className="text-sm font-semibold text-blue-800">{agentStats.activeTasks}</div>
                            <div className="text-xs text-blue-600">Active Tasks</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                        <FiCheckCircle className="text-green-600" />
                        <div>
                            <div className="text-sm font-semibold text-green-800">{agentStats.completedToday}</div>
                            <div className="text-xs text-green-600">Completed Today</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-800">{displayName}</div>
                            <div className="text-xs text-gray-500">Support Agent</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
                            {initials}
                        </div>
                        <FiChevronDown className="text-gray-400" size={16} />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
                                        {initials}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{displayName}</div>
                                        <div className="text-sm text-gray-500">Support Agent</div>
                                    </div>
                                </div>
                            </div>
                            <div className="py-2">
                                <button
                                    onClick={() => {
                                        navigate('/agent/settings');
                                        setShowProfile(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <FiUser size={16} />
                                    Settings
                                </button>
                                <hr className="my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside handlers */}
            {showProfile && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowProfile(false);
                    }}
                />
            )}
        </header>
    );
};

export default AgentHeader;
