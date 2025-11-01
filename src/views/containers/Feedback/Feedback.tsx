import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaRegCommentDots, FaTimes } from 'react-icons/fa';

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
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

const ViewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isAdminRoute = location.pathname.includes('/admin/');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbackRes, ticketsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:3001/feedback'),
        axios.get('http://localhost:3001/tickets'),
        axios.get('http://localhost:3001/users')
      ]);

      setFeedback(feedbackRes.data);
      setTickets(ticketsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data.');
    }
  };

  const getTicketInfo = (ticketId?: string) => {
    if (!ticketId) return { title: 'N/A', assignedAgent: 'N/A' };

    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return { title: 'Unknown Ticket', assignedAgent: 'N/A' };

    const agent = users.find(u => u.email === ticket.assignedTo);
    const assignedAgent = agent ? `${agent.firstname} ${agent.lastname}` : 'Unassigned';

    return { title: ticket.title, assignedAgent };
  };

  const handleViewFeedback = (feedbackItem: Feedback) => {
    const basePath = isAdminRoute ? '/admin' : '/agent';
    navigate(`${basePath}/feedback/view/${feedbackItem.id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#031849] mb-1">Feedback Management</h1>
        <p className="text-gray-600">Review and manage customer feedback</p>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {feedback.length === 0 ? (
          <div className="text-center py-12">
            <FaRegCommentDots className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600">Customer feedback will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Related Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedback.map((item) => {
                  const ticketInfo = getTicketInfo(item.ticketId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{item.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticketInfo.title}
                        {item.ticketId && (
                          <div className="text-xs text-gray-400">ID: {item.ticketId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticketInfo.assignedAgent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewFeedback(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/20 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <FaRegCommentDots className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Feedback Details</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center">
                  {selectedFeedback.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFeedback.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedFeedback.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {selectedFeedback.ticketId && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Related Ticket</h4>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {selectedFeedback.ticketId}
                    </span>
                  </div>
                )}

                <h4 className="text-sm font-medium text-gray-900 mb-2">Subject</h4>
                <p className="text-sm text-gray-700 mb-4">{selectedFeedback.title}</p>

                <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
