import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth/AuthService";

const SettingsSubMenu: React.FC<{ settingsPath: string }> = ({ settingsPath }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <div className="flex flex-col space-y-4 bg-[#192F64] text-white p-4 rounded shadow">
            <NavLink
                to={settingsPath}
                className={({ isActive }) => isActive ? "font-bold underline" : ""}
                end
            >
                Settings
            </NavLink>
            <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-600"
            >
                Log out
            </button>
        </div>
    );
};

export default SettingsSubMenu;