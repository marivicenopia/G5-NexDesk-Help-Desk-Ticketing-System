import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthService } from '../../../services/auth/AuthService';
import { API_CONFIG } from '../../../config/api';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  department: string;
  submittedBy: string;
  submittedDate: string;
  status: string;
  assignedTo?: string;
}

const CreateFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
    experience: '',
    date: new Date().toISOString().split('T')[0],
    ticketId: '', // Add ticket association
  });
  const [loading, setLoading] = useState(true);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  // Fetch current user data and resolved tickets when component mounts
  useEffect(() => {
    const fetchUserDataAndTickets = async () => {
      try {
        const userId = AuthService.getToken(); // Using token as user ID
        if (userId) {
          const response = await axios.get(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS_BY_ID(userId)}`,
            { withCredentials: true }
          );
          const user = response.data;
          setFormData(prev => ({
            ...prev,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
          }));

          // Fetch user's resolved/closed tickets
          const ticketsResponse = await axios.get(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TICKETS}`,
            { withCredentials: true }
          );
          const allTickets = ticketsResponse.data;

          // Filter tickets submitted by the user that are resolved or closed
          const userResolvedTickets = allTickets.filter((ticket: Ticket) =>
            ticket.submittedBy === user.email &&
            (ticket.status === 'resolved' || ticket.status === 'closed')
          );

          setResolvedTickets(userResolvedTickets);
        }
      } catch (error) {
        console.error('Failed to fetch user data or tickets:', error);
      } finally {
        setLoading(false);
        setTicketsLoading(false);
      }
    };

    fetchUserDataAndTickets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExperienceClick = (emoji: string) => {
    setFormData({ ...formData, experience: emoji });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ticketId) {
      alert('Please select a ticket to provide feedback for.');
      return;
    }

    try {
      const feedbackData = {
        ...formData,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2), // Generate unique ID
      };

      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEEDBACK_ADD}`,
        feedbackData,
        { withCredentials: true }
      );
      alert('Feedback submitted successfully!');
      setFormData({
        name: formData.name, // Keep the name from current user
        email: formData.email, // Keep the email from current user
        title: '',
        message: '',
        experience: '',
        date: new Date().toISOString().split('T')[0],
        ticketId: '', // Reset ticket selection
      });
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit feedback.');
    }
  };

  if (loading || ticketsLoading) {
    return (
      <div className="p-10 min-h-screen bg-white">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // If user has no resolved tickets, show a message
  if (resolvedTickets.length === 0) {
    return (
      <div className="p-10 min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Feedback</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">No Tickets Available for Feedback</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You can only submit feedback for tickets that have been resolved or closed.</p>
                <p className="mt-1">Currently, you don't have any resolved or closed tickets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Feedback</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6"
      >
        {/* Display current user info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Submitting feedback as:</h3>
          <p className="text-sm text-blue-700">
            <strong>Name:</strong> {formData.name}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> {formData.email}
          </p>
        </div>

        {/* Ticket Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Select Ticket for Feedback</label>
          <select
            name="ticketId"
            value={formData.ticketId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a resolved ticket...</option>
            {resolvedTickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.id} - {ticket.title} ({ticket.status})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            You can only provide feedback for tickets that have been resolved or closed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Feedback Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Please Enter Title"
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">How was your experience?</label>
          <div className="flex gap-3 text-xl">
            {['😡', '😞', '😐', '😊', '😍'].map((emoji) => (
              <button
                type="button"
                key={emoji}
                className={`hover:scale-110 transition ${formData.experience === emoji ? 'ring-2 ring-blue-500 rounded' : ''
                  }`}
                onClick={() => handleExperienceClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Tell Us What You Think
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Suggest anything that we can improve."
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 font-semibold rounded transition-colors"
          >
            Send Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeedback;
