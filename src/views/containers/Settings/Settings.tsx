import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

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
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#031849] mb-1">Settings</h1>
                <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex">
                        {/* Left navigation */}
                        <nav className="w-64 bg-gray-50 border-r border-gray-200 p-6">
                            <div className="space-y-1">
                                <NavLink
                                    to="general"
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`
                                    }
                                    end
                                >
                                    General
                                </NavLink>
                                <NavLink
                                    to="password"
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`
                                    }
                                >
                                    Password
                                </NavLink>
                                <hr className="my-4 border-gray-300" />
                                <NavLink
                                    to="delete"
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? "bg-red-50 text-red-700 border-r-2 border-red-500"
                                            : "text-red-600 hover:bg-red-50 hover:text-red-700"
                                        }`
                                    }
                                >
                                    Delete Account
                                </NavLink>
                            </div>
                        </nav>

                        {/* Right content */}
                        <div className="flex-1">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-[#031849] mb-1">{settingTitle}</h2>
                                <p className="text-gray-600">{settingSubtext}</p>
                            </div>
                            <div className="p-6">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;