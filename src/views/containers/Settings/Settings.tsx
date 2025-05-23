import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Settings: React.FC = () => (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow font-sans">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <nav className="mb-8 flex gap-4 border-b pb-2">
            <NavLink
                to="general"
                className={({ isActive }) => isActive ? "font-bold" : ""}
                end
            >
                General
            </NavLink>
            <NavLink
                to="password"
                className={({ isActive }) => isActive ? "font-bold" : ""}
            >
                Password
            </NavLink>
            <NavLink
                to="delete"
                className={({ isActive }) => isActive ? "font-bold text-red-600" : "text-red-600"}
            >
                Delete Account
            </NavLink>
        </nav>
        <Outlet />
    </div>
);

export default Settings;