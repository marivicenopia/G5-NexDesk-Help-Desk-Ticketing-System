// AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Views from '../views/containers';
import { PATHS } from "./constant";
import { AdminLayout, AgentLayout, UserLayout } from "../layout";
import PrivateRoute from "./PrivateRoute";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={PATHS.COMMON.LOGIN.path} element={<Views.Login />} />
                <Route path={PATHS.COMMON.REGISTER.path} element={<Views.Register />} />

                <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.ViewUsers />} />
                        <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
                        <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
                        
                        {/* Add your new ticket management routes */}
                        <Route path="/admin/edit-ticket" element={<Views.EditTicket />} />
                        <Route path="/admin/assign-ticket" element={<Views.AssignTicket />} />
                        <Route path="/admin/reassign-ticket" element={<Views.ReassignTicket />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
                    <Route element={<AgentLayout />}>
                        {/* Add agent-specific routes if needed */}
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
            </Routes>
        </BrowserRouter>
    );
};