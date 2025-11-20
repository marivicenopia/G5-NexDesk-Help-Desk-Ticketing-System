import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AgentSidebar from "../views/components/SideBar/AgentSideBar";
import AgentHeader from "../views/components/Header/AgentHeader";

const getPageTitle = (pathname: string): string => {
  // Remove any query parameters and get the base path
  const path = pathname.split('?')[0];

  if (path === '/agent' || path === '/agent/dashboard') return 'Dashboard';
  if (path === '/agent/tickets') return 'My Tickets';
  if (path === '/agent/tickets/assignment') return 'Ticket Assignment';
  if (path.startsWith('/agent/tickets/view/')) return 'Ticket Details';
  if (path === '/agent/knowledgebase') return 'Knowledge Base';
  if (path === '/agent/knowledgebase/add') return 'Add Article';
  if (path === '/agent/knowledgebase/edit') return 'Edit Article';
  if (path.startsWith('/agent/knowledgebase/view/')) return 'Article Details';
  if (path.startsWith('/agent/knowledgebase/edit/')) return 'Edit Article';
  if (path === '/agent/feedback') return 'Feedback Management';
  if (path.startsWith('/agent/feedback/view/')) return 'Feedback Details';
  if (path === '/agent/settings') return 'Settings';
  if (path === '/agent/settings/general') return 'General Settings';
  if (path === '/agent/settings/password') return 'Password Settings';
  if (path === '/agent/settings/preferences') return 'Preferences';

  // Default fallback
  return 'Dashboard';
};

const AgentLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-30">
        <AgentSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-20 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20">
          <AgentHeader title={pageTitle} />
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2025 G5-NexDesk Support System
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Agent Portal</span>
              <span>•</span>
              <button className="hover:text-gray-700 transition-colors">
                Help & Support
              </button>
              <span>•</span>
              <button className="hover:text-gray-700 transition-colors">
                Contact IT
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AgentLayout;
