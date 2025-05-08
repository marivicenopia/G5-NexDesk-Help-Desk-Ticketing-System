import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* ADD PPRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
          <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
        </Route>
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
