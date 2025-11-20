import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "../views/components/SideBar/UserSideBar/UserSideBar";
import UserHeader from "../views/components/Header/UserHeader/UserHeader";

const getPageTitle = (pathname: string): string => {
  // Remove any query parameters and get the base path
  const path = pathname.split('?')[0];

  if (path === '/user' || path === '/user/dashboard') return 'Dashboard';
  if (path === '/user/tickets') return 'My Tickets';
  if (path === '/user/create-ticket') return 'Create Ticket';
  if (path === '/user/knowledgebase') return 'Knowledge Base';
  if (path.startsWith('/user/knowledgebase/view/')) return 'View Article';
  if (path === '/user/settings') return 'Settings';
  if (path === '/user/feedback') return 'Submit Feedback';

  // Default fallback
  return 'Dashboard';
};

const UserLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-full">
      <UserSidebar />
      <main className="flex-1 flex flex-col ml-64">
        <UserHeader title={pageTitle} />

        <div className="flex-1 bg-gray-50 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
