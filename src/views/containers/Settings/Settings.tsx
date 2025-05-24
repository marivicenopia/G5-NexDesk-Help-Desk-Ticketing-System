import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../../../services/users/UserService";
import AdminSidebar from "../../components/SideBar/AdminSideBar"; // <-- Import the AdminSidebar

const getSettingTitle = (pathname: string) => {
    if (pathname.endsWith("/general")) return "General";
    if (pathname.endsWith("/password")) return "Password";
    if (pathname.endsWith("/delete")) return "Delete Account";
    // Default to General if at /settings or /settings/
    if (pathname.endsWith("/settings") || pathname.endsWith("/settings/")) return "General";
    return "";
};

const getSettingSubtext = (pathname: string) => {
    if (pathname.endsWith("/general") || pathname.endsWith("/settings") || pathname.endsWith("/settings/")) {
        return "Update your username and manage your account information.";
    }
    if (pathname.endsWith("/password")) {
        return "Change your password to keep your account secure.";
    }
    if (pathname.endsWith("/delete")) {
        return "Permanently delete your account and all associated data.";
    }
    return "";
};

const Settings: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const settingTitle = getSettingTitle(location.pathname);
    const settingSubtext = getSettingSubtext(location.pathname);

    const [firstName, setFirstName] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const user = await UserService.getById(userId);
                    if (user && user.firstname) setFirstName(user.firstname);
                } catch (err) {
                    setFirstName("");
                }
            }
        };
        fetchUser();
    }, []);

    // Redirect to /general if at /settings or /settings/
    useEffect(() => {
        if (
            location.pathname.endsWith("/settings") ||
            location.pathname.endsWith("/settings/")
        ) {
            navigate("general", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 max-w-3xl mx-auto mt-5 p-0 bg-white rounded font-sans flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-4">
                    <h1 className="text-4xl font-bold">
                        {firstName}
                        {settingTitle && (
                            <span className="text-[#6E6D7A] font-normal text-3xl"> / {settingTitle}</span>
                        )}
                    </h1>
                    {settingSubtext && (
                        <p className="text-[#6E6D7A] text-xl mt-1">{settingSubtext}</p>
                    )}
                </div>
                <div className="flex">
                    {/* Left navigation */}
                    <nav className="w-56 bg-white p-6 flex flex-col gap-2">
                        <NavLink
                            to="general"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded transition font-semibold text-lg ${
                                    isActive
                                        ? "text-[#0D0C22]"
                                        : "text-[#6E6D7A] hover:bg-blue-100"
                                }`
                            }
                            end
                        >
                            General
                        </NavLink>
                        <NavLink
                            to="password"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded transition font-semibold text-lg ${
                                    isActive
                                        ? "text-[#0D0C22]"
                                        : "text-[#6E6D7A] hover:bg-blue-100"
                                }`
                            }
                        >
                            Password
                        </NavLink>
                        <hr className="my-2 border-gray-300" />
                        <NavLink
                            to="delete"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded transition font-semibold text-lg ${
                                    isActive
                                        ? "text-[#0D0C22]"
                                        : "text-[#54D4AB] hover:bg-red-100"
                                }`
                            }
                        >
                            Delete Account
                        </NavLink>
                    </nav>
                    {/* Right content */}
                    <div className="flex-1 p-8 transition-all duration-300">
                        <h2 className="text-3xl font-bold mb-6">{settingTitle}</h2>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;