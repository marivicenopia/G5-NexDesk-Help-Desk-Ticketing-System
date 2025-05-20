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
                {/* <Route path={PATHS.COMMON.NOT_FOUND.path} element={<Views.NotFound />} /> */}

                <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                        {/* <Route path={PATHS.ADMIN.DASHBOARD.path} element={<Views.AdminDashboard />} /> */}
                        <Route path={PATHS.ADMIN.MANAGE_TICKETS.path} element={<Views.ViewTickets />} />
                        <Route path={PATHS.ADMIN.MANAGE_USERS.path} element={<Views.ViewUsers />} />
                        <Route path={PATHS.ADMIN.CREATE_TICKET.path} element={<Views.CreateTicket />} />
                        <Route path={PATHS.ADMIN.CREATE_USER.path} element={<Views.CreateUser />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
                    <Route element={<AgentLayout />}>
                        {/* <Route path={PATHS.AGENT.DASHBOARD.path} element={<Views.AgentDashboard />} /> */}
                        {/* <Route path={PATHS.AGENT.MY_TICKETS.path} element={<Views.AgentTickets />} /> */}
                    </Route>
                </Route>

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
