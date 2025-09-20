// src/features/TicketSummary/StatusBadge.tsx
import React from 'react';
import type { TicketStatus } from '../assets/types'; // Verify this path
import styles from './TicketSummary.module.css';

interface StatusBadgeProps {
  status: TicketStatus;
  ticketId: string;
  onClick?: (ticketId: string, currentStatus: TicketStatus) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ticketId, onClick }) => {
  let statusText = '';
  let statusClass = '';

  switch (status) {
    case 'IN_PROGRESS':
      statusText = 'IN PROGRESS';
      statusClass = styles.statusInProgress;
      break;
    case 'CLOSED':
      statusText = 'CLOSED';
      statusClass = styles.statusClosed;
      break;
    default:
      const unknownStatus: string = status as string; // Cast to string if TS thinks it's never
      statusText = unknownStatus.replace('_', ' ').toUpperCase();
      statusClass = styles.statusDefault;
      console.warn(`Unknown status encountered in StatusBadge: ${status}`); // Good to log this
  }

  const handleClick = () => {
    if (onClick) {
      onClick(ticketId, status);
    }
  };

  const ElementType = onClick ? 'button' : 'span';
  const elementProps = onClick ? {
                                  type: 'button' as 'button',
                                  onClick: handleClick,
                                  className: `${styles.statusBadge} ${statusClass} ${styles.statusBadgeClickable}`
                                }
                              : {
                                  className: `${styles.statusBadge} ${statusClass}`
                                };

  return <ElementType {...elementProps}>{statusText}</ElementType>;
};

export default StatusBadge;