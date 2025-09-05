import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AgentSidebar from "../views/components/SideBar/AgentSideBar";
import AgentHeader from "../views/components/Header/AgentHeader";

const getPageTitle = (pathname: string): string => {
  // Remove any query parameters and get the base path
  const path = pathname.split('?')[0];

  if (path === '/agent' || path === '/agent/dashboard') return 'Dashboard';
  if (path === '/agent/tickets') return 'My Tickets';
  if (path === '/agent/knowledgebase') return 'Knowledge Base';
  if (path === '/agent/knowledgebase/add') return 'Add Article';
  if (path === '/agent/knowledgebase/edit') return 'Edit Article';
  if (path.startsWith('/agent/knowledgebase/')) return 'Article Details';
  if (path === '/agent/feedback') return 'Feedback Management';
  if (path === '/agent/settings') return 'Settings';
  if (path === '/agent/settings/general') return 'General Settings';
  if (path === '/agent/settings/password') return 'Password Settings';

  // Default fallback
  return 'Dashboard';
};

const AgentLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex">
      <AgentSidebar />
      <main className="flex-1 flex flex-col">
        <AgentHeader title={pageTitle} />

        <div className="p-4 flex-1 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AgentLayout;
