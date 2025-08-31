import React, { useState, useEffect } from 'react';
import type { Ticket } from '../../../types/ticket';
import TicketTable from '../../components/TicketTable';

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/tickets');
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (ticket: Ticket) => {
        // Navigate to ticket detail view
        alert(`View ticket #${ticket.id}: ${ticket.title}`);
    };

    const handleEdit = (ticket: Ticket) => {
        // Navigate to edit ticket form
        alert(`Edit ticket #${ticket.id}: ${ticket.title}`);
    };

    const handleDelete = async (ticket: Ticket) => {
        if (!confirm(`Are you sure you want to delete ticket #${ticket.id}?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/tickets/${ticket.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }

            setTickets(tickets.filter(t => t.id !== ticket.id));
            alert('Ticket deleted successfully');
        } catch (err) {
            alert('Failed to delete ticket');
            console.error('Delete error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading tickets...</div>
                    <div className="mt-2 text-sm text-gray-500">Please wait while we fetch the ticket data.</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">Error Loading Tickets</div>
                    <div className="text-sm text-red-500">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <TicketTable
                data={tickets}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TicketManagement;
