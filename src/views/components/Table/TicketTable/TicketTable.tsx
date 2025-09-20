import React from "react";
import type { Ticket } from "../../../../types/ticket";

interface TicketTableProps {
    data: Ticket[];
    columns: {
        key: keyof Ticket | "actions";   // <-- allow "actions"
        label: string;
        render?: (ticket: Ticket) => React.ReactNode;
    }[];
    title?: string;
    // You can keep onEdit/onDelete if you want, but not required for this fix
}

const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'urgent':
            return "bg-red-100 text-red-800";
        case 'high':
            return "bg-orange-100 text-orange-800";
        case 'medium':
            return "bg-yellow-100 text-yellow-800";
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-green-100 text-green-800';
    }
};

const TicketTable: React.FC<TicketTableProps> = ({ data, columns, title }) => {
    return (
        <div className="w-full">
            {title && <h2 className="text-xl font-bold text-[#031849] mb-2">{title}</h2>}
            <table className="min-w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((ticket) => (
                        <tr key={String(ticket.id)}>
                            {columns.map((column) => {
                                if (column.key === "actions" && column.render) {
                                    return (
                                        <td key={`${ticket.id}-actions`} className="px-6 py-4 whitespace-nowrap">
                                            {column.render(ticket)}
                                        </td>
                                    );
                                }

                                const value = ticket[column.key as keyof Ticket];

                                if (column.key === "priority") {
                                    return (
                                        <td key={`${ticket.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityBadgeColor(String(value))}`}
                                            >
                                                {String(value)}
                                            </span>
                                        </td>
                                    );
                                }

                                return (
                                    <td key={`${ticket.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap">
                                        {column.render ? column.render(ticket) : (
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {typeof value === 'string' || typeof value === 'number'
                                                    ? value
                                                    : JSON.stringify(value)}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default TicketTable;