<<<<<<< HEAD
import React from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> origin/main

interface AdminHeaderProps {
  title?: string;
  userName?: string;
}

<<<<<<< HEAD
const AdminHeader: React.FC<AdminHeaderProps> = ({ title = "Dashboard", userName = "Admin" }) => {
  return (
    <header className="w-full px-6 py-4 bg-white shadow flex items-center justify-between">
      <h1 className="text-xl font-semibold text-[#192F64]">{title}</h1>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">Welcome, {userName}</span>
        <div className="w-10 h-10 rounded-full bg-[#192F64] flex items-center justify-center text-white font-bold">
          {userName[0]}
=======
const AdminHeader: React.FC<AdminHeaderProps> = ({ title = "Dashboard", userName }) => {
  const [displayName, setDisplayName] = useState(userName || "Staff");
  const [initials, setInitials] = useState("S");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (userId) {
          const response = await fetch(`http://localhost:3001/users/${userId}`);
          if (response.ok) {
            const user = await response.json();
            setDisplayName(`${user.firstname} ${user.lastname}`);
            setInitials(`${user.firstname[0] || ''}${user.lastname[0] || ''}`.toUpperCase());
          } else {
            // Fallback: try to find user by role if direct ID lookup fails
            const allUsersResponse = await fetch('http://localhost:3001/users');
            const allUsers = await allUsersResponse.json();
            const foundUser = allUsers.find((u: any) => u.id.toString() === userId);

            if (foundUser) {
              setDisplayName(`${foundUser.firstname} ${foundUser.lastname}`);
              setInitials(`${foundUser.firstname[0] || ''}${foundUser.lastname[0] || ''}`.toUpperCase());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Keep default values if fetch fails
      }
    };

    if (!userName) {
      fetchCurrentUser();
    } else {
      setDisplayName(userName);
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
          <span className="text-sm text-gray-600">Welcome, {displayName}</span>
          <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
            {initials}
          </div>
>>>>>>> origin/main
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
