import type { User } from "../../types/user";
import { ApiService } from "../api/ApiService";
import { AuthService } from "../auth/AuthService";

// API response structure matching C# backend
interface ApiResponse<T> {
  status: 'Success' | 'Error' | 0 | 1;
  message: string;
  response: T;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const UserService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const result: ApiResponse<any[]> = await response.json();

      if (result.status === 'Success' || result.status === 0) {
        // Map backend response to frontend User interface
        return result.response.map((user: any) => ({
          id: user.id || user.userId,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId, // Fixed: Map departmentId correctly
          department: user.department, // Keep for backward compatibility
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdTime: user.createdTime,
          password: "" // Never expose actual password
        }));
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (userId: string): Promise<User> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();

      if (result.status === 'Success' || result.status === 0) {
        const user = result.response;
        return {
          id: user.id || user.userId,
          userId: user.userId,
          username: user.username || user.email, // Use username if available, fallback to email
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
          department: user.department, // Keep for backward compatibility
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          isActive: user.isActive,
          createdTime: user.createdTime,
          password: "" // Never expose actual password
        };
      } else {
        throw new Error(result.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getByRole: async (role: string): Promise<User[]> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/role/${role}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users by role: ${response.status}`);
      }

      const result: ApiResponse<any[]> = await response.json();

      if (result.status === 'Success' || result.status === 0) {
        return result.response.map((user: any) => ({
          id: user.id || user.userId,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId, // Fixed: Map departmentId correctly
          department: user.department, // Keep for backward compatibility
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdTime: user.createdTime,
          password: ""
        }));
      } else {
        throw new Error(result.message || 'Failed to fetch users by role');
      }
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  },

  getAgents: async (): Promise<User[]> => {
    return this.getByRole('agent');
  },

  create: async (userData: Partial<User>): Promise<User> => {
    try {
      const createRequest = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        departmentId: userData.departmentId
      };

      console.log('Creating user with data:', createRequest);
      console.log('API URL:', `${API_BASE_URL}/User`);

      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(createRequest),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorResult;
        try {
          errorResult = await response.json();
          console.log('Error response:', errorResult);
        } catch (e) {
          console.log('Failed to parse error response as JSON');
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
        }
        // Check if it's a validation error with detailed messages
        let errorMessage = errorResult.message || `Failed to create user: ${response.status} ${response.statusText}`;

        // If there are validation errors in the response array, show them
        if (errorResult.response && Array.isArray(errorResult.response)) {
          const validationErrors = errorResult.response.join(', ');
          errorMessage = `Validation failed: ${validationErrors}`;
        }

        throw new Error(errorMessage);
      }

      const result: ApiResponse<any> = await response.json();
      console.log('Success response:', result);

      if (result.status === 'Success' || result.status === 0) {
        const user = result.response;
        return {
          id: user.id || user.userId,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId, // Fixed: Map departmentId correctly
          department: user.department, // Keep for backward compatibility
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdTime: user.createdTime,
          password: ""
        };
      } else {
        throw new Error(result.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }, update: async (userId: string, userData: Partial<User>, updatePurpose: string | null): Promise<User> => {
    try {
      const updateRequest = {
        username: userData.username,
        email: userData.email,
        password: userData.password, // Optional - only if changing password
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        departmentId: userData.departmentId,
        isActive: userData.isActive
      };
      if (updatePurpose == "passwordChange") {
        const identifier = AuthService.getUserId();
        if (identifier) {
          userId = identifier;
          const userInfo = await UserService.getById(identifier);
          updateRequest.username = userInfo.username;
          updateRequest.email = userInfo.email;
          updateRequest.firstName = userInfo.firstName;
          updateRequest.lastName = userInfo.lastName;
          updateRequest.role = userInfo.role;
          updateRequest.departmentId = userInfo.departmentId;
          updateRequest.isActive = userInfo.isActive;
        }
      }
      console.log('Updating user with data:', updateRequest);
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to update user: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();

      if (result.status === 'Success' || result.status === 0) {
        const user = result.response;
        return {
          id: user.id || user.userId,
          userId: user.userId,
          username: user.username,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId, // Fixed: Map departmentId correctly
          department: user.department, // Keep for backward compatibility
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          createdTime: user.createdTime,
          password: ""
        };
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<void> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/${userId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to delete user: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();

      if (result.status !== 'Success' && result.status !== 0) {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  deactivate: async (userId: string): Promise<void> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/${userId}/deactivate`, {
        method: "PATCH"
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to deactivate user: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();

      if (result.status !== 'Success' && result.status !== 0) {
        throw new Error(result.message || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  activate: async (userId: string): Promise<void> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/${userId}/activate`, {
        method: "PATCH"
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to activate user: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();

      if (result.status !== 'Success' && result.status !== 0) {
        throw new Error(result.message || 'Failed to activate user');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  userExists: async (username: string): Promise<boolean> => {
    try {
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/User/exists/${username}`);

      if (!response.ok) {
        throw new Error(`Failed to check user existence: ${response.status}`);
      }

      const result: ApiResponse<boolean> = await response.json();

      if (result.status === 'Success' || result.status === 0) {
        return result.response;
      } else {
        throw new Error(result.message || 'Failed to check user existence');
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }
};