import type { Ticket } from "../../types/ticket";

export const TicketService = {
  fetchAll: async (): Promise<Ticket[]> => {
    const response = await fetch("/api/tickets", { credentials: 'include' });
    if (!response.ok) throw new Error("Failed to fetch tickets");
    const data = await response.json();
    return Array.isArray(data) ? data : (data.response ?? []);
  },

  // Add more ticket-related methods here
  fetchById: async (id: string): Promise<Ticket> => {
    const response = await fetch(`/api/tickets/${id}`, { credentials: 'include' });
    if (!response.ok) throw new Error("Failed to fetch ticket");
    const data = await response.json();
    return (data.response ?? data) as Ticket;
  },

  create: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    const toPascal = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
    const createDto = {
      title: ticket.title ?? '',
      description: ticket.description ?? '',
      priority: toPascal(ticket.priority as string) ?? 'Low',
      department: ticket.department ?? 'General',
      submittedBy: ticket.submittedBy ?? '',
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      contactNumber: ticket.contactNumber,
      category: ticket.category,
    };

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(createDto),
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

    const created = await response.json();
    return (created.response ?? created) as Ticket;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/tickets/${id}`, {
      method: "DELETE",
      credentials: 'include',
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
