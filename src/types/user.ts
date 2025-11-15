<<<<<<< HEAD
export type RoleOption = 'user' | 'admin' | 'agent' | 'staff';

export interface User{
=======
export type RoleOption = 'staff' | 'admin' | 'agent' | 'superadmin';

export interface User {
>>>>>>> origin/main
    id: string | number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    isActive: boolean;
<<<<<<< HEAD
    role: RoleOption; 
=======
    role: RoleOption;
>>>>>>> origin/main
    department?: string;
    supportTeams?: string[];
}