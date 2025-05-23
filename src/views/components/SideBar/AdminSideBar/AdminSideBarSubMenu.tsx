// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AdminSideBarItems, SideBarFooterItems } from "./sideBarItems";
// import AdminSidebarSubMenu from "./AdminSideBarSubMenu";
// import SettingsSubMenu from "../SettingsSubMenu";

// interface AdminSidebarSubMenuProps {
//     items: { label: string; path: string }[];
//     onClose: () => void;
// }


// const AdminSidebar: React.FC = () => {
//     const navigate = useNavigate();
//     const [activeMenu, setActiveMenu] = useState<string | null>(null);

//     const handleLogout = () => {
//         // Put your logout logic here, like clearing auth tokens, etc.
//         console.log("Logging out...");
//         navigate("/login");
//     };

//     const handleToggle = (label: string, hasChildren: boolean) => {
//         if (!hasChildren) {
//             setActiveMenu(null);
//         } else {
//             setActiveMenu(activeMenu === label ? null : label);
//         }
//     };

//     return (
//         <div className="flex min-h-screen">
//             <div className="flex flex-col justify-between w-20 bg-[#192F64] text-white py-4 space-y-6">
//                 {/* Top nav icons */}
//                 <div className="flex flex-col space-y-6 items-center">
//                     {AdminSideBarItems.map((item) => {
//                         const Icon = item.icon;
//                         return (
//                             <div
//                                 key={item.label}
//                                 className="cursor-pointer"
//                                 onClick={() => handleToggle(item.label, !!item.children)}
//                             >
//                                 {item.path ? (
//                                     <Link to={item.path}>
//                                         <Icon className="text-xl" />
//                                     </Link>
//                                 ) : (
//                                     <Icon className="text-xl" />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* Footer icons */}
//                 <div className="flex flex-col space-y-6 items-center pt-6 border-t border-white/20">
//                     {SideBarFooterItems.map((item) =>
//                         item.action ? (
//                             <button
//                                 key={item.label}
//                                 onClick={handleLogout}
//                                 className="w-20 h-10 flex justify-center items-center cursor-pointer"
//                                 aria-label={item.label}
//                             >
//                                 <item.icon className="text-xl" />
//                             </button>
//                         ) : item.path ? (
//                             <div
//                                 key={item.label}
//                                 className="w-20 h-10 flex justify-center items-center cursor-pointer"
//                                 onClick={() => setActiveMenu(item.label)}
//                             >
//                                 <item.icon className="text-xl" />
//                             </div>
//                         ) : null
//                     )}
//                 </div>
//             </div>

//             {/* Submenu logic */}
//             {activeMenu === "Settings" && (
//                 <SettingsSubMenu settingsPath="/admin/settings" />
//             )}
//             {activeMenu && activeMenu !== "Settings" && (
//                 <AdminSidebarSubMenu
//                     items={AdminSideBarItems.find((i) => i.label === activeMenu)?.children || []}
//                     onClose={() => setActiveMenu(null)}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminSidebar;

import React from "react";
import { Link } from "react-router-dom";

interface AdminSidebarSubMenuProps {
    items: { label: string; path: string }[];
    onClose: () => void;
}

const AdminSidebarSubMenu: React.FC<AdminSidebarSubMenuProps> = ({ items, onClose }) => (
    <div className="fixed left-20 top-0 h-full bg-[#22306a] text-white p-6 shadow-lg z-50 flex flex-col min-w-[180px]">
        <button onClick={onClose} className="mb-4 text-right text-gray-400 hover:text-white self-end">✕</button>
        <ul className="space-y-4">
            {items.map((item) => (
                <li key={item.label}>
                    <Link to={item.path} className="hover:underline">{item.label}</Link>
                </li>
            ))}
        </ul>
    </div>
);

export default AdminSidebarSubMenu;