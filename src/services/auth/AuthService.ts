const TOKEN_KEY = "authToken";
const ROLE_KEY = "userRole";

export const AuthService = {
  login: (token: string, role: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", token); // Store user ID as token for now
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getRole: () => localStorage.getItem(ROLE_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),
};
