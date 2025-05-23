import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../views/components/SideBar/AdminSideBar";
import AdminHeader from "../views/components/Header/AdminHeader";
import { AuthService } from "../services/auth/AuthService";

const getPageTitle = (pathname: string) => {
    if (pathname.includes("/admin/manage/users")) return "User Management";
    if (pathname.includes("/admin/manage/tickets")) return "Ticket Management";
    if (pathname.includes("/admin/knowledgebase")) return "Knowledge Base";
    if (pathname.includes("/admin/settings")) return "Settings";
    if (pathname.includes("/admin/feedback")) return "Feedback";
    // Add more as needed
    return "Dashboard";
};

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        const fetchUser = async () => {
            const stored = AuthService.getStoredUser();
            if (stored?.id) {
                const user = await AuthService.getCurrentUser(Number(stored.id));
                if (user && user.firstname && user.lastname) {
                    setUserName(`${user.firstname} ${user.lastname}`);
                }
            }
        };
        fetchUser();
    }, []);

    const hideHeader = location.pathname.startsWith("/admin/settings");
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 flex flex-col">
                {!hideHeader && (
                    <AdminHeader title={pageTitle} userName={userName} />
                )}
                <div className="p-4 flex-1 bg-white">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;