import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ticket, PriorityOption } from '../../../../types/ticket';

interface TicketFormData {
    customerName: string;
    customerEmail: string;
    title: string;
    category: string;
    priority: PriorityOption | '';
    contactNumber: string;
    description: string;
    department: string;
}

const CreateTicket: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TicketFormData>({
        customerName: '',
        customerEmail: '',
        title: '',
        category: '',
        priority: '',
        contactNumber: '',
        description: '',
        department: '',
    });

    const [attachment, setAttachment] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.customerName || !formData.customerEmail || !formData.title ||
            !formData.category || !formData.priority || !formData.description) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            // Create the ticket object
            const newTicket: Partial<Ticket> = {
                id: Date.now().toString(), // Simple ID generation
                title: formData.title,
                description: formData.description,
                priority: formData.priority as PriorityOption,
                department: formData.department || 'General',
                submittedBy: formData.customerEmail,
                submittedDate: new Date(),
                status: 'open',
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                contactNumber: formData.contactNumber,
                category: formData.category,
            };

            // Submit to API
            const response = await fetch('http://localhost:3001/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTicket),
            });

            if (!response.ok) {
                throw new Error('Failed to create ticket');
            }

            // Success
            alert('Ticket submitted successfully!');

            // Reset form
            setFormData({
                customerName: '',
                customerEmail: '',
                title: '',
                category: '',
                priority: '',
                contactNumber: '',
                description: '',
                department: '',
            });
            setAttachment(null);

            // Navigate to tickets list
            navigate('/admin/tickets');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#031849] mb-4">Create Ticket</h1>

            <div className="bg-white p-6 rounded-xl shadow-md text-black mb-6">
                <h2 className="text-xl font-semibold mb-1">New Ticket</h2>
                <p className="text-sm text-gray-600">
                    Provide a clear and concise summary of the issue or request.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md text-black"
            >
                <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Customer Name *</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter Full Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Customer Email *</label>
                        <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Ticket Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter ticket title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Choose Category</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Support</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Priority *</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Choose Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Choose Department</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Operations">Operations</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter Contact Number"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Ticket Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the issue in detail..."
                            rows={4}
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative">
                        <label className="cursor-pointer text-blue-600 hover:underline flex items-center gap-2">
                            📎 Attach File
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            />
                        </label>
                        {attachment && (
                            <div className="text-sm text-gray-600 mt-1">
                                Selected: {attachment.name}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/tickets')}
                            className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-md font-semibold text-white transition"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-2 rounded-md font-semibold text-white transition"
                        >
                            {loading ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateTicket;
