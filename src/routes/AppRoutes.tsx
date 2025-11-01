// AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Views from '../views/containers';
import { PATHS } from "./constant";
import { AdminLayout, AgentLayout, UserLayout } from "../layout";
import PrivateRoute from "./PrivateRoute";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default root -> login (adjust if you want a different landing) */}
                <Route path="/" element={<Navigate to={PATHS.COMMON.LOGIN.path} replace />} />

                <Route path={PATHS.COMMON.LOGIN.path} element={<Views.Login />} />
                <Route path={PATHS.COMMON.REGISTER.path} element={<Views.Register />} />

                <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.ViewUsers />} />
                        <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
                        <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
                        <Route path="/admin/edit-ticket" element={<Views.EditTicket />} />
                        <Route path="/admin/assign-ticket" element={<Views.AssignTicket />} />
                        <Route path="/admin/reassign-ticket" element={<Views.ReassignTicket />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
                    <Route element={<AgentLayout />}>
                        <Route path="/agent/view-tickets" element={<Views.ViewTickets />} />
                        <Route path="/agent/edit-ticket" element={<Views.EditTicket />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                    <Route element={<UserLayout />}>
                        <Route path="/user/create-ticket" element={<Views.CreateTicket />} />
                        <Route path="/user/view-tickets" element={<Views.ViewTickets />} />
                    </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to={PATHS.COMMON.LOGIN.path} replace />} />
            </Routes>
        </BrowserRouter>
    );
};