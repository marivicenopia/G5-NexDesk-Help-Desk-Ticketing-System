
import React, { useState, type JSX } from 'react';
import { ticketService } from './services/ticketService';
import type { CreateTicketData } from './services/ticketService';

function CreateTicket(): JSX.Element {
  const [formData, setFormData] = useState<CreateTicketData>({
    customerName: '',
    customerEmail: '',
    ticketCategory: '',
    priorityStatus: '',
    contactNumber: '',
    description: '' 
  });
  
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      
      const ticketDataWithAttachment: CreateTicketData = {
        ...formData,
        attachment: attachment || undefined
      };
      
      // Submit to the server
      await ticketService.createTicket(ticketDataWithAttachment);
      
      
      setFormData({
        customerName: '',
        customerEmail: '',
        ticketCategory: '',
        priorityStatus: '',
        contactNumber: '',
        description: ''
      });
      setAttachment(null);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000); 
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 bg-[#f8f9fa] flex-1">
      <h1 className="text-2xl font-medium mb-5 text-[#333]">Create Ticket</h1>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-5 flex justify-between items-center">
          <span>Ticket submitted successfully!</span>
          <button onClick={() => setSubmitSuccess(false)} className="text-green-700 font-bold">×</button>
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5 flex justify-between items-center">
          <span>Error: {submitError}</span>
          <button onClick={() => setSubmitError(null)} className="text-red-700 font-bold">×</button>
        </div>
      )}
      
      <div className="bg-white p-5 rounded shadow-sm mb-5">
        <h2 className="text-lg font-medium mb-1 text-[#333]">New Ticket</h2>
        <p className="text-[#666] text-sm">Provide a clear and concise summary of the issue or request</p>
      </div>
      
      <div className="bg-white p-5 rounded shadow-sm">
        <h3 className="text-base font-medium mb-5 text-[#333]">Ticket Details:</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="mb-4">
              <label className="block mb-1 text-sm text-[#555]">Customer Name</label>
              <input
                type="text"
                name="customerName"
                placeholder="Enter Full Name"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] placeholder-[#efeaea]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-[#555]">Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                placeholder="Enter Email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] placeholder-[#efeaea]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-[#555]">Ticket Category Type</label>
              <select 
                name="ticketCategory"
                value={formData.ticketCategory}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] appearance-none pr-8"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6'%3E%3Cpath d='M0 0l6 6 6-6z' fill='%23fff'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center"
                }}
              >
                <option value="">Choose Category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-[#555]">Priority Status</label>
              <select
                name="priorityStatus"
                value={formData.priorityStatus}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] appearance-none pr-8"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6'%3E%3Cpath d='M0 0l6 6 6-6z' fill='%23fff'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center"
                }}
              >
                <option value="">Choose Priority Status</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm text-[#555]">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] placeholder-[#efeaea]"
              />
            </div>
          </div>
          
          <div className="mb-4 col-span-3">
            <label className="block mb-1 text-sm text-[#555]">Ticket Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded bg-[#807e7e] text-white border border-[#ddd] min-h-[150px] resize-y placeholder-[#efeaea]"
            />
          </div>
          
          <div className="flex justify-between items-center mt-5">
            <div className="flex items-center">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <span className="text-[#3366cc] cursor-pointer">
                  📎 Attach Files/Image
                </span>
              </label>
              {attachment && <span className="ml-2 text-sm">{attachment.name}</span>}
            </div>
            
            <button 
              type="submit" 
              className="bg-[#172340] hover:bg-[#233152] text-white font-bold py-2 px-6 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;