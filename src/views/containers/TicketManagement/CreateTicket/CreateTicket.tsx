import React, { useState } from 'react';

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
        description: '',
    });

    const [attachment, setAttachment] = useState<File | null>(null);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        console.log('Attachment:', attachment);
        alert('Ticket submitted successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-black mb-4">Create Ticket</h1>

            <div className="bg-white p-6 rounded-xl shadow-md text-black mb-6">
                <h2 className="text-xl font-semibold mb-1">New Ticket</h2>
                <p className="text-sm text-gray-600">
                    Provide a clear and concise summary of the issue or request.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md text-black"
            >
                <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Full Name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Customer Email</label>
                        <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Ticket Category</label>
                        <select
                            name="ticketCategory"
                            value={formData.ticketCategory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Choose Category</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                            <option value="general">General Inquiry</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Priority Status</label>
                        <select
                            name="priorityStatus"
                            value={formData.priorityStatus}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Choose Priority Status</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1">Contact Number</label>
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Contact Number"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1">Ticket Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Describe the issue in detail..."
                            rows={4}
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative">
                        <label className="cursor-pointer text-blue-600 hover:underline">
                            📎 Attach File
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {attachment && (
                            <div className="text-sm text-gray-600 mt-1">
                                Selected: {attachment.name}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold text-white transition"
                    >
                        SUBMIT
                    </button>
                </div>
            </form>
        </div>

    );
};

export default CreateTicket;
