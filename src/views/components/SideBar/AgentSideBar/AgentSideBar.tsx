import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AgentSideBarItems, AgentSideBarFooterItems } from "./sideBarItems";
import AgentSidebarSubmenu from "./AgentSideBarSubMenu";
import { AuthService } from "../../../../services/auth/AuthService";
import axios from 'axios';

const AgentSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [agentStats, setAgentStats] = useState({
        assignedTickets: 0,
        pendingTickets: 0,
        resolvedToday: 0
    });
    const [userInfo, setUserInfo] = useState({ firstname: '', lastname: '' });

    useEffect(() => {
        fetchAgentStats();
        fetchUserInfo();
    }, []);

    const fetchAgentStats = async () => {
        try {
            const response = await axios.get('http://localhost:3001/tickets');
            const tickets = response.data || [];
            const userId = AuthService.getToken();

            if (userId) {
                const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
                const user = userResponse.data;
                const agentName = `${user.firstname} ${user.lastname}`;

                const assigned = tickets.filter((t: any) => t.assignedTo === agentName).length;
                const pending = tickets.filter((t: any) =>
                    t.assignedTo === agentName && ['open', 'assigned', 'in progress'].includes(t.status)
                ).length;
                const today = new Date().toDateString();
                const resolvedToday = tickets.filter((t: any) =>
                    t.assignedTo === agentName &&
                    t.status === 'resolved' &&
                    new Date(t.resolvedDate || '').toDateString() === today
                ).length;

                setAgentStats({ assignedTickets: assigned, pendingTickets: pending, resolvedToday });
            }
        } catch (error) {
            console.error('Error fetching agent stats:', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const userId = AuthService.getToken();
            if (userId) {
                const response = await axios.get(`http://localhost:3001/users/${userId}`);
                setUserInfo(response.data);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleLogout = () => {
        AuthService.logout()
    };

    const handleToggle = (label: string, hasChildren: boolean) => {
        if (!hasChildren) {
            setActiveMenu(null);
        } else {
            setActiveMenu(activeMenu === label ? null : label);
        }
    };

    const isActiveRoute = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div
            className="flex min-h-screen"
            onMouseLeave={() => {
                // Clear active menu when mouse leaves the entire sidebar area
                setActiveMenu(null);
            }}
        >
            <div
                className={`flex flex-col justify-between bg-[#192F64] text-white py-4 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'
                    } relative`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => {
                    setIsExpanded(false);
                    // Don't clear activeMenu here, let the parent container handle it
                }}
            >
                {/* Agent Profile Section */}
                {isExpanded && (
                    <div className="px-4 pb-6 border-b border-white/20">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {userInfo.firstname[0]}{userInfo.lastname[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{userInfo.firstname} {userInfo.lastname}</p>
                                <p className="text-xs text-blue-200">Support Agent</p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-white/10 rounded p-2">
                                <div className="text-lg font-bold text-blue-200">{agentStats.assignedTickets}</div>
                                <div className="text-xs">Assigned</div>
                            </div>
                            <div className="bg-white/10 rounded p-2">
                                <div className="text-lg font-bold text-yellow-200">{agentStats.pendingTickets}</div>
                                <div className="text-xs">Pending</div>
                            </div>
                            <div className="bg-white/10 rounded p-2">
                                <div className="text-lg font-bold text-green-200">{agentStats.resolvedToday}</div>
                                <div className="text-xs">Resolved</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <div className="flex flex-col space-y-2 px-2 flex-1">
                    {AgentSideBarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path ? isActiveRoute(item.path) : false;

                        return (
                            <div key={item.label}>
                                <div
                                    className={`cursor-pointer group relative transition-all duration-200 ${isActive ? 'bg-blue-600' : 'hover:bg-white/10'
                                        } rounded-lg`}
                                    onClick={() => handleToggle(item.label, !!item.children)}
                                >
                                    {item.path ? (
                                        <Link
                                            to={item.path}
                                            className="flex items-center space-x-3 p-3"
                                        >
                                            <Icon className="text-xl flex-shrink-0" />
                                            {isExpanded && (
                                                <span className="text-sm font-medium">{item.label}</span>
                                            )}
                                        </Link>
                                    ) : (
                                        <div className="flex items-center space-x-3 p-3">
                                            <Icon className="text-xl flex-shrink-0" />
                                            {isExpanded && (
                                                <>
                                                    <span className="text-sm font-medium flex-1">{item.label}</span>
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${activeMenu === item.label ? 'rotate-180' : ''
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {!isExpanded && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </div>

                                {/* Submenu */}
                                {isExpanded && activeMenu === item.label && item.children && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                to={child.path}
                                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${isActiveRoute(child.path)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Items */}
                <div className="px-2 pt-6 border-t border-white/20">
                    {AgentSideBarFooterItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path ? isActiveRoute(item.path) : false;

                        return item.action ? (
                            <button
                                key={item.label}
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-600/20 rounded-lg transition-colors group"
                            >
                                <Icon className="text-xl flex-shrink-0" />
                                {isExpanded && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                                {!isExpanded && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        ) : item.path ? (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${isActive ? 'bg-blue-600' : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="text-xl flex-shrink-0" />
                                {isExpanded && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                                {!isExpanded && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ) : null;
                    })}
                </div>
            </div>

            {/* Submenu for collapsed state */}
            {!isExpanded && activeMenu && (
                <div
                    className="absolute left-full top-0 z-50"
                    onMouseEnter={(e) => {
                        // Keep submenu open when hovering over it
                        e.stopPropagation();
                    }}
                >
                    <AgentSidebarSubmenu
                        items={AgentSideBarItems.find((i) => i.label === activeMenu)?.children || []}
                        onClose={() => setActiveMenu(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default AgentSidebar;
