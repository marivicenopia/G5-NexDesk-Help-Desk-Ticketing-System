import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";
import { AuthService } from "../../../../services/auth/AuthService";
import type { TicketAttachment } from "../../../../types/ticket";

interface CreateTicketForm {
    title: string;
    description: string;
    priority: string;
    category: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

const UserCreateTicket: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [formData, setFormData] = useState<CreateTicketForm>({
        title: "",
        description: "",
        priority: "medium",
        category: "Technical Issues",
        customerName: "",
        customerEmail: "",
        customerPhone: ""
    });

    const [errors, setErrors] = useState<Partial<CreateTicketForm>>({});

    // File attachment utilities
    const allowedFileTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
        if (!allowedFileTypes.includes(file.type)) {
            return 'File type not allowed. Please upload images, PDFs, or documents only.';
        }
        if (file.size > maxFileSize) {
            return `File size too large. Maximum size is ${formatFileSize(maxFileSize)}.`;
        }
        return null;
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles: File[] = [];
        const errors: string[] = [];

        Array.from(files).forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else if (attachments.length + newFiles.length < maxFiles) {
                // Check for duplicate files
                const isDuplicate = attachments.some(existing =>
                    existing.name === file.name && existing.size === file.size
                ) || newFiles.some(existing =>
                    existing.name === file.name && existing.size === file.size
                );

                if (!isDuplicate) {
                    newFiles.push(file);
                } else {
                    errors.push(`${file.name}: File already attached`);
                }
            } else {
                errors.push(`${file.name}: Maximum ${maxFiles} files allowed`);
            }
        });

        if (errors.length > 0) {
            alert('Some files could not be attached:\n' + errors.join('\n'));
        }

        if (newFiles.length > 0) {
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const categories = [
        "Technical Issues",
        "Billing and Payments",
        "Product Inquiries",
        "Complaints and Feedback",
        "Account Management",
        "Policy Questions"
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

            // Map UI data to backend CreateTicketDto (C# expects PascalCase/enums)
            const toPascal = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
            // Strictly match CreateTicketDto (extra fields removed to avoid unexpected server handling)
            const createDto = {
                title: formData.title,
                description: formData.description,
                priority: toPascal(formData.priority), // Ensure casing aligns with backend expectations
                department: formData.department || 'General',
                submittedBy: userEmail,
                assignedTo: '' // Backend column is NOT NULL, send empty string if unassigned
            };

            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(createDto),
            });

                if (!response.ok) {
                const rawText = await response.text().catch(() => '');
                console.warn('Ticket create failed. Status:', response.status, 'Body:', rawText);
                try {
                    const ct = response.headers.get('content-type') || '';
                    if (ct.includes('application/json')) {
                        // We already consumed text; parse again only if available
                        let errJson: any = {};
                        try { errJson = rawText ? JSON.parse(rawText) : {}; } catch {}
                                                const combinedMessage = [errJson?.message, errJson?.error, errJson?.innerException]
                                                    .filter(Boolean)
                                                    .join(' - ');
                        throw new Error(combinedMessage || 'An error occurred while creating the ticket.');
                    } else {
                        throw new Error(rawText || 'An error occurred while creating the ticket.');
                    }
                } catch (e: any) {
                    throw new Error(e?.message || 'An error occurred while creating the ticket.');
                }
            }

            // Success - redirect to tickets page
            navigate(PATHS.USER.MY_TICKETS.path);
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert(error instanceof Error ? error.message : 'Error creating ticket. Please try again.');
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

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
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

                {/* Customer Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                value={formData.customerName || ''}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="customerEmail"
                                name="customerEmail"
                                value={formData.customerEmail || ''}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="customerPhone"
                                name="customerPhone"
                                value={formData.customerPhone || ''}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* File Attachments */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">File Attachments</h3>

                    {/* File Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                            ${isDragOver
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                            }`}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={triggerFileInput}
                    >
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="mt-4">
                            <p className="text-lg font-medium text-gray-900">
                                Drop files here or click to upload
                            </p>
                            <p className="text-sm text-gray-500">
                                Images, PDFs, and documents up to {formatFileSize(maxFileSize)} each (max {maxFiles} files)
                            </p>
                        </div>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={allowedFileTypes.join(',')}
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                    />

                    {/* Attached Files List */}
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Attached Files ({attachments.length}/{maxFiles})</h4>
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {file.type.startsWith('image/') ? (
                                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="flex-shrink-0 p-1 text-red-600 hover:text-red-800"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        <p><strong>Supported file types:</strong> Images (JPEG, PNG, GIF, WebP), Documents (PDF, DOC, DOCX), Spreadsheets (XLS, XLSX), Text files</p>
                        <p><strong>Maximum file size:</strong> {formatFileSize(maxFileSize)} per file</p>
                        <p><strong>Maximum files:</strong> {maxFiles} files total</p>
                    </div>
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
