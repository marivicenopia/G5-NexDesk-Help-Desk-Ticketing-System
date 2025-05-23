import type { Ticket } from "../../types/ticket";

export const TicketService = {
  fetchAll: async (): Promise<Ticket[]> => {
    const response = await fetch("http://localhost:3001/tickets");
    if (!response.ok) throw new Error("Failed to fetch tickets");
    return await response.json();
  },

  // Add more ticket-related methods here
  fetchById: async (id: string): Promise<Ticket> => {
    const response = await fetch(`http://localhost:3001/tickets/${id}`);
    if (!response.ok) throw new Error("Failed to fetch ticket");
    return await response.json();
  },

  create: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    // Ensure submittedDate is a Date object, set if not present
    if (!ticket.submittedDate) {
      ticket.submittedDate = new Date(); // Date object, not string
    }

    // Ensure status is set to "open" if not provided
    if (!ticket.status) {
      ticket.status = "open";
    }

    const response = await fetch("http://localhost:3001/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // When sending JSON, the Date object will be automatically converted to ISO string
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
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:3001/tickets/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      // Optionally you can parse error response JSON to get details
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
    // If delete is successful, no need to return anything
  },
};
