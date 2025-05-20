
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
    return (
        <div className="user-layout">
            <header>User Header</header>
            <aside>User Sidebar</aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
