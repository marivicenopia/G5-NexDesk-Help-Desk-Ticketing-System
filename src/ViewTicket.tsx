import React from 'react';
import './ViewTicket.css';

interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  category: string;
  priority: string;
  contactNumber: string;
  description: string;
}

const ViewTicket: React.FC = () => {
  // Sample data - in a real app, you would fetch this from an API or props
  const ticket: Ticket = {
    id: '#1004',
    customerName: 'Stephen Curry',
    customerEmail: 'stephcurry30@gmail.com',
    category: 'Software',
    priority: 'High',
    contactNumber: '01123334455',
    description: 'I tried opening my account but I can\'t logged in it says incorrect password/username, but I have never changed my account\'s username or password ever since.'
  };

  const handleClose = () => {
    // Navigate back or close modal depending on your app's design
    // For example: window.history.back();
    console.log('Close button clicked');
  };

  return (
    <div className="ticket-content">
      <h1 className="page-title">Ticket Details</h1>
      <div className="ticket-box">
        <div className="ticket-id-badge">Ticket ID {ticket.id}</div>
        
        <div className="view-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                value={ticket.customerName}
                className="form-control"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerEmail">Customer Email</label>
              <input
                type="email"
                id="customerEmail"
                value={ticket.customerEmail}
                className="form-control"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Ticket Category Type</label>
              <input
                type="text"
                id="category"
                value={ticket.category}
                className="form-control"
                readOnly
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority Status</label>
              <input
                type="text"
                id="priority"
                value={ticket.priority}
                className="form-control"
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="text"
                id="contactNumber"
                value={ticket.contactNumber}
                className="form-control"
                readOnly
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Ticket Description</label>
            <textarea
              id="description"
              value={ticket.description}
              className="form-control description-area"
              rows={4}
              readOnly
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="close-button" onClick={handleClose}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;