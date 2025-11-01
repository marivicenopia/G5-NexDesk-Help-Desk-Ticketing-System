// src/features/TicketSummary/TicketList.tsx
import React from 'react';
import styles from './TicketSummary.module.css';
import TicketListItem from './TicketListItem';
import type { TicketSummaryItem, TicketSummaryPriority, TicketSummaryStatus } from '../../../types/ticket';

interface TicketListProps {
    tickets: TicketSummaryItem[];
    editingTicketId: string | null;
    onEditClick: (ticketId: string) => void;
    onSaveClick: (ticketId: string, newStatus: TicketSummaryStatus, newPriority: TicketSummaryPriority) => void;
    onCancelClick: () => void;
}

const TicketList: React.FC<TicketListProps> = ({
    tickets,
    editingTicketId,
    onEditClick,
    onSaveClick,
    onCancelClick,
}) => {
    if (!tickets || tickets.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No tickets to display.</p>
            </div>
        );
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
                    <th className={styles.tableHeader}>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket) => (
                    <TicketListItem
                        key={ticket.id}
                        ticket={ticket}
                        isEditing={editingTicketId === ticket.id}
                        onEditClick={onEditClick}
                        onSaveClick={onSaveClick}
                        onCancelClick={onCancelClick}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default TicketList;
