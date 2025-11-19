import { AuthService } from '../auth/AuthService';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

// Standard API response structure matching C# backend
export interface ApiResponse<T> {
    status: 'Success' | 'Error' | 0 | 1;
    message: string;
    response: T;
}

// Domain models (adjust to match backend DTOs)
export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    status?: string;
    assignedTo?: string;
    createdAt?: string;
}

export interface User {
    id?: number;
    username?: string;
    userName?: string; // if backend uses userName
    email?: string;
    roles?: string[];
}

export class ApiService {
    // Generic method for making authenticated API calls
    static async makeAuthenticatedRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;

        try {
            const response = await AuthService.authenticatedFetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const result: ApiResponse<T> = await response.json();
            return result;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication endpoints
    static async login(username: string, password: string) {
        return fetch(`${API_BASE_URL}/Account/Login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });
    }

    static async logout() {
        return this.makeAuthenticatedRequest<void>('/Account/SignOutUser', {
            method: 'POST',
        });
    }

    static async getCurrentUser() {
        const userId = AuthService.getUserId();
        if (!userId) throw new Error('No user ID found');
        return this.makeAuthenticatedRequest<User>(`/Account/GetUser?username=${encodeURIComponent(userId)}`, {
            method: 'GET',
        });
    }

    // Tickets
    static async getTickets() {
        return this.makeAuthenticatedRequest<Ticket[]>('/Ticket/GetAll', { method: 'GET' });
    }

    static async getTicket(id: number) {
        return this.makeAuthenticatedRequest<Ticket>(`/Ticket/Get?id=${id}`, { method: 'GET' });
    }

    static async createTicket(payload: {
        title: string;
        description: string;
        priority: string;
        assignedTo?: string;
    }) {
        return this.makeAuthenticatedRequest<Ticket>('/Ticket/Create', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
}