const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";
const USER_EMAIL_KEY = "userEmail";
const USER_DEPARTMENT_KEY = "userDepartment";
const USER_KEY = "user";

// Use relative URL since Vite proxy is configured
const API_BASE_URL = "";

interface LoginCredentials {
  userId: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
  };
  token: string;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Account/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      // Store user data in localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(ROLE_KEY, data.user.role);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem(USER_EMAIL_KEY, data.user.email);
      localStorage.setItem(USER_DEPARTMENT_KEY, data.user.department);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // For backward compatibility with existing components
  loginLegacy: (token: string, role: string, email?: string, department?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", token); // Store user ID as token for now
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);
    if (department) localStorage.setItem(USER_DEPARTMENT_KEY, department);
  },

  logout: async () => {
    try {
      // Call C# API logout endpoint
      await fetch(`${API_BASE_URL}/api/Account/SignOutUser`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem(USER_EMAIL_KEY);
      localStorage.removeItem(USER_DEPARTMENT_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getRole: () => localStorage.getItem(ROLE_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUserEmail: () => localStorage.getItem(USER_EMAIL_KEY),

  getUserDepartment: () => localStorage.getItem(USER_DEPARTMENT_KEY),

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
};
