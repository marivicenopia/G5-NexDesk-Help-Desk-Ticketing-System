<<<<<<< HEAD
// views/containers/index.ts
export { default as Login } from './AuthContainer/Login';
export { default as Register } from './AuthContainer/Register';
export { default as ViewUsers } from './UserManagement/ViewUsers';
export { default as CreateUser } from './UserManagement/CreateUser';

// Add your ticket components
export { default as CreateTicket } from './CreateTicket';
export { default as EditTicket } from './EditTicket';
export { default as ViewTickets } from './ViewTickets';
export { default as AssignTicket } from './AssignTicket';
export { default as ReassignTicket } from './ReAssignTicket';
=======
export { default as Login } from './AuthContainer/Login';
export { default as Register } from './AuthContainer/Register'

export { AdminDashboard as AdminDashboard } from './AdminContainer';
export { ViewUsers as UsersViewContainer } from './UserManagement/';
export { ViewTickets as ViewTickets } from './SharedContainer';
export { default as TicketManagement } from './TicketManagement';

export { CreateUser as CreateUser } from './UserManagement';
export { CreateTicket as CreateTicket } from './SharedContainer';

// User Components
export { UserDashboard, UserTicketManagement, UserCreateTicket, UserKnowledgeBase, UserViewArticle } from './UserContainer';
>>>>>>> origin/main
