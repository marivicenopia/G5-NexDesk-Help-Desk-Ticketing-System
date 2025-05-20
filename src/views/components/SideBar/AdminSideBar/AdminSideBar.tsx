import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminSideBarItems, SideBarFooterItems } from "./sideBarItems";
import SidebarSubmenu from "./AdminSideBarSubMenu";

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
                    {SideBarFooterItems.map((item) =>
                        item.action ? (
                            <button
                                key={item.label}
                                onClick={handleLogout}
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                                aria-label={item.label}
                            >
                                <item.icon className="text-xl" />
                            </button>
                        ) : item.path ? (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="w-20 h-10 flex justify-center items-center cursor-pointer"
                            >
                                <item.icon className="text-xl" />
                            </Link>
                        ) : null
                    )}
                </div>
            </div>


            {activeMenu && (
                <SidebarSubmenu
                    items={AdminSideBarItems.find((i) => i.label === activeMenu)?.children || []}
                    onClose={() => setActiveMenu(null)}
                />
            )}
        </div>
    )
};

export default AdminSidebar;
