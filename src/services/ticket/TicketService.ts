import type { Ticket } from "../../types/ticket";

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

export const TicketService = {
  fetchAll: async (): Promise<Ticket[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  fetchById: async (id: string): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticket");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket:", error);
      throw error;
    }
  },

  create: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    try {
      // Ensure submittedDate is set if not present
      if (!ticket.submittedDate) {
        ticket.submittedDate = new Date();
      }

      // Ensure status is set to "open" if not provided (match React types)
      if (!ticket.status) {
        ticket.status = "open";
      }

      // Ensure priority is set
      if (!ticket.priority) {
        ticket.priority = "medium";
      }

      const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(ticket),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create ticket";
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

      const createdTicket = await response.json();
      return createdTicket;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  update: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...ticket, id }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update ticket";
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
      console.error("Error updating ticket:", error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update ticket status";
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
      console.error("Error updating ticket status:", error);
      throw error;
    }
  },

  assignTicket: async (id: string, assignedTo: string): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${id}/assign`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(assignedTo),
      });

      if (!response.ok) {
        let errorMessage = "Failed to assign ticket";
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
      console.error("Error assigning ticket:", error);
      throw error;
    }
  },

  deleteTicket: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        let errorMessage = `Failed to delete ticket with id ${id}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignore JSON parsing error
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  },
};
