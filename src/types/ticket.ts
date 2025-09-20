export type PriorityOption = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type StatusOption = 'open' | 'assigned' | 'in progress' | 'on hold' | 'resolved' | 'closed';

// Extended types for ticket summary feature
export type TicketSummaryStatus = 'IN_PROGRESS' | 'CLOSED';
export type TicketSummaryPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TicketAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    uploadDate: string;
}

export interface Ticket {
    id: string | number;
    title: string;
    description: string;
    priority: PriorityOption;
    department: string;
    submittedBy: string;
    submittedDate: Date;
    status: StatusOption;
    assignedTo?: string;
    // Optional fields for enhanced ticket management
    customerName?: string;
    customerEmail?: string;
    contactNumber?: string;
    customerContact?: string;
    category?: string;
    // File attachments
    attachments?: TicketAttachment[];
    // Resolution fields
    resolvedBy?: string;
    resolvedDate?: string;
    resolutionDescription?: string;
    agentFeedback?: string;
}

// Ticket Summary specific interface
export interface TicketSummaryItem {
    id: string;
    titleMain: string;
    titleSub: string;
    number: string;
    status: TicketSummaryStatus;
    identifier: string;
    priority: TicketSummaryPriority;
}