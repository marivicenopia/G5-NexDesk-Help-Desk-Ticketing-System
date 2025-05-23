  import React, { useState, useEffect } from 'react';
  import type { Ticket, TicketPriority, TicketStatus } from '../assets/types/index'; // Ensure path is correct
  import StatusBadge from './StatusBadge';
  import PriorityDropdown from './PriorityDropdown';
  import styles from './TicketSummary.module.css';


  interface TicketListItemProps {
    ticket: Ticket;
    isEditing: boolean;
    onEditClick: (ticketId: string) => void;
    onSaveClick: (ticketId: string, newStatus: TicketStatus, newPriority: TicketPriority) => void;
    onCancelClick: () => void;
  }

  const availableStatuses: TicketStatus[] = ['IN_PROGRESS', 'CLOSED'];

  const TicketListItem: React.FC<TicketListItemProps> = ({
    ticket,
    isEditing,
    onEditClick,
    onSaveClick,
    onCancelClick,
  }) => {
    const [editedStatus, setEditedStatus] = useState<TicketStatus>(ticket.status);
    const [editedPriority, setEditedPriority] = useState<TicketPriority>(ticket.priority);

    // LOG 6: To see if the component re-renders and what 'isEditing' is
    console.log(`TicketListItem RENDER for ${ticket.id}, isEditing: ${isEditing}`);

    useEffect(() => {
      // LOG 7: To see if local state for edit fields is being synced
      console.log(`TicketListItem SYNC for ${ticket.id}, isEditing: ${isEditing}, ticket.status: ${ticket.status}`);
      if (isEditing) { // Only set if we are entering edit mode or ticket data changed while editing
          setEditedStatus(ticket.status);
          setEditedPriority(ticket.priority);
      }
    }, [ticket.status, ticket.priority, isEditing, ticket.id]); // Added ticket.id to deps for safety

    const handleSave = () => {
      console.log(`TicketListItem SAVE for ${ticket.id}: status=${editedStatus}, priority=${editedPriority}`);
      onSaveClick(ticket.id, editedStatus, editedPriority);
    };

    const handleInternalEditClick = () => {
      console.log(`TicketListItem EDIT BUTTON CLICKED for ${ticket.id}`);
      onEditClick(ticket.id);
    };

    if (isEditing) {
      console.log(`TicketListItem RENDERING EDIT MODE for ${ticket.id}`);
      return (
        <tr className={`${styles.ticketRow} ${styles.editingRow}`}>
          <td className={styles.ticketCell}>
            <div className={styles.titleMain}>{ticket.titleMain}</div>
            <div className={styles.titleSub}>{ticket.titleSub}</div>
          </td>
          <td className={styles.ticketCell}>{ticket.number}</td>
          <td className={styles.ticketCell}>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value as TicketStatus)}
              className={styles.statusDropdownEdit}
            >
              {availableStatuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </td>
          <td className={styles.ticketCell}>{ticket.identifier}</td>
          <td className={styles.ticketCell}>
            <PriorityDropdown
              selectedPriority={editedPriority}
              ticketId={ticket.id}
              onChangePriority={(_ticketId, newPriority) => setEditedPriority(newPriority)} // Simplified local handler
            />
          </td>
          <td className={styles.ticketCell}>
            <button onClick={handleSave} className={`${styles.actionButton} ${styles.saveButton}`}>Save</button>
            <button onClick={onCancelClick} className={`${styles.actionButton} ${styles.cancelButton}`}>Cancel</button>
          </td>
        </tr>
      );
    } else {
      console.log(`TicketListItem RENDERING DISPLAY MODE for ${ticket.id}`);
      return (
        <tr className={styles.ticketRow}>
          <td className={styles.ticketCell}>
            <div className={styles.titleMain}>{ticket.titleMain}</div>
            <div className={styles.titleSub}>{ticket.titleSub}</div>
          </td>
          <td className={styles.ticketCell}>{ticket.number}</td>
          <td className={styles.ticketCell}>
            <StatusBadge status={ticket.status} ticketId={ticket.id} />
          </td>
          <td className={styles.ticketCell}>{ticket.identifier}</td>
          <td className={styles.ticketCell}>
            <span className={styles.priorityText}>{ticket.priority}</span>
          </td>
          <td className={styles.ticketCell}>
            <button onClick={handleInternalEditClick} className={`${styles.actionButton} ${styles.editButton}`}>Edit</button>
          </td>
        </tr>
      );
    }
  };

  export default TicketListItem;