// EditTicket.tsx - Clean version without debug info
import React, { useState, useRef, useEffect, type JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ticketService } from './services/ticketService';
import type { Ticket, CreateTicketData } from './services/ticketService';

interface FormTicket {
  customerName: string;
  customerEmail: string;
  ticketCategory: string;
  priorityStatus: string;
  contactNumber: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  attachment?: File;
}

// Static options based on common ticketing systems
const CATEGORIES = [
  'Software',
  'Hardware', 
  'Network',
  'Security',
  'Database',
  'Other'
];

const PRIORITIES = [
  'Critical',
  'High',
  'Medium', 
  'Low'
];

const STATUS_OPTIONS: Array<'open' | 'in-progress' | 'resolved' | 'closed'> = [
  'open',
  'in-progress', 
  'resolved',
  'closed'
];

function EditTicket(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketId = location.state?.ticketId;
  
  const [ticket, setTicket] = useState<FormTicket>({
    customerName: '',
    customerEmail: '',
    ticketCategory: '',
    priorityStatus: '',
    contactNumber: '',
    description: '',
    status: 'open'
  });
  
  const [originalTicket, setOriginalTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError('No ticket ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const ticketData = await ticketService.getTicketById(ticketId);
        
        if (ticketData) {
          setOriginalTicket(ticketData);
          setTicket({
            customerName: ticketData.customerName || '',
            customerEmail: ticketData.customerEmail || '',
            ticketCategory: ticketData.ticketCategory || '',
            priorityStatus: ticketData.priorityStatus || '',
            contactNumber: ticketData.contactNumber || '',
            description: ticketData.description || '',
            status: ticketData.status || 'open'
          });
        } else {
          setError('Ticket not found');
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket data');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      setTicket(prev => ({
        ...prev,
        attachment: file
      }));
      
      setAttachmentName(file.name);
    }
  };

  const removeAttachment = () => {
    setTicket(prev => {
      const { attachment, ...rest } = prev;
      return rest;
    });
    setAttachmentName('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalTicket) {
      setError('No original ticket data found');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Create updated ticket data - include status field
      const updatedTicketData: Partial<CreateTicketData> & { status?: string } = {
        customerName: ticket.customerName,
        customerEmail: ticket.customerEmail,
        ticketCategory: ticket.ticketCategory,
        priorityStatus: ticket.priorityStatus,
        contactNumber: ticket.contactNumber,
        description: ticket.description,
        attachment: ticket.attachment,
        status: ticket.status
      };
      
      // Update the ticket
      await ticketService.updateTicket(ticketId, updatedTicketData);
      
      alert('Ticket updated successfully!');
      navigate(-1); // Go back to previous page
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-5 bg-white w-full h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Edit Ticket</h1>
        <div className="text-center">Loading ticket data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-white w-full h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Edit Ticket</h1>
        <div className="text-red-500 text-center">Error: {error}</div>
        <div className="text-center mt-4">
          <button 
            onClick={handleClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!originalTicket) {
    return (
      <div className="p-5 bg-white w-full h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Edit Ticket</h1>
        <div className="text-center">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white w-full h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Edit Ticket</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border relative">
        <div className="inline-block bg-red-500 text-white px-3 py-1.5 rounded font-medium text-sm mb-5">
          Ticket ID {originalTicket.id}
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* First Row */}
          <div className="flex gap-5 mb-5 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="customerName" className="block mb-1.5 font-medium text-sm text-[#333]">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={ticket.customerName}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="customerEmail" className="block mb-1.5 font-medium text-sm text-[#333]">
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={ticket.customerEmail}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="ticketCategory" className="block mb-1.5 font-medium text-sm text-[#333]">
                Ticket Category Type
              </label>
              <select
                id="ticketCategory"
                name="ticketCategory"
                value={ticket.ticketCategory}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Second Row */}
          <div className="flex gap-5 mb-5 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="priorityStatus" className="block mb-1.5 font-medium text-sm text-[#333]">
                Priority Status
              </label>
              <select
                id="priorityStatus"
                name="priorityStatus"
                value={ticket.priorityStatus}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Priority</option>
                {PRIORITIES.map((priority, index) => (
                  <option key={index} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="contactNumber" className="block mb-1.5 font-medium text-sm text-[#333]">
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={ticket.contactNumber}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label htmlFor="status" className="block mb-1.5 font-medium text-sm text-[#333]">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={ticket.status}
                onChange={handleInputChange}
                className="w-full bg-white text-black border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map((status, index) => (
                  <option key={index} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Description Field */}
          <div className="mb-5">
            <label htmlFor="description" className="block mb-1.5 font-medium text-sm text-[#333]">
              Ticket Description
            </label>
            <textarea
              id="description"
              name="description"
              value={ticket.description}
              onChange={handleInputChange}
              className="w-full bg-gray-100 text-black border border-gray-300 rounded px-3 py-2.5 text-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>
          
          {/* Attachment Section */}
          <div className="my-5">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden"
            />
            <button 
              type="button" 
              className="flex items-center px-3 py-2 bg-transparent border-none text-[#333] cursor-pointer text-sm hover:text-blue-600 transition-colors"
              onClick={handleFileClick}
            >
              <span className="mr-1">📎</span>
              <span>Attach File/Image</span>
            </button>
            
            {/* Show existing attachment if any */}
            {originalTicket.attachmentUrl && !attachmentName && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-[#333] mb-2">Current Attachment:</h4>
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded text-sm">
                  <span className="text-[#333]">📎 {originalTicket.attachmentUrl}</span>
                  <span className="text-xs text-gray-500">(existing)</span>
                </div>
              </div>
            )}
            
            {/* Show new attachment if uploaded */}
            {attachmentName && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-[#333] mb-2">New Attachment:</h4>
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                  <span className="text-[#333]">📎 {attachmentName}</span>
                  <button 
                    type="button" 
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                    onClick={removeAttachment}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              className="px-6 py-2 bg-gray-500 text-white rounded font-medium cursor-pointer uppercase text-sm hover:bg-gray-600 transition-colors"
              onClick={handleClose}
              disabled={saving}
            >
              CLOSE
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#0a2558] text-white rounded font-medium cursor-pointer uppercase text-sm hover:bg-[#0a2558]/90 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'SAVING...' : 'DONE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTicket;