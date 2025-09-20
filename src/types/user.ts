export type RoleOption = 'staff' | 'admin' | 'agent' | 'superadmin';

export interface User {
    id: string | number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    isActive: boolean;
    role: RoleOption;
    department?: string;
    supportTeams?: string[];
}