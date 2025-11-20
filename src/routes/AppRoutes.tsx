import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Views from '../views/containers';
import { PATHS } from "./constant";
import { AdminLayout, AgentLayout, UserLayout } from "../layout";
import PrivateRoute from "./PrivateRoute";
import Settings from '../views/containers/Settings/Settings';
import SettingsGeneral from '../views/containers/Settings/SettingsGeneral';
import SettingsPassword from '../views/containers/Settings/SettingsPassword';
import SettingsDelete from '../views/containers/Settings/SettingsDelete';
import SettingsPreferences from '../views/containers/Settings/SettingsPreferences';
import Knowledgebase from '../views/containers/Knowledgebase/Knowledgebase';
import AddArticle from '../views/containers/Knowledgebase/AddArticle';
import EditArticle from "../views/containers/Knowledgebase/EditArticle";
import DeleteArticle from '../views/containers/Knowledgebase/DeleteArticle';
import ViewArticle from '../views/containers/Knowledgebase/ViewArticle';
import ViewFeedback from '../views/containers/Feedback/Feedback';
import ViewFeedbackDetail from '../views/containers/Feedback/ViewFeedbackDetail';
import CreateFeedback from '../views/containers/Feedback/CreateFeedback';
import TicketSummary from '../views/containers/TicketSummary';
import ViewTicket from '../views/containers/UserContainer/ViewTicket';
import EditTicket from '../views/containers/UserContainer/EditTicket';
import EditUser from '../views/containers/UserManagement/EditUser';
import ViewUser from '../views/containers/UserManagement/ViewUser';
import TicketAssignment from '../views/containers/TicketAssignment';
import ViewTicketDetail from '../views/containers/TicketManagement/ViewTicketDetail';
import TicketTracking from '../views/containers/TicketTracking';
import { AgentDashboard } from '../views/containers/AgentContainer';
import NotFound from "../views/containers/NotFound";
import PermissionDenied from "../views/containers/PermissionDenied";
export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={PATHS.COMMON.LOGIN.path} replace />} />
                <Route path={PATHS.COMMON.LOGIN.path} element={<Views.Login />} />
                <Route path={PATHS.COMMON.REGISTER.path} element={<Views.Register />} />
                {/* Admin routes - Admin and Superadmin access */}
                <Route element={<PrivateRoute allowedRoles={["admin", "superadmin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={PATHS.ADMIN.DASHBOARD.path} element={<Views.AdminDashboard />} />
                        <Route path="/admin/tickets" element={<Views.TicketManagement />} />
                        <Route path="/admin/tickets/create" element={<Views.CreateTicket />} />
                        <Route path="/admin/tickets/view/:ticketId" element={<ViewTicketDetail />} />
                        <Route path="/admin/tickets/assignment" element={<TicketAssignment />} />
                        <Route path="/admin/tickets/tracking" element={<TicketTracking />} />
                        <Route path="/admin/tickets/summary" element={<TicketSummary />} />
                        <Route path="/admin/tickets/analytics" element={<Navigate to={PATHS.ADMIN.DASHBOARD.path} replace />} />
                        <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.UsersViewContainer />} />
                        <Route path="/admin/users/edit/:userId" element={<EditUser />} />
                        <Route path="/admin/users/view/:userId" element={<ViewUser />} />
                        <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
                        <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
                        <Route path={PATHS.ADMIN.KNOWLEDGEBASE.path} element={<Knowledgebase />} />
                        <Route path={PATHS.ADMIN.ADD_ARTICLE.path} element={<AddArticle />} />
                        <Route path={PATHS.ADMIN.EDIT_ARTICLE.path} element={<EditArticle />} />
                        <Route path={PATHS.ADMIN.VIEW_ARTICLE.path} element={<ViewArticle />} />
                        <Route path={PATHS.ADMIN.DELETE_ARTICLE.path} element={<DeleteArticle />} />
                        <Route path={PATHS.ADMIN.VIEW_FEEDBACK.path} element={<ViewFeedback />} />
                        <Route path="/admin/feedback/view/:feedbackId" element={<ViewFeedbackDetail />} />
                        {/* Settings route with main sidebar */}
                        <Route path={PATHS.ADMIN.SETTINGS.path} element={<Settings />}>
                            <Route index element={<SettingsGeneral />} />
                            <Route path="general" element={<SettingsGeneral />} />
                            <Route path="password" element={<SettingsPassword />} />
                            <Route path="delete" element={<SettingsDelete />} />
                        </Route>
                    </Route>
                </Route>

                {/* Agent routes - Agent access with specific permissions */}
                <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
                    <Route element={<AgentLayout />}>
                        <Route path={PATHS.AGENT.DASHBOARD.path} element={<AgentDashboard />} />
                        <Route path={PATHS.AGENT.MY_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path="/agent/tickets/view/:ticketId" element={<ViewTicketDetail />} />
                        <Route path={PATHS.AGENT.TICKET_ASSIGNMENT.path} element={<TicketAssignment />} />
                        <Route path={PATHS.AGENT.KNOWLEDGEBASE.path} element={<Knowledgebase />} />
                        <Route path={PATHS.AGENT.ADD_ARTICLE.path} element={<AddArticle />} />
                        <Route path={PATHS.AGENT.EDIT_ARTICLE.path} element={<EditArticle />} />
                        <Route path={PATHS.AGENT.VIEW_ARTICLE.path} element={<ViewArticle />} />
                        <Route path={PATHS.AGENT.VIEW_FEEDBACK.path} element={<ViewFeedback />} />
                        <Route path="/agent/feedback/view/:feedbackId" element={<ViewFeedbackDetail />} />
                        {/* Settings route for agents */}
                        <Route path={PATHS.AGENT.SETTINGS.path} element={<Settings />}>
                            <Route index element={<SettingsGeneral />} />
                            <Route path="general" element={<SettingsGeneral />} />
                            <Route path="password" element={<SettingsPassword />} />
                            <Route path="preferences" element={<SettingsPreferences />} />
                        </Route>
                        {/* Add more agent routes as needed */}
                    </Route>
                </Route>
                {/* User routes - Staff access only */}
                <Route element={<PrivateRoute allowedRoles={["staff"]} />}>
                    <Route element={<UserLayout />}>
                        <Route path={PATHS.USER.DASHBOARD.path} element={<Views.UserDashboard />} />
                        <Route path={PATHS.USER.MY_TICKETS.path} element={<Views.UserTicketManagement />} />
                        <Route path="/user/tickets/view/:ticketId" element={<ViewTicket />} />
                        <Route path="/user/tickets/edit/:ticketId" element={<EditTicket />} />
                        <Route path={PATHS.USER.CREATE_TICKET.path} element={<Views.UserCreateTicket />} />
                        <Route path={PATHS.USER.KNOWLEDGEBASE.path} element={<Views.UserKnowledgeBase />} />
                        <Route path={PATHS.USER.VIEW_ARTICLE.path} element={<Views.UserViewArticle />} />
                        <Route path={PATHS.USER.CREATE_FEEDBACK.path} element={<CreateFeedback />} />
                        {/* Settings route for users - personal preferences only */}
                        <Route path={PATHS.USER.SETTINGS.path} element={<Settings />}>
                            <Route index element={<SettingsGeneral />} />
                            <Route path="general" element={<SettingsGeneral />} />
                            <Route path="password" element={<SettingsPassword />} />
                            <Route path="preferences" element={<SettingsPreferences />} />
                            {/* Note: No delete route for regular users for security */}
                        </Route>
                        {/* Add more user routes as needed */}
                    </Route>
                </Route>
                <Route path={PATHS.COMMON.PERMISSION_DENIED.path} element={<PermissionDenied />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};