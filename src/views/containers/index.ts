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