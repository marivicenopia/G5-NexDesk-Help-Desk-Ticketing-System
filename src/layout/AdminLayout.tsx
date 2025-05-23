import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../views/components/SideBar/AdminSideBar";
import AdminHeader from "../views/components/Header/AdminHeader";

const AdminLayout: React.FC = () => {
    const location = useLocation();
    
    const hideHeader = location.pathname.startsWith("/admin/settings");

    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                {!hideHeader && (
                    <AdminHeader title="Dashboard" userName="John Doe" />
                )}
                <div className="p-4 flex-1 bg-white">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;