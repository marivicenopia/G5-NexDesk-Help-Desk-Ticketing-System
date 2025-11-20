// API Configuration for NexDesk Help Desk System
// This configuration connects the React frontend to the C# ASP.NET Core backend

export const API_CONFIG = {
    // Base URL for all API calls - C# backend
    // Using HTTPS to avoid CORS redirect issues (HTTP redirects to HTTPS)
    BASE_URL: "https://localhost:5001",

    // API endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: "/api/Account/Login",
        LOGOUT: "/api/Account/Logout",

        // Tickets
        TICKETS: "/api/tickets",
        TICKETS_BY_ID: (id: string) => `/api/tickets/${id}`,
        TICKETS_STATUS: (id: string) => `/api/tickets/${id}/status`,
        TICKETS_ASSIGN: (id: string) => `/api/tickets/${id}/assign`,

        // Users
        USERS: "/api/User",
        USERS_BY_ID: (id: string) => `/api/User/${id}`,
        USERS_BY_ROLE: (role: string) => `/api/User/role/${role}`,
        USERS_BY_DEPARTMENT: (department: string) => `/api/User/department/${department}`,

        // Knowledge Base
        KNOWLEDGE_BASE_GET_CATEGORIES: "/api/KnowledgeBase/GetCategories",
        KNOWLEDGE_BASE_GET_ARTICLE: (id: string) => `/api/KnowledgeBase/GetArticle/${id}`,
        KNOWLEDGE_BASE_ADD_ARTICLE: "/api/KnowledgeBase/AddArticle",
        KNOWLEDGE_BASE_UPDATE_ARTICLE: (id: string) => `/api/KnowledgeBase/UpdateArticle/${id}`,
        KNOWLEDGE_BASE_DELETE_ARTICLE: (id: string) => `/api/KnowledgeBase/DeleteArticle/${id}`,

        // Feedback
        FEEDBACK_GET_ALL: "/api/Feedback/GetFeedbacks",
        FEEDBACK_GET_BY_ID: (id: string) => `/api/Feedback/GetFeedback/${id}`,
        FEEDBACK_ADD: "/api/Feedback/AddFeedback",
    },

    // Common headers
    getAuthHeaders: () => {
        const token = localStorage.getItem("authToken");
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        };
    },
};

// Helper function for making API calls
export const apiCall = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
        headers: API_CONFIG.getAuthHeaders(),
        ...options,
    });

    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // Ignore JSON parse errors
        }
        throw new Error(errorMessage);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    return {} as T;
};