import React, { useEffect, useState } from 'react';
import TicketTable from '../../../../components/Table/TicketTable';
import { ticketTableSchema as baseTicketColumns } from '../../../../../config/tableSchema';
import { TicketService } from '../../../../../services/ticket/TicketService';
import type { Ticket } from '../../../../../types/ticket';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ViewTicket: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTickets = async () => {
      try {
        const response = await TicketService.fetchAll();
        if (isMounted) setTickets(response);
      } catch (err) {
        if (isMounted) setError('Failed to fetch tickets');
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTickets();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (ticket: Ticket) => {
    // Example: open modal or navigate
    alert(`Edit ticket: ${ticket.id}`);
  };

  const handleDelete = async (ticket: Ticket) => {
    if (window.confirm(`Are you sure you want to delete ticket: ${ticket.id}?`)) {
      try {
        await TicketService.delete(String(ticket.id));
        setTickets(prev => prev.filter(t => t.id !== ticket.id));
      } catch (error) {
        console.error('Delete failed', error);
        setError('Failed to delete ticket');
      }
    }
  };

  const ticketColumns: {
    key: keyof Ticket | "actions";
    label: string;
    render?: (ticket: Ticket) => React.ReactNode;
  }[] = [
      ...baseTicketColumns,
      {
        key: "actions", 
        label: "Actions",
        render: (ticket: Ticket) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(ticket)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit Ticket"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(ticket)}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete Ticket"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ),
      },
    ];

  if (loading) {
    return <div className="text-center p-4">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex justify-center items-start w-full min-h-screen p-2">
      <div className="max-w-8xl w-full bg-white/5">
        <TicketTable data={tickets} columns={ticketColumns} title="Ticket Data" />
      </div>
    </div>
  );
};

export default ViewTicket;
