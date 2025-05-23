import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminSideBarItems, SideBarFooterItems } from "./sideBarItems";
import AdminSidebarSubMenu from "./AdminSideBarSubMenu";
import SettingsSubMenu from "../SettingsSubMenu";

const AdminSidebar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleToggle = (label: string, hasChildren: boolean, path?: string) => {
        if (label === "Dashboard" && path) {
            // Direct navigation for Dashboard
            navigate(path);
            setActiveMenu(null);
        } else if (hasChildren || label === "Settings") {
            setActiveMenu(activeMenu === label ? null : label);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col justify-between w-20 bg-[#192F64] text-white py-4 space-y-6">
                {/* Top nav icons */}
                <div className="flex flex-col space-y-6 items-center">
                    {AdminSideBarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.label}
                                className="cursor-pointer"
                                onClick={() => handleToggle(item.label, !!item.children, item.path)}
                            >
                                {item.path ? (
                                    <Icon className="text-xl" />
                                ) : (
                                    <Icon className="text-xl" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer icons */}
                <div className="flex flex-col space-y-6 items-center pt-6 border-t border-white/20">
                    {SideBarFooterItems.map((item) =>
                        item.action ? (
                            <button
                                key={item.label}
                                onClick={() => window.location.href = "/login"}
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                                aria-label={item.label}
                            >
                                <item.icon className="text-xl" />
                            </button>
                        ) : item.path ? (
                            <div
                                key={item.label}
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                                onClick={() => handleToggle(item.label, false, item.path)}
                            >
                                <item.icon className="text-xl" />
                            </div>
                        ) : null
                    )}
                </div>
            </div>

            {/* Submenu logic */}
            {activeMenu === "Settings" && (
                <SettingsSubMenu
                    settingsPath="/admin/settings"
                    onClose={() => setActiveMenu(null)}
                />
            )}
            {activeMenu && activeMenu !== "Settings" && (
                <AdminSidebarSubMenu
                    items={AdminSideBarItems.find((i) => i.label === activeMenu)?.children || []}
                    onClose={() => setActiveMenu(null)}
                />
            )}
        </div>
    );
};

export default AdminSidebar;