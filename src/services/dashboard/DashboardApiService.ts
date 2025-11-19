import axios from 'axios';
import { AuthService } from '../auth/AuthService';

const BASE_URL = 'http://localhost:5000/api'; // Using HTTP for testing instead of HTTPS

export interface DashboardStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    totalUsers: number;
    activeUsers: number;
    totalAgents: number;
    averageResolutionTime: number;
    customerSatisfactionScore: number;
}

export interface TicketByStatus {
    status: string;
    count: number;
    color: string;
}

export interface TicketByPriority {
    priority: string;
    count: number;
    color: string;
}

export interface TicketTrend {
    date: string;
    created: number;
    resolved: number;
}

export interface RecentTicket {
    id: string;
    title: string;
    priority: string;
    status: string;
    submittedBy: string;
    assignedTo: string;
    submittedDate: string;
    department: string;
}

export interface DashboardData {
    stats: DashboardStats;
    ticketsByStatus: TicketByStatus[];
    ticketsByPriority: TicketByPriority[];
    ticketTrends: TicketTrend[];
    recentTickets: RecentTicket[];
}

export class DashboardApiService {
    private static getAuthHeaders() {
        const token = AuthService.getToken();
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Get complete dashboard data for the current user
     */
    static async getDashboardData(): Promise<DashboardData> {
        try {
            const response = await axios.get(`${BASE_URL}/dashboard/data`, {
                headers: this.getAuthHeaders()
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    /**
     * Get dashboard statistics only for the current user
     */
    static async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await axios.get(`${BASE_URL}/dashboard/stats`, {
                headers: this.getAuthHeaders()
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch dashboard stats');
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    /**
     * Get dashboard data for a specific role (Admin only)
     */
    static async getDashboardDataForRole(role: string, userId?: string, departmentId?: string): Promise<DashboardData> {
        try {
            const params = new URLSearchParams();
            if (userId) params.append('userId', userId);
            if (departmentId) params.append('departmentId', departmentId);

            const url = `${BASE_URL}/dashboard/data/${role}${params.toString() ? '?' + params.toString() : ''}`;

            const response = await axios.get(url, {
                headers: this.getAuthHeaders()
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch dashboard data for role');
            }
        } catch (error) {
            console.error('Error fetching dashboard data for role:', error);
            throw error;
        }
    }
}