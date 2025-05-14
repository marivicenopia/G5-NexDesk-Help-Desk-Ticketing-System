import React, { useState } from 'react';
import './CreateTicket.css';

interface TicketFormData {
  customerName: string;
  customerEmail: string;
  ticketCategory: string;
  priorityStatus: string;
  contactNumber: string;
  description: string;
}

const CreateTicket: React.FC = () => {
  const [formData, setFormData] = useState<TicketFormData>({
    customerName: '',
    customerEmail: '',
    ticketCategory: '',
    priorityStatus: '',
    contactNumber: '',
    description: ''
  });
  
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Attachment:', attachment);
    alert('Ticket submitted successfully!');
  };

  return (
    <div className="ticket-content">
      <h1 className="page-title">Create Ticket</h1>
      
      <div className="ticket-box new-ticket">
        <h2>New Ticket</h2>
        <p>Provide a clear and concise summary of the issue or request</p>
      </div>
      
      <div className="ticket-box ticket-form">
        <h3>Ticket Details:</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                placeholder="Enter Full Name"
                value={formData.customerName}
                onChange={handleInputChange}
                className="dark-input"
              />
            </div>
            
            <div className="form-group">
              <label>Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                placeholder="Enter Email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="dark-input"
              />
            </div>
            
            <div className="form-group">
              <label>Ticket Category Type</label>
              <select 
                name="ticketCategory"
                value={formData.ticketCategory}
                onChange={handleInputChange}
                className="dark-select"
              >
                <option value="">Choose Category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Priority Status</label>
              <select
                name="priorityStatus"
                value={formData.priorityStatus}
                onChange={handleInputChange}
                className="dark-select"
              >
                <option value="">Choose Priority Status</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="dark-input"
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Ticket Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleInputChange}
              className="dark-textarea"
            />
          </div>
          
          <div className="form-actions">
            <div className="file-upload">
              <label>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }}
                />
                <span className="attachment-link">
                  📎 Attach Files/Image
                </span>
              </label>
              {attachment && <span className="file-name">{attachment.name}</span>}
            </div>
            
            <button type="submit" className="submit-btn">SUBMIT</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;