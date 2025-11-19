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

  logout: async () => {
    try {
      // Call backend logout endpoint to clear server-side session/cookies
      await fetch('http://localhost:5000/api/Auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeader()
        }
      });
    } catch (error) {
      console.warn('Backend logout failed, but continuing with client-side cleanup:', error);
    }

    // Clear localStorage items
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_DEPARTMENT_KEY);
    localStorage.removeItem(USER_FULLNAME_KEY);
    // Clean up old department key if it exists
    localStorage.removeItem("userDepartment");
    // Clean up any other legacy keys
    localStorage.removeItem("user");

    // Clear specific known cookies by setting them to expire immediately
    document.cookie = "tkn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "asi.basecode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear all cookies that might be related to authentication or sessions
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.toLowerCase().includes('auth') ||
        name.toLowerCase().includes('token') ||
        name.toLowerCase().includes('basecode') ||
        name === 'tkn' ||
        name === 'asi.basecode') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
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
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });
  },
};
