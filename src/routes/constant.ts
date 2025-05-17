
 
export const PATHS = {

  MAIN: { path: "/", label: "Main" },

  COMMON:{
    LOGIN: {path: '/login', label: 'Login '},
    REGISTER: {path: '/register', label: 'Register'},
    NOT_FOUND: {path: '/not-found', label: 'Not Found'},
  },

  ADMIN: {
    DASHBOARD: {path: '/admin/dashboard', label: 'Dashboard'},
    MANAGE_USERS: {path: '/admin/manage/users', label: 'Manage Users'},
    MANAGE_TICKETS: {path: '/admin/manage/tickets', label: 'Manage Tickets'},
    CREATE_TICKET: {path: '/admin/create/ticket', label: 'Create Ticket'},
    CREATE_USER: {path: '/admin/create/user', label: 'Create User'},
  },

  AGENT: {
    DASHBOARD: { path: '/agent/dashboard', label: 'Dashboard' },
    MY_TICKETS: { path: '/agent/tickets', label: 'My Tickets' },
  },

  USER: {
    DASHBOARD: { path: '/user/dashboard', label: 'Dashboard' },
    MY_TICKETS: { path: '/user/tickets', label: 'My Tickets' },
    CREATE_TICKET: { path: '/user/create-ticket', label: 'Create Ticket' },
  },

};

export interface MenuItem {
  path: string;
  label: string;
}

export const SIDE_BAR_MENU: MenuItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard"
  },
  {
    path: "/logout",
    label: "Logout"
  }
  // Add more path here
];