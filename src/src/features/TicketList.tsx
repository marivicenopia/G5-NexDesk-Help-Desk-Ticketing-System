// src/features/TicketSummary/TicketList.tsx
import React from 'react';
import styles from './TicketSummary.module.css';
import TicketListItem from './TicketListItem';
// **** IMPORTANT: Verify this path to your types file ****
// e.g., import type { Ticket, TicketPriority, TicketStatus } from '../../types';
import type { Ticket, TicketPriority, TicketStatus } from '../assets/types/index'; // Using the path you had

interface TicketListProps {
  tickets: Ticket[];
  editingTicketId: string | null;
  onEditClick: (ticketId: string) => void; // Must accept this prop
  onSaveClick: (ticketId: string, newStatus: TicketStatus, newPriority: TicketPriority) => void;
  onCancelClick: () => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  editingTicketId,
  onEditClick,     // Destructure it here
  onSaveClick,
  onCancelClick,
}) => {
  if (!tickets || tickets.length === 0) {
    return <p>No tickets to display.</p>;
  }

  return (
    <table className={styles.ticketTable}>
      <thead>
        <tr className={styles.tableHeaderRow}>
          <th className={styles.tableHeader}>TITLE</th>
          <th className={styles.tableHeader}>NUMBER</th>
          <th className={styles.tableHeader}>STATUS</th>
          <th className={styles.tableHeader}>IDENTIFIER</th>
          <th className={styles.tableHeader}>PRIORITY</th>
          <th className={styles.tableHeader}>ACTIONS</th> {/* Header for Edit button column */}
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            isEditing={editingTicketId === ticket.id}
            onEditClick={onEditClick} // <<<< And pass it here
            onSaveClick={onSaveClick}
            onCancelClick={onCancelClick}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TicketList;