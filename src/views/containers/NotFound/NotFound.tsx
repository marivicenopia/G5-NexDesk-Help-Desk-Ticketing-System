// src/views/containers/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../../../services/auth/AuthService";

const NotFound: React.FC = () => {
    const role = AuthService.getRole();
    
      let dashboardPath = "/";
      switch (role) {
        case "admin":
        case "superadmin":
          dashboardPath = "/admin/dashboard";
          break;
        case "agent":
          dashboardPath = "/agent/dashboard";
          break;
        case "staff":
          dashboardPath = "/user/dashboard";
          break;
        default:
          dashboardPath = "/login";
      }
    

    return (
    <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4">The page you’re looking for doesn’t exist.</p>
        <Link to={dashboardPath} className="mt-6 inline-block text-blue-500 underline">
        Go to Dashboard
        </Link>
    </div>
    );
}

export default NotFound;
