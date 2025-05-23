import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../views/components/SideBar/AdminSideBar";
import AdminHeader from "../views/components/Header/AdminHeader";

const AdminLayout: React.FC = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                <AdminHeader title="Dashboard" userName="John Doe" />

                <div className="p-4 flex-1 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;