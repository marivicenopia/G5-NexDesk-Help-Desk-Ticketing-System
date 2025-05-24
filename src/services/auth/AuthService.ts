const TOKEN_KEY = "";
const ROLE_KEY = "";

export const AuthService = {
  login: (token: string, role: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getRole: () => localStorage.getItem(ROLE_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),
};
