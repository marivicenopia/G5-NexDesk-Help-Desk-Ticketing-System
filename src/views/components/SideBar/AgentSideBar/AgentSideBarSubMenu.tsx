import React from "react";
import { Link } from "react-router-dom";

interface AgentSidebarSubmenuProps {
    items: { label: string; path: string }[];
    onClose: () => void;
}

const AgentSidebarSubMenu: React.FC<AgentSidebarSubmenuProps> = ({ items, onClose }) => {
    return (
        <div className="w-48 bg-[#031849] shadow-md p-4 space-y-3">
            <button onClick={onClose} className="text-sm text-white hover:text-red-500 float-right">
                Close
            </button>
            {items.map((item) => (
                <Link key={item.label} to={item.path} className="block text-white hover:underline">
                    {item.label}
                </Link>
            ))}
        </div>
    );
};

export default AgentSidebarSubMenu;
