import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth/AuthService";

interface SettingsSubMenuProps {
    settingsPath: string;
    onClose: () => void;
}

const SettingsSubMenu: React.FC<SettingsSubMenuProps> = ({ settingsPath, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await AuthService.logout();
        navigate("/login");
    };

    return (
        <div className="fixed left-20 top-0 h-full bg-[#22306a] text-white p-6 shadow-lg z-50 flex flex-col min-w-[180px]">
            <button onClick={onClose} className="mb-4 text-right text-gray-400 hover:text-white self-end">✕</button>
            <ul className="space-y-4">
                <li>
                    <NavLink
                        to={settingsPath}
                        className={({ isActive }) => isActive ? "font-bold underline" : ""}
                        end
                        onClick={onClose}
                    >
                        Settings
                    </NavLink>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="text-left text-red-400 hover:text-red-600"
                    >
                        Log out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SettingsSubMenu;