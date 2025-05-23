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



export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root "/" to login */}
        <Route path="/" element={<Navigate to={PATHS.COMMON.LOGIN.path} replace />} />
        <Route path={PATHS.COMMON.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.COMMON.REGISTER.path} element={<Views.Register />} />
        {/* <Route path={PATHS.COMMON.NOT_FOUND.path} element={<Views.NotFound />} /> */}

        {/* Admin routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
            <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.ViewUsers />} />
            <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
            <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
            <Route path={PATHS.ADMIN.KNOWLEDGEBASE.path} element={<Knowledgebase />} />
            <Route path={PATHS.ADMIN.ADD_ARTICLE.path} element={<AddArticle />} />
            <Route path={PATHS.ADMIN.EDIT_ARTICLE.path} element={<EditArticle />} />
            <Route path={PATHS.ADMIN.DELETE_ARTICLE.path} element={<DeleteArticle />} />
            <Route path={PATHS.ADMIN.VIEW_ARTICLE.path} element={<ViewArticle />} />
            <Route path={PATHS.ADMIN.VIEW_FEEDBACK.path} element={<ViewFeedback />} />
            <Route path={PATHS.ADMIN.SETTINGS.path} element={<Settings />}>
              <Route index element={<SettingsGeneral />} />
              <Route path="general" element={<SettingsGeneral />} />
              <Route path="password" element={<SettingsPassword />} />
              <Route path="delete" element={<SettingsDelete />} />
            </Route>
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
            {/* <Route path={PATHS.AGENT.DASHBOARD.path} element={<Views.AgentDashboard />} /> */}
            {/* <Route path={PATHS.AGENT.MY_TICKETS.path} element={<Views.AgentTickets />} /> */}
          </Route>
        </Route>

        {/* User routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route element={<UserLayout />}>
            {/* <Route path={PATHS.USER.DASHBOARD.path} element={<Views.UserDashboard />} />
            <Route path={PATHS.USER.MY_TICKETS.path} element={<Views.MyTickets />} />
            <Route path={PATHS.USER.CREATE_TICKET.path} element={<Views.CreateTicket />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
