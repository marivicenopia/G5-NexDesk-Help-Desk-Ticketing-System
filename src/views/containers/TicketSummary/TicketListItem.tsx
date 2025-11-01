// src/features/TicketSummary/TicketListItem.tsx
import React, { useState } from 'react';
import type { TicketSummaryItem, TicketSummaryStatus, TicketSummaryPriority } from '../../../types/ticket';
import StatusBadge from './StatusBadge';
import PriorityDropdown from './PriorityDropdown';
import styles from './TicketSummary.module.css';

interface TicketListItemProps {
    ticket: TicketSummaryItem;
    isEditing: boolean;
    onEditClick: (ticketId: string) => void;
    onSaveClick: (ticketId: string, newStatus: TicketSummaryStatus, newPriority: TicketSummaryPriority) => void;
    onCancelClick: () => void;
}

const TicketListItem: React.FC<TicketListItemProps> = ({
    ticket,
    isEditing,
    onEditClick,
    onSaveClick,
    onCancelClick,
}) => {
    const [tempStatus, setTempStatus] = useState<TicketSummaryStatus>(ticket.status);
    const [tempPriority, setTempPriority] = useState<TicketSummaryPriority>(ticket.priority);

    const handleStatusChange = (newStatus: TicketSummaryStatus) => {
        setTempStatus(newStatus);
    };

    const handlePriorityChange = (newPriority: TicketSummaryPriority) => {
        setTempPriority(newPriority);
    };

    const handleSave = () => {
        onSaveClick(ticket.id, tempStatus, tempPriority);
    };

    const handleCancel = () => {
        // Reset to original values
        setTempStatus(ticket.status);
        setTempPriority(ticket.priority);
        onCancelClick();
    };

    return (
        <tr className={styles.ticketRow}>
            <td className={styles.ticketCell}>
                <div className={styles.titleMain}>{ticket.titleMain}</div>
                <div className={styles.titleSub}>{ticket.titleSub}</div>
            </td>
            <td className={styles.ticketCell}>{ticket.number}</td>
            <td className={styles.ticketCell}>
                {isEditing ? (
                    <select
                        value={tempStatus}
                        onChange={(e) => handleStatusChange(e.target.value as TicketSummaryStatus)}
                        className={styles.statusSelect}
                    >
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                ) : (
                    <StatusBadge status={ticket.status} />
                )}
            </td>
            <td className={styles.ticketCell}>{ticket.identifier}</td>
            <td className={styles.ticketCell}>
                {isEditing ? (
                    <PriorityDropdown
                        value={tempPriority}
                        onChange={handlePriorityChange}
                    />
                ) : (
                    <span className={`${styles.priorityBadge} ${styles[`priority${ticket.priority}`]}`}>
                        {ticket.priority}
                    </span>
                )}
            </td>
            <td className={styles.ticketCell}>
                <div className={styles.actionButtons}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className={`${styles.actionButton} ${styles.saveButton}`}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className={`${styles.actionButton} ${styles.cancelButton}`}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onEditClick(ticket.id)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                        >
                            Edit
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default TicketListItem;
