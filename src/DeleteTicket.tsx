import React, { useState} from 'react';
import './DeleteTicket.css';
// Import your icons
import editIcon from './PICTURES/EDIT_ICON.png';
import deleteIcon from './PICTURES/DELETE_ICON.png';

// Define types for our ticket data
interface Ticket {
  id: number;
  title: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'IN PROGRESS' | 'COMPLETED';
}

const DeleteTicket: React.FC = () => {
  // State to store all tickets
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1001, title: 'Forgot Password', date: '03/06/2025', priority: 'Medium', status: 'IN PROGRESS' },
    { id: 1002, title: 'Forgot Username', date: '03/06/2025', priority: 'Medium', status: 'IN PROGRESS' },
    { id: 1003, title: 'Server downtime', date: '03/27/2025', priority: 'High', status: 'COMPLETED' },
    { id: 1004, title: 'Account got hacked', date: '03/28/2025', priority: 'High', status: 'COMPLETED' },
    { id: 1005, title: 'Slow Internet', date: '03/15/2025', priority: 'Low', status: 'IN PROGRESS' }
  ]);

  // Handle ticket deletion
  const handleDeleteTicket = (id: number) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      // Filter out the deleted ticket
      const updatedTickets = tickets.filter(ticket => ticket.id !== id);
      setTickets(updatedTickets);
      // In a real application, you would make an API call here
      console.log(`Ticket ${id} deleted`);
    }
  };

  // Function to determine status class for styling
  const getStatusClass = (status: string): string => {
    return status === 'COMPLETED' ? 'status-completed' : 'status-in-progress';
  };

  return (
    <div className="ticket-content">
      <h1 className="page-title">Delete Ticket</h1>
      <div className="ticket-box">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.date}</td>
                <td>{ticket.priority}</td>
                <td>
                  <span className={getStatusClass(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="edit-btn">
                    <img src={editIcon} alt="Edit" className="icon-img" />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteTicket(ticket.id)}
                  >
                    <img src={deleteIcon} alt="Delete" className="icon-img" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="attachment-section">
          <button className="attach-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
            </svg>
            Attach Filter Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTicket;