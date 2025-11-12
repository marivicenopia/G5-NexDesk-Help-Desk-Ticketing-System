import type { User } from "../../types/user";

// Use relative URL since Vite proxy is configured
const API_BASE_URL = "";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

export const UserService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  getAgents: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/by-role/agent`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching agents:", error);
      throw error;
    }
  },

  getByDepartment: async (department: string): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/by-department/${department}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users by department");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching users by department:", error);
      throw error;
    }
  },

  create: async (user: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create user";
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

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...user, id }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update user";
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

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete user";
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
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};