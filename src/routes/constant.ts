
 
// export const PATHS = {

//   MAIN: { path: "/", label: "Main" },

//   COMMON:{
//     LOGIN: {path: '/login', label: 'Login '},
//     REGISTER: {path: '/register', label: 'Register'},
//     NOT_FOUND: {path: '/not-found', label: 'Not Found'},
//   },

//   ADMIN: {
//     DASHBOARD: {path: '/admin/dashboard', label: 'Dashboard'},
//     MANAGE_USERS: {path: '/admin/manage/users', label: 'Manage Users'},
//     MANAGE_TICKETS: {path: '/admin/manage/tickets', label: 'Manage Tickets'},
//     CREATE_TICKET: {path: '/admin/create/ticket', label: 'Create Ticket'},
//     CREATE_USER: {path: '/admin/create/user', label: 'Create User'},
//   },

//   AGENT: {
//     DASHBOARD: { path: '/agent/dashboard', label: 'Dashboard' },
//     MY_TICKETS: { path: '/agent/tickets', label: 'My Tickets' },
//   },

//   USER: {
//     DASHBOARD: { path: '/user/dashboard', label: 'Dashboard' },
//     MY_TICKETS: { path: '/user/tickets', label: 'My Tickets' },
//     CREATE_TICKET: { path: '/user/create-ticket', label: 'Create Ticket' },
//   },

// };

// export interface MenuItem {
//   path: string;
//   label: string;
// }

// export const SIDE_BAR_MENU: MenuItem[] = [
//   {
//     path: "/dashboard",
//     label: "Dashboard"
//   },
//   {
//     path: "/logout",
//     label: "Logout"
//   }
//   // Add more path here
// ];

export const PATHS = {
  MAIN: { path: "/", label: "Main" },

  COMMON: {
    LOGIN: { path: '/login', label: 'Login' },
    REGISTER: { path: '/register', label: 'Register' },
    NOT_FOUND: { path: '/not-found', label: 'Not Found' },
  },

  ADMIN: {
    DASHBOARD: { path: '/admin/dashboard', label: 'Dashboard' },
    MANAGE_USERS: { path: '/admin/manage/users', label: 'Manage Users' },
    MANAGE_TICKETS: { path: '/admin/manage/tickets', label: 'Manage Tickets' },
    CREATE_TICKET: { path: '/admin/create/ticket', label: 'Create Ticket' },
    CREATE_USER: { path: '/admin/create/user', label: 'Create User' },
    SETTINGS: { path: '/admin/settings', label: 'Settings' },
    KNOWLEDGEBASE: { path: '/admin/knowledgebase', label: 'Knowledge Base' },
    ADD_ARTICLE: { path: '/admin/knowledgebase/add', label: 'Add Article' },
    EDIT_ARTICLE: { path: '/admin/knowledgebase/edit/:id', label: 'Edit Article' },
    DELETE_ARTICLE: { path: '/admin/knowledgebase/delete', label: 'Delete Article' },
    VIEW_ARTICLE: { path: '/admin/knowledgebase/view/:id', label: 'View Article' },
    VIEW_FEEDBACK: { path: "/admin/feedback", label: "View Feedback" },

  },

  AGENT: {
    DASHBOARD: { path: '/agent/dashboard', label: 'Dashboard' },
    MY_TICKETS: { path: '/agent/tickets', label: 'My Tickets' },
    SETTINGS: { path: '/agent/settings', label: 'Settings' },
    KNOWLEDGEBASE: { path: '/agent/knowledgebase', label: 'Knowledge Base' },
    ADD_ARTICLE: { path: '/agent/knowledgebase/add', label: 'Add Article' },
    EDIT_ARTICLE: { path: '/agent/knowledgebase/edit/:id', label: 'Edit Article' },
    DELETE_ARTICLE: { path: '/agent/knowledgebase/delete', label: 'Delete Article' },
    VIEW_ARTICLE: { path: '/agent/knowledgebase/view/:id', label: 'View Article' },
    VIEW_FEEDBACK: { path: "/admin/feedback", label: "View Feedback" },

  },

  USER: {
    DASHBOARD: { path: '/user/dashboard', label: 'Dashboard' },
    MY_TICKETS: { path: '/user/tickets', label: 'My Tickets' },
    CREATE_TICKET: { path: '/user/create-ticket', label: 'Create Ticket' },
    SETTINGS: { path: '/user/settings', label: 'Settings' },
    CREATE_FEEDBACK: { path: '/user/feedback', label: 'Submit Feedback' },
  },
};

export interface MenuItem {
  path: string;
  label: string;
}

export const SIDE_BAR_MENU: MenuItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
  },
  {
    path: "/logout",
    label: "Logout",
  },
];