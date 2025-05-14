import React, { useState, useEffect, useRef } from 'react';

import './ReassignTicket.css';

interface Ticket {
  id: string;
  description: string;
  assignedTo: string;
  reassignTo?: string;
}

interface Agent {
  id: string;
  name: string;
}

const ReassignTicket: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1001', description: 'Forgot Password', assignedTo: 'Linus, Ralph Carlo' },
    { id: '1002', description: 'Forgot Username', assignedTo: 'Tupas, Gian James' },
    { id: '1005', description: 'Slow Internet', assignedTo: 'Occo, Martin' },
    { id: '1006', description: 'Account Setup', assignedTo: 'Richards, Alden' },
  ]);

  const agents: Agent[] = [
    { id: '1', name: 'John Wick' } ,
    { id: '2', name: 'Michael Jordan' },
    { id: '3', name: 'Park Bogum' },
    { id: '4', name: 'Nam Dosan' },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (ticketId: string) => {
    setOpenDropdown(openDropdown === ticketId ? null : ticketId);
  };

  const selectAgent = (ticketId: string, agentName: string) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, reassignTo: agentName }
        : ticket
    ));
    setOpenDropdown(null);
  };

  const handleUpdate = () => {
    alert('Tickets reassigned successfully!');
    console.log('Updated tickets:', tickets);
  };


  return (
    <div className="reassign-page">
      <main className="content">
        <div className="page-title">
          <span className="title-label">Reassign Ticket</span>
        </div>

        <div className="card">
          <div className="card-header">
            <i className="card-icon list-icon"></i>
            <span>Agent Lists</span>
          </div>

          <div className="table-container">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>TICKET ID</th>
                  <th>DESCRIPTION</th>
                  <th>ASSIGNED TO</th>
                  <th>REASSIGN TO</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.assignedTo}</td>
                    <td>
                        <div className="ticket-dropdown-container">

                        <button
                          className="ticket-dropdown-button"
                          onClick={() => toggleDropdown(ticket.id)}
                        >
                          {ticket.reassignTo || 'Select Agent'}
                          <i className="ticket-dropdown-icon"></i>
                        </button>

                        {openDropdown === ticket.id && (
                          <div className="ticket-dropdown-menu">
                            {agents.map((agent) => (
                              <div
                                key={agent.id}
                                className="ticket-dropdown-item"
                                onClick={() => selectAgent(ticket.id, agent.name)}
                              >
                                {agent.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="action-container">
          <button
            className="update-button"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReassignTicket;
