import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";
import type { User } from "../../../../types/user";
import { getRoleDisplayName } from "../../../../utils/permissions";
import { AuthService } from "../../../../services/auth/AuthService";

interface SideBarItem {
    path: string;
    label: string;
    icon: React.ReactElement;
}

const UserSideBar: React.FC = () => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("Staff");
    const [initials, setInitials] = useState("S");
    const [departmentDisplay, setDepartmentDisplay] = useState("Staff");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userId = localStorage.getItem("userId");

                if (userId) {
                    const response = await fetch(`https://localhost:5001/api/User/${userId}`, {
                        headers: AuthService.getAuthHeader()
                    });
                    if (response.ok) {
                        const user: User = await response.json();
                        setDisplayName(`${user.firstname} ${user.lastname}`);
                        const firstInitial = user.firstname && user.firstname.length > 0 ? user.firstname[0] : '';
                        const lastInitial = user.lastname && user.lastname.length > 0 ? user.lastname[0] : '';
                        setInitials(`${firstInitial}${lastInitial}`.toUpperCase());
                        // Display department instead of role for staff
                        if (user.role === 'staff' && user.department) {
                            setDepartmentDisplay(user.department);
                        } else {
                            setDepartmentDisplay(getRoleDisplayName(user.role));
                        }
                    } else {
                        // Fallback: try to find user by searching all users
                        const allUsersResponse = await fetch('https://localhost:5001/api/User', {
                            headers: AuthService.getAuthHeader()
                        });
                        const allUsers = await allUsersResponse.json();
                        const foundUser = allUsers.find((u: User) => u.id.toString() === userId);

                        if (foundUser) {
                            setDisplayName(`${foundUser.firstname} ${foundUser.lastname}`);
                            const firstInitial = foundUser.firstname && foundUser.firstname.length > 0 ? foundUser.firstname[0] : '';
                            const lastInitial = foundUser.lastname && foundUser.lastname.length > 0 ? foundUser.lastname[0] : '';
                            setInitials(`${firstInitial}${lastInitial}`.toUpperCase());
                            // Display department instead of role for staff
                            if (foundUser.role === 'staff' && foundUser.department) {
                                setDepartmentDisplay(foundUser.department);
                            } else {
                                setDepartmentDisplay(getRoleDisplayName(foundUser.role));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                // Keep default values if fetch fails
            }
        };

        fetchCurrentUser();
    }, []);

    const handleLogout = () => {
        AuthService.logout()
        // localStorage.removeItem('user');
        // localStorage.removeItem('userRole');
        navigate(PATHS.COMMON.LOGIN.path);
    };

    const sideBarItems: SideBarItem[] = [
        {
            path: PATHS.USER.DASHBOARD.path,
            label: "Dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
                </svg>
            ),
        },
        {
            path: PATHS.USER.CREATE_TICKET.path,
            label: "Create Ticket",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
        },
        {
            path: PATHS.USER.MY_TICKETS.path,
            label: "My Tickets",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
        },
        {
            path: PATHS.USER.KNOWLEDGEBASE.path,
            label: "Knowledge Base",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            path: PATHS.USER.CREATE_FEEDBACK.path,
            label: "Submit Feedback",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
        },
        {
            path: PATHS.USER.SETTINGS.path,
            label: "Settings",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 overflow-y-auto">
            {/* Logo/Brand */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">ND</span>
                    </div>
                    <span className="text-xl font-bold text-[#031849]">NexDesk</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">User Portal</p>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {sideBarItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`
                                }
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Section & Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{initials}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500">{departmentDisplay}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default UserSideBar;
