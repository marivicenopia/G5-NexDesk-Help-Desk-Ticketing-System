import React from "react";
import { Outlet } from "react-router-dom";

const AgentLayout: React.FC = () => {
    return (
        <div className="agent-layout">
            <header>Agent Header</header>
            <aside>Agent Sidebar</aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AgentLayout;