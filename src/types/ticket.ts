export type PriorityOption = 'low' | 'medium' | 'high' | 'urgent';
export type StatusOption = 'open' | 'assigned' | 'in progress' | 'on hold' | 'resolved' | 'closed';

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
}