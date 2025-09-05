import type { User } from "../../types/user";

export const UserService = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch("http://localhost:3001/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  },

  getById: async (id: string): Promise<User> => {
    const response = await fetch(`http://localhost:3001/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return await response.json();
  },

  getAgents: async (): Promise<User[]> => {
    const response = await fetch("http://localhost:3001/users?role=agent");
    if (!response.ok) throw new Error("Failed to fetch agents");
    return await response.json();
  },

  create: async (user: Partial<User>): Promise<User> => {
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return await response.json();
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return await response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },
};