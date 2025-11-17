import React from 'react';
import { AuthService } from "../../../../services/auth/AuthService";
import UnifiedDashboard from '../../Dashboard/UnifiedDashboard';

const AdminDashboard: React.FC = () => {
  const currentUserRole = AuthService.getRole();

  return <UnifiedDashboard role={(currentUserRole as any) || 'admin'} />;
};

export default AdminDashboard;