import React, { useState, useMemo } from "react";
import type { Ticket } from "../../../types/ticket";
import { FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiCheck, FiUserPlus } from "react-icons/fi";

interface TicketTableProps {
    data: Ticket[];
    onEdit?: (ticket: Ticket) => void;
    onDelete?: (ticket: Ticket) => void;
    onView?: (ticket: Ticket) => void;
    onResolve?: (ticket: Ticket) => void;
    itemsPerPage?: number;
    showResolveAction?: boolean;
}

const TicketTable: React.FC<TicketTableProps> = ({
    data,
    onEdit,
    onDelete,
    onView,
    onResolve,
    itemsPerPage = 10,
    showResolveAction = false
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = useMemo(() => data.slice(startIndex, endIndex), [data, startIndex, endIndex]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'critical': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-indigo-100 text-indigo-800';
            case 'in progress': return 'bg-yellow-100 text-yellow-800';
            case 'on hold': return 'bg-orange-100 text-orange-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAvatarColor = (index: number) => {
        const colors = [
            'bg-red-500',
            'bg-yellow-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-orange-500'
        ];
        return colors[index % colors.length];
    };

    const getInitials = (text: string) => {
        return text
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No tickets found</div>
                <p className="text-sm text-gray-400">Tickets will appear here once they are created.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ticket
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentData.map((ticket, index) => {
                            const customerName = ticket.customerName || ticket.submittedBy || 'Unknown';
                            const avatarColor = getAvatarColor(index);
                            const initials = getInitials(customerName);

                            return (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                #{ticket.id}
                                            </div>
                                            <div className="text-sm text-gray-900 font-medium mb-1">
                                                {ticket.title || 'No Title'}
                                            </div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {ticket.description || 'No description available'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full ${avatarColor} text-white font-semibold flex items-center justify-center text-sm`}>
                                                {initials}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customerName}</div>
                                                <div className="text-sm text-gray-500">{ticket.department || 'General'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority || 'medium')}`}>
                                            {ticket.priority || 'Medium'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status || 'open')}`}>
                                            {ticket.status || 'Open'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ticket.submittedDate ? new Date(ticket.submittedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView?.(ticket)}
                                                className="text-green-600 hover:text-green-800 p-1 rounded"
                                                title="View Ticket"
                                            >
                                                <FiEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit?.(ticket)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                title="Assign Ticket"
                                            >
                                                <FiUserPlus size={16} />
                                            </button>
                                            {showResolveAction && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                <button
                                                    onClick={() => onResolve?.(ticket)}
                                                    className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                                    title="Resolve Ticket"
                                                >
                                                    <FiCheck size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDelete?.(ticket)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                                title="Delete Ticket"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <FiChevronLeft size={14} />
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            // Show first page, last page, current page, and pages around current page
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded text-sm ${page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
                                return (
                                    <span key={page} className="px-2 text-gray-400">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}

                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            Next
                            <FiChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketTable;
