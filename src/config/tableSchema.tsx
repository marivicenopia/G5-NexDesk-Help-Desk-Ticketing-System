import React from "react";
import type { Ticket } from "../types/ticket";
import type { User } from "../types/user";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export const userTableSchema = (
  handleEdit: (user: User) => void,
  handleDelete: (user: User) => void
) => [
    { key: "id", label: "ID" },
    { key: "username", label: "Username" },
    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    {
      key: "isActive",
      label: "Status",
      render: (user: User) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions' as any,
      label: 'Actions',
      render: (user: User) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            aria-label="Edit User"
            title="Edit User"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            aria-label="Delete User"
            title="Delete User"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
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
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold "bg-gray-100 text-gray-800"}`}>
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