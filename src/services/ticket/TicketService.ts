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
    const toStatusTitle = (s?: string) => {
      if (!s) return s;
      const map: Record<string,string> = {
        'open': 'Open',
        'assigned': 'Assigned',
        'in progress': 'In Progress',
        'on hold': 'On Hold',
        'resolved': 'Resolved',
        'closed': 'Closed',
      };
      const key = String(s).trim().toLowerCase();
      return map[key] ?? s;
    };
    const maybeFiles: File[] = (() => {
      const t: any = ticket as any;
      if (Array.isArray(t.files)) return t.files;
      if (Array.isArray(t.attachmentsFiles)) return t.attachmentsFiles;
      return [];
    })();

    let response: Response;

    if (maybeFiles && maybeFiles.length > 0) {
      const fd = new FormData();
      // Append textual fields
      if (ticket.title) fd.append('title', ticket.title);
      if (ticket.description) fd.append('description', ticket.description);
      fd.append('priority', toPascal(ticket.priority as string) ?? 'Low');
      fd.append('department', (ticket.department as string) ?? 'General');
      fd.append('status', toStatusTitle((ticket as any).status) ?? 'Open');
      if (ticket.submittedBy) fd.append('submittedBy', ticket.submittedBy);
      fd.append('assignedTo', (ticket as any).assignedTo ?? 'Unassigned');
      if (ticket.customerName) fd.append('customerName', ticket.customerName);
      if (ticket.customerEmail) fd.append('customerEmail', ticket.customerEmail);
      if (ticket.contactNumber) fd.append('contactNumber', ticket.contactNumber as any);
      if (ticket.category) fd.append('category', ticket.category);

      // Append files: single uses 'file', multiple uses 'files'
      if (maybeFiles.length === 1) {
        fd.append('file', maybeFiles[0]);
      } else {
        for (const f of maybeFiles) fd.append('files', f);
      }

      response = await fetch("/api/tickets", {
        method: "POST",
        // Do NOT set Content-Type for FormData; browser sets boundary
        headers: {
          "Accept": "application/json",
        },
        credentials: 'include',
        body: fd,
      });
      // Fallback: some backends expose a dedicated with-attachments endpoint
      if (response.status === 415) {
        try {
          const alt = await fetch("/api/tickets/with-attachments", {
            method: "POST",
            headers: { "Accept": "application/json" },
            credentials: 'include',
            body: fd,
          });
          response = alt;
        } catch {
          // keep original response for error handling below
        }
      }
    } else {
      const createDto = {
        title: ticket.title ?? '',
        description: ticket.description ?? '',
        priority: toPascal(ticket.priority as string) ?? 'Low',
        department: ticket.department ?? 'General',
        status: toStatusTitle((ticket as any).status) ?? 'Open',
        submittedBy: ticket.submittedBy ?? '',
        assignedTo: (ticket as any).assignedTo ?? 'Unassigned',
        customerName: ticket.customerName,
        customerEmail: ticket.customerEmail,
        contactNumber: ticket.contactNumber,
        category: ticket.category,
      };

      response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(createDto),
      });
    }

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

  update: async (
    id: string,
    data: Partial<Ticket> & { files?: File[]; removeAttachmentIds?: string[] }
  ): Promise<Ticket> => {
    const files = (data as any).files as File[] | undefined;
    const removeIds = (data as any).removeAttachmentIds as string[] | undefined;

    // Fetch current ticket to mirror previously working full-object update
    let existing: any = {};
    try {
      const cur = await fetch(`/api/tickets/${id}`, { credentials: 'include', headers: { Accept: 'application/json' } });
      if (cur.ok) {
        const raw = await cur.json();
        existing = raw?.response ?? raw;
      }
    } catch {}

    // Sanitize existing object: remove arrays/props the backend might reject
    const base: any = { ...existing };
    if (base.attachments) delete base.attachments;
    if (base.ticketAttachments) delete base.ticketAttachments;
    if (base.files) delete base.files;

    // Ensure submittedDate is a string to match earlier working code
    if (base.submittedDate && typeof base.submittedDate !== 'string') {
      try { base.submittedDate = new Date(base.submittedDate).toISOString(); } catch {}
    }

    const updatedTicket: any = {
      ...base,
      title: data.title !== undefined ? String(data.title).trim() : base.title,
      description: data.description !== undefined ? String(data.description).trim() : base.description,
      // Keep priority casing as provided by form to mirror previous behavior
      priority: (data.priority as any) !== undefined ? (data.priority as any) : base.priority,
      department: data.department !== undefined ? data.department : base.department,
      lastModified: new Date().toISOString(),
    };

    const resp = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedTicket),
    });
    if (!resp.ok) {
      let message = `Failed to update ticket ${id}`;
      let details: any = undefined;
      try {
        const txt = await resp.text();
        if (txt) {
          try { const j = JSON.parse(txt); message = j.message || j.error || message; details = j; }
          catch { details = txt; message = txt || message; }
        }
      } catch {}
      throw new Error(JSON.stringify({ message, details, status: resp.status }));
    }

    // Remove attachments if requested (DELETE per id)
    if (removeIds && removeIds.length > 0) {
      for (const rid of removeIds) {
        try {
          await fetch(`/api/tickets/${id}/attachments/${rid}`, { method: 'DELETE', credentials: 'include' });
          // ignore 404 silently
        } catch {}
      }
    }

    // Optional: upload files individually if endpoint exists
    if (files && files.length > 0) {
      for (const f of files) {
        const fd = new FormData();
        fd.append('file', f);
        try {
          const up = await fetch(`/api/tickets/${id}/attachments`, { method: 'POST', credentials: 'include', body: fd });
          if (!up.ok) break; // stop on first failure silently
        } catch {}
      }
    }

    // Return updated ticket (try refetch; fallback to PUT response body)
    try {
      const refreshed = await fetch(`/api/tickets/${id}`, { credentials: 'include' });
      if (refreshed.ok) {
        const j = await refreshed.json();
        return (j.response ?? j) as Ticket;
      }
    } catch {}
    try {
      const body = await resp.json();
      return (body.response ?? body) as Ticket;
    } catch {
      return updatedTicket as Ticket; // fallback minimal
    }
  },
};
