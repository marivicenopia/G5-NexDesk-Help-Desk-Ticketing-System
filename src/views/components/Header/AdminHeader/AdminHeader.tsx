import React, { useEffect, useState } from "react";
import { AuthService } from "../../../../services/auth/AuthService";
import { UserService } from "../../../../services/users/UserService";

interface AdminHeaderProps {
  title?: string;
  userName?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title = "Dashboard", userName }) => {
  const [displayName, setDisplayName] = useState(userName || "User");
  const [initials, setInitials] = useState("U");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // First, try to get user info from stored authentication data
        const storedFullName = AuthService.getUserFullName();
        const storedRole = AuthService.getRole();
        const userId = AuthService.getUserId();

        if (storedFullName && storedFullName.trim() !== '') {
          setDisplayName(storedFullName);
          setUserRole(storedRole || '');

          // Generate initials from stored full name
          const nameParts = storedFullName.split(' ');
          const firstInitial = nameParts[0]?.[0] || '';
          const lastInitial = nameParts[nameParts.length - 1]?.[0] || '';
          setInitials(`${firstInitial}${lastInitial}`.toUpperCase() || 'U');
          return; // Exit early if we have stored data
        }

        // Fallback: try to fetch from API if no stored data
        if (userId) {
          const users = await UserService.getAll();
          const foundUser = users.find((u: any) => u.id === userId);

          if (foundUser) {
            const fullName = `${foundUser.firstname || ''} ${foundUser.lastname || ''}`.trim();
            setDisplayName(fullName || foundUser.email || 'User');
            setUserRole(foundUser.role || storedRole || '');

            const firstInitial = foundUser.firstname?.[0] || '';
            const lastInitial = foundUser.lastname?.[0] || '';
            setInitials(`${firstInitial}${lastInitial}`.toUpperCase() || 'U');
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Fallback to basic stored data
        const storedRole = AuthService.getRole();
        const userEmail = AuthService.getUserEmail();
        setDisplayName(userEmail || 'User');
        setUserRole(storedRole || '');
        setInitials('U');
      }
    };

    if (!userName) {
      fetchCurrentUser();
    } else {
      setDisplayName(userName);
      setUserRole(AuthService.getRole() || '');
      // Generate initials from provided userName
      const nameParts = userName.split(' ');
      const firstInitial = nameParts[0]?.[0] || '';
      const lastInitial = nameParts[nameParts.length - 1]?.[0] || '';
      setInitials(`${firstInitial}${lastInitial}`.toUpperCase() || 'U');
    }
  }, [userName]);

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-medium text-gray-800">Welcome, {displayName}</span>
            {userRole && (
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
