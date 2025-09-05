import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";
import { AuthService } from "../../../../services/auth/AuthService";

interface CreateTicketForm {
    title: string;
    description: string;
    priority: string;
    department: string;
}

const UserCreateTicket: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateTicketForm>({
        title: "",
        description: "",
        priority: "medium",
        department: "IT Support"
    });

    const [errors, setErrors] = useState<Partial<CreateTicketForm>>({});

    const departments = [
        "IT Support",
        "Software Support",
        "Hardware Support",
        "Network Operations",
        "Email Support",
        "Human Resources",
        "Facility Management",
        "Security",
        "Repair and Maintenance",
    ];

    const priorities = [
        { value: "low", label: "Low", color: "text-blue-600" },
        { value: "medium", label: "Medium", color: "text-orange-600" },
        { value: "high", label: "High", color: "text-red-600" },
        { value: "urgent", label: "Urgent", color: "text-red-700" },
        { value: "critical", label: "Critical", color: "text-red-800" }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof CreateTicketForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateTicketForm> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Get current user email from AuthService
            const userEmail = AuthService.getUserEmail();
            if (!userEmail) {
                console.error('No user email found');
                alert('Authentication error. Please log in again.');
                return;
            }

            const ticketData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                department: formData.department,
                submittedBy: userEmail,
                submittedDate: new Date().toISOString(),
                status: "open"
            };

            const response = await fetch('http://localhost:3001/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData),
            });

            if (response.ok) {
                // Success - redirect to tickets page
                navigate(PATHS.USER.MY_TICKETS.path);
            } else {
                console.error('Failed to create ticket');
                alert('Failed to create ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Error creating ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Ticket</h2>
                <p className="text-gray-600">Submit a new support request and we'll get back to you as soon as possible.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Brief description of your issue"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Department and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {priorities.map((priority) => (
                                <option key={priority.value} value={priority.value}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Higher priority tickets are handled first
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        Minimum 10 characters required. Be as specific as possible to help us resolve your issue quickly.
                    </p>
                </div>

                {/* Priority Guidelines */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Priority Guidelines</h3>
                    <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High
                            </span>
                            <span className="text-sm text-gray-600">Critical issues that block your work or affect multiple users</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Medium
                            </span>
                            <span className="text-sm text-gray-600">Important issues that impact functionality but have workarounds</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Low
                            </span>
                            <span className="text-sm text-gray-600">Minor issues, questions, or feature requests</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.USER.MY_TICKETS.path)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Ticket'
                        )}
                    </button>
                </div>
            </form>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Need help before submitting?</h3>
                        <p className="text-sm text-blue-800 mb-2">
                            Check our knowledge base first - you might find an immediate solution to your issue.
                        </p>
                        <button
                            onClick={() => navigate(PATHS.USER.KNOWLEDGEBASE.path)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Browse Knowledge Base →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCreateTicket;
