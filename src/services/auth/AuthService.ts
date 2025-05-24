const TOKEN_KEY = "isAuthenticated";
const ROLE_KEY = "userRole";

export const AuthService = {
  login: (role: string) => {
    localStorage.setItem(TOKEN_KEY, "true");
    localStorage.setItem(ROLE_KEY, role);
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
  isAuthenticated: () => localStorage.getItem(TOKEN_KEY) === "true",
  getRole: () => localStorage.getItem(ROLE_KEY),
};

