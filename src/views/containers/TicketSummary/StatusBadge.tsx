// src/features/TicketSummary/StatusBadge.tsx
import React from 'react';
import type { TicketSummaryStatus } from '../../../types/ticket';
import styles from './TicketSummary.module.css';

interface StatusBadgeProps {
    status: TicketSummaryStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusClass = (status: TicketSummaryStatus) => {
        switch (status) {
            case 'IN_PROGRESS':
                return styles.statusInProgress;
            case 'CLOSED':
                return styles.statusClosed;
            default:
                return styles.statusDefault;
        }
    };

    const getStatusLabel = (status: TicketSummaryStatus) => {
        switch (status) {
            case 'IN_PROGRESS':
                return 'In Progress';
            case 'CLOSED':
                return 'Closed';
            default:
                return status;
        }
    };

    return (
        <span className={`${styles.statusBadge} ${getStatusClass(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default StatusBadge;
