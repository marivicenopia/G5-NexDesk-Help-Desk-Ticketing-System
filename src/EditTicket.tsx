import React, { useState, useRef } from 'react';
import './EditTicket.css';

interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  category: string;
  priority: string;
  contactNumber: string;
  description: string;
  attachments: File[];
}

const EditTicket: React.FC = () => {
  // Sample initial data - in a real app, you would fetch this from an API or props
  const [ticket, setTicket] = useState<Ticket>({
    id: '#1004',
    customerName: 'Stephen Curry',
    customerEmail: 'stephcurry30@gmail.com',
    category: 'Software',
    priority: 'High',
    contactNumber: '01123334455',
    description: 'I tried opening my account but I can\'t logged in it says incorrect password/username, but I have never changed my account\'s username or password ever since.',
    attachments: []
  });

  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Update ticket with new attachments
      setTicket(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
      
      // Update attachment names for display
      const fileNames = newFiles.map(file => file.name);
      setAttachmentNames(prev => [...prev, ...fileNames]);
    }
  };

  const removeAttachment = (index: number) => {
    setTicket(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setAttachmentNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated ticket to your backend
    console.log('Updated ticket:', ticket);
    // After successful update, you might want to redirect or show a success message
    alert('Ticket updated successfully!');
  };

  const handleClose = () => {
    // Navigate back or close modal depending on your app's design
    // For example: window.history.back();
    console.log('Close button clicked');
  };

  return (
    <div className="ticket-content">
      <h1 className="page-title">Edit Ticket</h1>
      <div className="ticket-box">
        <div className="ticket-id-badge">Ticket ID {ticket.id}</div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={ticket.customerName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerEmail">Customer Email</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={ticket.customerEmail}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Ticket Category Type</label>
              <select
                id="category"
                name="category"
                value={ticket.category}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority Status</label>
              <select
                id="priority"
                name="priority"
                value={ticket.priority}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={ticket.contactNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Ticket Description</label>
            <textarea
              id="description"
              name="description"
              value={ticket.description}
              onChange={handleInputChange}
              className="form-control description-area"
              rows={4}
            />
          </div>
          
          <div className="attachment-section">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
              multiple
            />
            <button 
              type="button" 
              className="attach-button" 
              onClick={handleFileClick}
            >
              <span>📎 Attach File/Image</span>
            </button>
            
            {attachmentNames.length > 0 && (
              <div className="attachment-list">
                <h4>Attachments:</h4>
                <ul>
                  {attachmentNames.map((name, index) => (
                    <li key={index}>
                      {name}
                      <button 
                        type="button" 
                        className="remove-attachment" 
                        onClick={() => removeAttachment(index)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="close-button" onClick={handleClose}>
              CLOSE
            </button>
            <button type="submit" className="done-button">
              DONE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicket;