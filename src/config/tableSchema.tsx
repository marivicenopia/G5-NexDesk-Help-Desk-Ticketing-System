import React from "react";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/user";

export const userTableSchema: { key: keyof User; label: string; render?: (user: User) => React.ReactNode }[] = [
    { key: 'id', label: 'ID' },
    { key: 'lastname', label: 'Last Name' },
    { key: 'firstname', label: 'First Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'supportTeams', label: 'Support Teams' },
];

export const ticketTableSchema: { key: keyof Ticket; label: string; render?: (ticket: Ticket) => React.ReactNode }[] = [
    {
        key: "id",
        label: "Ticket ID",
    },
    {
        key: "title",
        label: "Title",
    },
    {
        key: "priority",
        label: "Priority",
        render: (ticket: Ticket) => {
            const colorMap = {
                low: "bg-green-100 text-green-800",
                medium: "bg-yellow-100 text-yellow-800",
                high: "bg-orange-100 text-orange-800",
                urgent: "bg-red-100 text-red-800",
            };
            return (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[ticket.priority] || "bg-gray-100 text-gray-800"}`}>
                    {ticket.priority}
                </span>
            );
        },
    },
    {
        key: "status",
        label: "Status",
        render: (ticket: Ticket) => {
            const colorMap = {
                open: "bg-blue-100 text-blue-800",
                assigned: "bg-purple-100 text-purple-800",
                "in progress": "bg-yellow-100 text-yellow-800",
                "on hold": "bg-gray-200 text-gray-800",
                resolved: "bg-green-100 text-green-800",
                closed: "bg-gray-400 text-gray-900",
            };
            return (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[ticket.status] || "bg-gray-100 text-gray-800"}`}>
                    {ticket.status}
                </span>
            );
        },
    },
    {
        key: "submittedBy",
        label: "Submitted By",
    },
    {
        key: "submittedDate",
        label: "Submitted Date",
        render: (ticket: Ticket) => {
            return new Date(ticket.submittedDate).toLocaleDateString();
        },
    },
    {
        key: "assignedTo",
        label: "Assigned To",
    },
];