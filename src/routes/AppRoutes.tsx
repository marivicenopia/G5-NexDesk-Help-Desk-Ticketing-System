import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Views from '../views/containers';
import { PATHS } from "./constant";
import { AdminLayout, AgentLayout, UserLayout } from "../layout";
import PrivateRoute from "./PrivateRoute";
import Settings from '../views/containers/Settings/Settings';
import SettingsGeneral from '../views/containers/Settings/SettingsGeneral';
import SettingsPassword from '../views/containers/Settings/SettingsPassword';
import SettingsDelete from '../views/containers/Settings/SettingsDelete';
import Knowledgebase from '../views/containers/Knowledgebase/Knowledgebase';
import AddArticle from '../views/containers/Knowledgebase/AddArticle';
import EditArticle from "../views/containers/Knowledgebase/EditArticle";
import DeleteArticle from '../views/containers/Knowledgebase/DeleteArticle';
import ViewArticle from '../views/containers/Knowledgebase/ViewArticle';
import ViewFeedback from '../views/containers/Feedback/Feedback';
import CreateFeedback from '../views/containers/Feedback/CreateFeedback';
import TicketSummary from '../views/containers/TicketSummary';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={PATHS.COMMON.LOGIN.path} replace />} />
                <Route path={PATHS.COMMON.LOGIN.path} element={<Views.Login />} />
                <Route path={PATHS.COMMON.REGISTER.path} element={<Views.Register />} />
                {/* Settings route accessible to all authenticated roles */}
                <Route element={<PrivateRoute allowedRoles={["admin", "agent", "user"]} />}>
                    <Route path={PATHS.ADMIN.SETTINGS.path} element={<Settings />}>
                        <Route index element={<SettingsGeneral />} />
                        <Route path="general" element={<SettingsGeneral />} />
                        <Route path="password" element={<SettingsPassword />} />
                        <Route path="delete" element={<SettingsDelete />} />
                    </Route>
                </Route>
                {/* Admin routes */}
                <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={PATHS.ADMIN.DASHBOARD.path} element={<Views.AdminDashboard />} />
                        <Route path="/admin/tickets" element={<Views.TicketManagement />} />
                        <Route path="/admin/tickets/create" element={<Views.CreateTicket />} />
                        <Route path="/admin/tickets/summary" element={<TicketSummary />} />
                        <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.UsersViewContainer />} />
                        <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
                        <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
                        <Route path={PATHS.ADMIN.KNOWLEDGEBASE.path} element={<Knowledgebase />} />
                        <Route path={PATHS.ADMIN.ADD_ARTICLE.path} element={<AddArticle />} />
                        <Route path={PATHS.ADMIN.EDIT_ARTICLE.path} element={<EditArticle />} />
                        <Route path={PATHS.ADMIN.VIEW_ARTICLE.path} element={<ViewArticle />} />
                        <Route path={PATHS.ADMIN.DELETE_ARTICLE.path} element={<DeleteArticle />} />
                        <Route path={PATHS.ADMIN.VIEW_FEEDBACK.path} element={<ViewFeedback />} />
                    </Route>
                </Route>
                {/* Agent routes */}
                <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
                    <Route element={<AgentLayout />}>
                        <Route path={PATHS.AGENT.KNOWLEDGEBASE.path} element={<Knowledgebase />} />
                        <Route path={PATHS.AGENT.ADD_ARTICLE.path} element={<AddArticle />} />
                        <Route path={PATHS.AGENT.EDIT_ARTICLE.path} element={<EditArticle />} />
                        <Route path={PATHS.AGENT.DELETE_ARTICLE.path} element={<DeleteArticle />} />
                        <Route path={PATHS.AGENT.VIEW_ARTICLE.path} element={<ViewArticle />} />
                        <Route path={PATHS.AGENT.VIEW_FEEDBACK.path} element={<ViewFeedback />} />
                        {/* Add more agent routes as needed */}
                    </Route>
                </Route>
                {/* User routes */}
                <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                    <Route element={<UserLayout />}>
                        <Route path={PATHS.USER.CREATE_FEEDBACK.path} element={<CreateFeedback />} />
                        {/* Add more user routes as needed */}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};