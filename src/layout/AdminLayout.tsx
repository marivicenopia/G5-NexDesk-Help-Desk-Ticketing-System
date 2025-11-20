import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../views/components/SideBar/AdminSideBar";
import AdminHeader from "../views/components/Header/AdminHeader";

const getPageTitle = (pathname: string): string => {
  // Remove any query parameters and get the base path
  const path = pathname.split('?')[0];

  if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
  if (path === '/admin/users') return 'User Management';
  if (path === '/admin/users/create') return 'Create User';
  if (path.startsWith('/admin/users/')) return 'User Details';
  if (path === '/admin/tickets') return 'All Tickets';
  if (path === '/admin/manage/tickets') return 'Manage Tickets';
  if (path === '/admin/tickets/summary') return 'Ticket Summary';
  if (path === '/admin/tickets/create') return 'Create Ticket';
  if (path.startsWith('/admin/tickets/')) return 'Ticket Details';
  if (path === '/admin/settings') return 'Settings';
  if (path === '/admin/settings/general') return 'General Settings';
  if (path === '/admin/settings/password') return 'Password Settings';
  if (path === '/admin/settings/delete') return 'Account Settings';
  if (path === '/admin/knowledgebase') return 'Knowledge Base';
  if (path === '/admin/knowledgebase/add') return 'Add Article';
  if (path.startsWith('/admin/knowledgebase/')) return 'Article Details';
  if (path === '/admin/feedback') return 'Feedback Management';

  // Default fallback
  return 'Dashboard';
};

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader title={pageTitle} />

        <div className="p-6 flex-1 bg-gray-50 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
