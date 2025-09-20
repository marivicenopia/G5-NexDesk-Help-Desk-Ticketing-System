import React, { useState } from 'react';
import { AuthService } from '../../../services/auth/AuthService';

interface Ticket {
    id: string | number;
    title: string;
    status: string;
    priority: string;
    submittedBy: string;
}

interface ResolveTicketModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
    onResolve: (ticketId: string | number, resolutionData: {
        resolutionDescription: string;
        agentFeedback: string;
        resolvedBy: string;
        resolvedDate: string;
    }) => void;
}

const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({
    ticket,
    isOpen,
    onClose,
    onResolve
}) => {
    const [resolutionDescription, setResolutionDescription] = useState('');
    const [agentFeedback, setAgentFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticket) return;

        if (!resolutionDescription.trim() || !agentFeedback.trim()) {
            alert('Please fill in both resolution description and agent feedback');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current agent info
            const agentId = AuthService.getToken();
            if (!agentId) {
                alert('Unable to identify current agent');
                return;
            }

            const agentResponse = await fetch(`http://localhost:3001/users/${agentId}`);
            const agentData = await agentResponse.json();

            const resolutionData = {
                resolutionDescription: resolutionDescription.trim(),
                agentFeedback: agentFeedback.trim(),
                resolvedBy: agentData.email || agentData.name || 'Unknown Agent',
                resolvedDate: new Date().toISOString()
            };

            await onResolve(ticket.id, resolutionData);

            // Reset form
            setResolutionDescription('');
            setAgentFeedback('');
            onClose();
        } catch (error) {
            console.error('Error resolving ticket:', error);
            alert('Failed to resolve ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setResolutionDescription('');
        setAgentFeedback('');
        onClose();
    };

    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Resolve Ticket</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Ticket #{ticket.id} - {ticket.title}
                    </p>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Ticket Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">Status:</span>
                                <span className="ml-2 capitalize">{ticket.status}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Priority:</span>
                                <span className="ml-2 capitalize">{ticket.priority}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="font-medium text-gray-600">Customer:</span>
                                <span className="ml-2">{ticket.submittedBy}</span>
                            </div>
                        </div>
                    </div>

                    {/* Resolution Description */}
                    <div className="mb-6">
                        <label htmlFor="resolutionDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Resolution Description *
                        </label>
                        <textarea
                            id="resolutionDescription"
                            value={resolutionDescription}
                            onChange={(e) => setResolutionDescription(e.target.value)}
                            placeholder="Describe how the issue was resolved..."
                            rows={4}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This will be visible to the customer when they view the ticket
                        </p>
                    </div>

                    {/* Agent Feedback */}
                    <div className="mb-6">
                        <label htmlFor="agentFeedback" className="block text-sm font-medium text-gray-700 mb-2">
                            Agent Feedback *
                        </label>
                        <textarea
                            id="agentFeedback"
                            value={agentFeedback}
                            onChange={(e) => setAgentFeedback(e.target.value)}
                            placeholder="Add any internal notes or feedback about this resolution..."
                            rows={3}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This will also be visible to the customer
                        </p>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Important:</strong> Once resolved, this ticket will be marked as resolved and the customer will be notified. Make sure your resolution description is complete and accurate.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors flex items-center"
                        >
                            {isSubmitting && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            )}
                            {isSubmitting ? 'Resolving...' : 'Resolve Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResolveTicketModal;
