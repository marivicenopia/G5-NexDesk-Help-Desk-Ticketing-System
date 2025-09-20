import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaRegCommentDots, FaArrowLeft } from 'react-icons/fa';

interface Feedback {
    id: number;
    name: string;
    title: string;
    message: string;
    date: string;
    ticketId?: string;
}

interface Ticket {
    id: string;
    title: string;
    assignedTo?: string;
    status: string;
    priority: string;
}

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

const ViewFeedbackDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { feedbackId } = useParams();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [agent, setAgent] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdminRoute = location.pathname.includes('/admin/');

    useEffect(() => {
        fetchFeedbackDetails();
    }, [feedbackId]);

    const fetchFeedbackDetails = async () => {
        try {
            const feedbackRes = await axios.get(`http://localhost:3001/feedback/${feedbackId}`);
            const feedbackData = feedbackRes.data;
            setFeedback(feedbackData);

            // If feedback has a ticket ID, fetch ticket and agent details
            if (feedbackData.ticketId) {
                const [ticketRes, usersRes] = await Promise.all([
                    axios.get(`http://localhost:3001/tickets/${feedbackData.ticketId}`),
                    axios.get('http://localhost:3001/users')
                ]);

                const ticketData = ticketRes.data;
                setTicket(ticketData);

                // Find the assigned agent
                if (ticketData.assignedTo) {
                    const assignedAgent = usersRes.data.find((user: User) => user.email === ticketData.assignedTo);
                    setAgent(assignedAgent || null);
                }
            }
        } catch (error) {
            console.error('Error fetching feedback details:', error);
            alert('Failed to load feedback details');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        const basePath = isAdminRoute ? '/admin' : '/agent';
        navigate(`${basePath}/feedback`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">Feedback not found</p>
                <button
                    onClick={handleGoBack}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    ← Back to Feedback List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Feedback List
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Details</h1>
            </div>

            {/* Feedback Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white px-6 py-4">
                    <div className="flex items-center">
                        <FaRegCommentDots className="w-6 h-6 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold">{feedback.title}</h2>
                            <p className="text-blue-100">From: {feedback.name}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Feedback Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Feedback Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                                    <p className="text-gray-900">{feedback.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <p className="text-gray-900">{feedback.title}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date Submitted</label>
                                    <p className="text-gray-900">{new Date(feedback.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Related Ticket</h3>
                            {ticket ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ticket ID</label>
                                        <p className="text-gray-900">{ticket.id}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ticket Title</label>
                                        <p className="text-gray-900">{ticket.title}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.priority === 'urgent' || ticket.priority === 'critical'
                                                ? 'bg-red-100 text-red-800'
                                                : ticket.priority === 'high'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : ticket.priority === 'medium'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Assigned Agent</label>
                                        <p className="text-gray-900">
                                            {agent ? `${agent.firstname} ${agent.lastname}` : 'Unassigned'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No related ticket found</p>
                            )}
                        </div>
                    </div>

                    {/* Feedback Message */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Feedback Message</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900 whitespace-pre-wrap">{feedback.message}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Feedback ID: {feedback.id}
                        </p>
                        <button
                            onClick={handleGoBack}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Back to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedbackDetail;
