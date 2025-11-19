export type RoleOption = 'staff' | 'admin' | 'agent' | 'superadmin';

export interface User {
    id: string | number;
    userId?: string; // Backend ID
    username: string;
    password: string;
    firstName: string; // Changed from firstname to match backend
    lastName: string;  // Changed from lastname to match backend
    email: string;
    isActive: boolean;
    role: RoleOption;
    departmentId?: string;
    supportTeams?: string[];

    // Legacy field for backward compatibility
    department?: string;
    createdTime?: string;
    updatedTime?: string;

    // Legacy field mappings for backward compatibility
    firstname?: string;
    lastname?: string;
}