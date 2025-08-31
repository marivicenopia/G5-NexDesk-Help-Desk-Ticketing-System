// src/features/TicketSummary/PriorityDropdown.tsx
import React from 'react';
import type { TicketSummaryPriority } from '../../../types/ticket';
import styles from './TicketSummary.module.css';

interface PriorityDropdownProps {
    value: TicketSummaryPriority;
    onChange: (priority: TicketSummaryPriority) => void;
}

const PriorityDropdown: React.FC<PriorityDropdownProps> = ({ value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as TicketSummaryPriority)}
            className={styles.prioritySelect}
        >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
        </select>
    );
};

export default PriorityDropdown;
