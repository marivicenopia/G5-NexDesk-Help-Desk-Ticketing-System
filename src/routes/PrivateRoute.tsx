// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { AuthService } from "../services/auth/AuthService";
// import { PATHS } from "./constant";

// interface PrivateRouteProps {
//     allowedRoles: string[];
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
//     const isAuthenticated = AuthService.isAuthenticated();
//     const userRole = AuthService.getRole() || "";

//     if (!isAuthenticated) {
//         return <Navigate to={PATHS.COMMON.LOGIN.path} replace />;
//     }

//     if (!allowedRoles.includes(userRole)) {
//         return <Navigate to={PATHS.COMMON.NOT_FOUND.path} replace />;
//     }

//     return <Outlet />;
// };

// export default PrivateRoute;

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/auth/AuthService";
import { PATHS } from "./constant";

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = AuthService.isAuthenticated();
            const storedUser = AuthService.getStoredUser();

            if (isAuth && storedUser && allowedRoles.includes(storedUser.role)) {
                setAuthorized(true);
            }
            setLoading(false);
        };

        checkAuth();
    }, [allowedRoles]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authorized) {
        return <Navigate to={PATHS.COMMON.LOGIN.path} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;