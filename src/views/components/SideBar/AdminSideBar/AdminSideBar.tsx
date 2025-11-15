import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminSideBarItems, SideBarFooterItems } from "./sideBarItems";
<<<<<<< HEAD
import SidebarSubmenu from "./AdminSideBarSubMenu";
=======
>>>>>>> origin/main

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleLogout = () => {
        // Put your logout logic here, like clearing auth tokens, etc.
        console.log("Logging out...");
        navigate("/login");
    };

    const handleToggle = (label: string, hasChildren: boolean) => {
        if (!hasChildren) {
            setActiveMenu(null);
        } else {
            setActiveMenu(activeMenu === label ? null : label);
        }
    };

<<<<<<< HEAD
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
                                onClick={() => handleToggle(item.label, !!item.children)}
                            >
                                {item.path ? (
                                    <Link to={item.path}>
                                        <Icon className="text-xl" />
                                    </Link>
                                ) : (
                                    <Icon className="text-xl" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer icons */}
                <div className="flex flex-col space-y-6 items-center pt-6 border-t border-white/20">
=======
    const handleSettings = () => {
        navigate("/admin/settings");
    };

    return (
        <div className="flex flex-col w-64 bg-[#1e3a8a] text-white min-h-screen">
            {/* Logo/Brand */}
            <div className="p-4 border-b border-blue-700">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-sm bg-white text-[#1e3a8a] text-lg font-bold">N</span>
                    <span className="text-xl font-bold tracking-wide">NexDesk</span>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4">
                <ul className="space-y-2">
                    {AdminSideBarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.label;

                        return (
                            <li key={item.label}>
                                <div
                                    className={`flex items-center justify-between mx-3 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-blue-700 ${isActive ? 'bg-blue-700' : ''
                                        }`}
                                    onClick={() => handleToggle(item.label, !!item.children)}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.path ? (
                                            <Link to={item.path} className="flex items-center gap-3 w-full">
                                                <Icon className="text-lg" />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ) : (
                                            <>
                                                <Icon className="text-lg" />
                                                <span className="font-medium">{item.label}</span>
                                            </>
                                        )}
                                    </div>
                                    {item.children && (
                                        <svg
                                            className={`w-4 h-4 transform transition-transform ${isActive ? 'rotate-90' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>

                                {/* Submenu */}
                                {isActive && item.children && (
                                    <ul className="ml-6 mt-2 space-y-1">
                                        {item.children.map((child) => (
                                            <li key={child.label}>
                                                <Link
                                                    to={child.path}
                                                    className="block px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
                                                    onClick={() => setActiveMenu(null)}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-blue-700 p-4">
                <div className="space-y-2">
>>>>>>> origin/main
                    {SideBarFooterItems.map((item) =>
                        item.action ? (
                            <button
                                key={item.label}
<<<<<<< HEAD
                                onClick={handleLogout}
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                                aria-label={item.label}
                            >
                                <item.icon className="text-xl" />
=======
                                onClick={item.label === "Settings" ? handleSettings : handleLogout}
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
                                aria-label={item.label}
                            >
                                <item.icon className="text-lg" />
                                <span>{item.label}</span>
>>>>>>> origin/main
                            </button>
                        ) : item.path ? (
                            <Link
                                key={item.label}
                                to={item.path}
<<<<<<< HEAD
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                            >
                                <item.icon className="text-xl" />
=======
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
                            >
                                <item.icon className="text-lg" />
                                <span>{item.label}</span>
>>>>>>> origin/main
                            </Link>
                        ) : null
                    )}
                </div>
            </div>
<<<<<<< HEAD


            {activeMenu && (
                <SidebarSubmenu
                    items={AdminSideBarItems.find((i) => i.label === activeMenu)?.children || []}
                    onClose={() => setActiveMenu(null)}
                />
            )}
        </div>
    )
=======
        </div>
    );
>>>>>>> origin/main
};

export default AdminSidebar;
