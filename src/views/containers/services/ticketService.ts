// src/services/ticketService.ts
export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  ticketCategory: string;
  priorityStatus: string;
  contactNumber: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachmentUrl?: string;
  
}

export interface CreateTicketData {
  customerName: string;
  customerEmail: string;
  ticketCategory: string;
  priorityStatus: string;
  contactNumber: string;
  description: string;
  attachment?: File;
}

export interface Employee {
  selected: any;
  id: string;
  name: string;
  status: 'available' | 'unavailable';
  department: string;
  role: string;
  email: string;
}

export interface Team {
  selected: any;
  id: string;
  name: string;
  status: 'available' | 'unavailable';
  description: string;
  memberCount: number;
}
// JSON Server runs on port 3001 by default
const API_URL = 'http://localhost:3001/tickets';

// Helper function to get a ticket by ID - outside the service object
const getTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

export const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData: CreateTicketData): Promise<Ticket> => {
    try {
      // Filter out the attachment as JSON Server doesn't handle file uploads
      const { attachment, ...ticketDataWithoutFile } = ticketData;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ticketDataWithoutFile,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Note: In a real app, you'd upload the file to storage and save the URL
          attachmentUrl: attachment ? 'file-url-placeholder.jpg' : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },
  
  // Get all tickets
  getAllTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },
  
  // Get a ticket by ID - expose the helper function
  getTicketById,
  
  // Update a ticket
  updateTicket: async (id: string, ticketData: Partial<CreateTicketData>): Promise<Ticket> => {
    try {
      // First get the current ticket data - using the helper function instead of this
      const currentTicket = await getTicketById(id);
      
      // Filter out the attachment as JSON Server doesn't handle file uploads
      const { attachment, ...ticketDataWithoutFile } = ticketData;
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // JSON Server uses PUT for full updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentTicket,
          ...ticketDataWithoutFile,
          updatedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },
  
  // Delete a ticket
  deleteTicket: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  },
  
  // Assign a ticket to someone
  assignTicket: async (id: string, assignedTo: string): Promise<Ticket> => {
    try {
      // First get the current ticket data - using the helper function instead of this
      const currentTicket = await getTicketById(id);
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentTicket,
          assignedTo,
          status: 'in-progress',
          updatedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      throw error;
    }
 },
    getAllEmployees: async (): Promise<Employee[]> => {
    try {
            const response = await fetch('http://localhost:3001/employees');
            
            if (!response.ok) {
            throw new Error('Failed to fetch employees');
            }
            
            return await response.json();
        } 
        catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    getAllTeams: async (): Promise<Team[]> => {
        try {
            const response = await fetch('http://localhost:3001/teams');
            
            if (!response.ok) {
            throw new Error('Failed to fetch teams');
            }
            
            return await response.json();
        } 
        catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }
  
};