import { AuthService } from '../auth/AuthService';

const API_BASE_URL = 'http://localhost:5000/api';

// Standard API response structure matching C# backend
export interface ApiResponse<T> {
    status: 'Success' | 'Error' | 0 | 1;
    message: string;
    response: T;
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
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });
    }

    static async logout() {
        return this.makeAuthenticatedRequest('/Account/SignOutUser', {
            method: 'POST',
        });
    }

    // Example: Get current user info (protected endpoint)
    static async getCurrentUser() {
        const userId = AuthService.getUserId();
        if (!userId) {
            throw new Error('No user ID found');
        }

        return this.makeAuthenticatedRequest(`/Account/GetUser?username=${userId}`, {
            method: 'GET',
        });
    }

    // Add more API methods as needed for tickets, users, etc.
    // Example:
    // static async getTickets() {
    //   return this.makeAuthenticatedRequest('/Ticket/GetAll', { method: 'GET' });
    // }
}