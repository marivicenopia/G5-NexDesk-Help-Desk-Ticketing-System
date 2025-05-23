import React from "react";

interface AdminHeaderProps {
    title?: string;
    userName?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title = "Dashboard", userName = "Admin" }) => {
    return (
        <header className="w-full px-6 py-4 bg-white shadow flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#192F64]">{title}</h1>

            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {userName}</span>
                <div className="w-10 h-10 rounded-full bg-[#192F64] flex items-center justify-center text-white font-bold">
                    {userName[0]}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;