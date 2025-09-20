import React from 'react';
import type { TicketPriority } from '../assets/types/index'; 
import styles from './TicketSummary.module.css';

interface PriorityDropdownProps {
  selectedPriority: TicketPriority;
  ticketId: string; 
  onChangePriority: (ticketId: string, newPriority: TicketPriority) => void;
}

const PriorityDropdown: React.FC<PriorityDropdownProps> = ({
  selectedPriority,
  ticketId,
  onChangePriority,
}) => {
  const priorities: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangePriority(ticketId, event.target.value as TicketPriority);
  };

  return (
    <select
      value={selectedPriority}
      onChange={handleChange}
      className={styles.priorityDropdown}
      onClick={(e) => e.stopPropagation()}
    >
      {priorities.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
};

export default PriorityDropdown;