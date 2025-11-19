import React, { useEffect, useState } from "react";
import type { User } from "../../../../types/user";
import { getRoleDisplayName } from "../../../../utils/permissions";
import { AuthService } from "../../../../services/auth/AuthService";

interface UserHeaderProps {
    title: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ title }) => {
    const [displayName, setDisplayName] = useState("User");
    const [initials, setInitials] = useState("U");
    const [departmentDisplay, setDepartmentDisplay] = useState("User");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // First, try to get user info from stored authentication data
                const storedFullName = AuthService.getUserFullName();
                const storedRole = AuthService.getRole();
                const userId = AuthService.getUserId();

                if (storedFullName && storedFullName.trim() !== '') {
                    setDisplayName(storedFullName);
                    // Generate initials from stored full name
                    const nameParts = storedFullName.split(' ');
                    const firstInitial = nameParts[0]?.[0] || '';
                    const lastInitial = nameParts[nameParts.length - 1]?.[0] || '';
                    setInitials(`${firstInitial}${lastInitial}`.toUpperCase() || 'U');

                    // Set department display from stored role
                    if (storedRole) {
                        setDepartmentDisplay(getRoleDisplayName(storedRole));
                    }
                    return; // Exit early if we have stored data
                }

                // Fallback: try to fetch from API if no stored data
                if (userId) {
                    const response = await fetch(`http://localhost:3001/users/${userId}`);
                    if (response.ok) {
                        const user: User = await response.json();
                        const fullName = `${user.firstname} ${user.lastname}`.trim();
                        setDisplayName(fullName || user.email || 'User');
                        setInitials(`${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase() || 'U');

                        // Display department instead of role for staff
                        if (user.role === 'staff' && user.department) {
                            setDepartmentDisplay(user.department);
                        } else {
                            setDepartmentDisplay(getRoleDisplayName(user.role));
                        }
                    } else {
                        // Fallback: try to find user by searching all users
                        const allUsersResponse = await fetch('http://localhost:3001/users');
                        const allUsers = await allUsersResponse.json();
                        const foundUser = allUsers.find((u: User) => u.id.toString() === userId);

                        if (foundUser) {
                            const fullName = `${foundUser.firstname} ${foundUser.lastname}`.trim();
                            setDisplayName(fullName || foundUser.email || 'User');
                            setInitials(`${foundUser.firstname?.[0] || ''}${foundUser.lastname?.[0] || ''}`.toUpperCase() || 'U');

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
                // Fallback to basic stored data
                const userEmail = AuthService.getUserEmail();
                const storedRole = AuthService.getRole();
                setDisplayName(userEmail || 'User');
                setInitials('U');
                if (storedRole) {
                    setDepartmentDisplay(getRoleDisplayName(storedRole));
                }
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#031849]">{title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome to your portal</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{initials}</span>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-gray-900">{displayName}</p>
                            <p className="text-xs text-gray-500">{departmentDisplay}</p>
                        </div>
                    </div>

                    {/* Notifications */}
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5c-1.414-1.414-3.586-1.414-5 0L15 17zm0 0v-3a2 2 0 012-2h1m0 5h-1M9 7V3a4 4 0 118 0v4m-8 4a4 4 0 108 0V7" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
