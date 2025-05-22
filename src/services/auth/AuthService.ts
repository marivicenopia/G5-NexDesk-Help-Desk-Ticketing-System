// const TOKEN_KEY = "isAuthenticated";
// const ROLE_KEY = "userRole";

// export const AuthService = {
//     login: (role: string) => {
//         localStorage.setItem(TOKEN_KEY, "true");
//         localStorage.setItem(ROLE_KEY, role);
//     },
//     logout: () => {
//         localStorage.removeItem(TOKEN_KEY);
//         localStorage.removeItem(ROLE_KEY);
//     },
//     isAuthenticated: () => localStorage.getItem(TOKEN_KEY) === "true",
//     getRole: () => localStorage.getItem(ROLE_KEY),
// };

import axios from 'axios';
import type { User } from '../../types/user';
import type { Ticket } from '../../types/ticket';

const API_BASE_URL = 'http://localhost:3001';

export const AuthService = {
    // Auth
    login: async (username: string, password: string) => {
        try {
            // Change to use proper query for JSON Server
            const response = await axios.get(`${API_BASE_URL}/users?username=${username}&password=${password}`);
            const user = response.data[0];

            if (user) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id.toString());
            }
            return user;
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    getStoredUser: () => {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        return userId && userRole ? { id: userId, role: userRole } : null;
    },

    getCurrentUser: async (id: number) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    updateUser: async (id: number, userData: Partial<User>) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Update user error:', error);
            return null;
        }
    },

    // Users
    getUsers: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            return response.data;
        } catch (error) {
            console.error('Get users error:', error);
            return [];
        }
    },

    // Tickets
    getTickets: async () => {
        const response = await axios.get(`${API_BASE_URL}/tickets`);
        return response.data;
    },

    createTicket: async (ticket: Omit<Ticket, 'id'>) => {
        const response = await axios.post(`${API_BASE_URL}/tickets`, ticket);
        return response.data;
    },

    updateTicket: async (id: string | number, ticket: Partial<Ticket>) => {
        const response = await axios.patch(`${API_BASE_URL}/tickets/${id}`, ticket);
        return response.data;
    },

    // Logout
    logout: async () => {
        try {
            // Clear server-side session if you have one
            await axios.post(`${API_BASE_URL}/auth/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear client-side storage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
        }
    },
};