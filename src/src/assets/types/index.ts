export type TicketStatus = 'IN_PROGRESS' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: string;
  titleMain: string;
  titleSub: string;
  number: string;
  status: TicketStatus;
  identifier: string;
  priority: TicketPriority;
}