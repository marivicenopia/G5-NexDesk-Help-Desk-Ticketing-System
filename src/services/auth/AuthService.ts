const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";
const USER_EMAIL_KEY = "userEmail";
const USER_DEPARTMENT_KEY = "userDepartmentId";
const USER_ID_KEY = "userId";
const USER_FULLNAME_KEY = "userFullName";

export const AuthService = {
  login: (userId: string, role: string, email?: string, departmentId?: string, fullName?: string, jwtToken?: string) => {
    // Store JWT token if provided, otherwise use userId as fallback
    const tokenToStore = jwtToken || userId;
    localStorage.setItem(TOKEN_KEY, tokenToStore);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem("isAuthenticated", "true");
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);
    if (departmentId) localStorage.setItem(USER_DEPARTMENT_KEY, departmentId);
    if (fullName) localStorage.setItem(USER_FULLNAME_KEY, fullName);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_DEPARTMENT_KEY);
    localStorage.removeItem(USER_FULLNAME_KEY);
    // Clean up old department key if it exists
    localStorage.removeItem("userDepartment");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // Basic JWT token validation (check if it's expired)
    try {
      if (token.includes('.')) { // It's a JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
      }
      return true; // Fallback for non-JWT tokens
    } catch {
      return !!token; // Fallback if JWT parsing fails
    }
  },

  getRole: () => localStorage.getItem(ROLE_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUserId: () => localStorage.getItem(USER_ID_KEY),

  getUserEmail: () => localStorage.getItem(USER_EMAIL_KEY),

  getUserDepartmentId: () => localStorage.getItem(USER_DEPARTMENT_KEY),

  getUserFullName: () => localStorage.getItem(USER_FULLNAME_KEY),

  // Get Authorization header for API calls
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // Create authenticated fetch wrapper
  authenticatedFetch: async (url: string, options: RequestInit = {}) => {
    const authHeaders = AuthService.getAuthHeader();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers as any),
    };
    return fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    });
  },
};
