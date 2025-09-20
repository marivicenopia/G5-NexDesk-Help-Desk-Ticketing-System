const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";
const USER_EMAIL_KEY = "userEmail";
const USER_DEPARTMENT_KEY = "userDepartment";

export const AuthService = {
  login: (token: string, role: string, email?: string, department?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", token); // Store user ID as token for now
    if (email) localStorage.setItem(USER_EMAIL_KEY, email);
    if (department) localStorage.setItem(USER_DEPARTMENT_KEY, department);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_DEPARTMENT_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getRole: () => localStorage.getItem(ROLE_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUserEmail: () => localStorage.getItem(USER_EMAIL_KEY),

  getUserDepartment: () => localStorage.getItem(USER_DEPARTMENT_KEY),
};
