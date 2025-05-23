import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegCommentDots, FaTimes } from 'react-icons/fa';

interface Feedback {
  id: number;
  name: string;
  title: string;
  message: string;
  date: string;
}

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3001/feedback')
      .then((res) => setFeedback(res.data))
      .catch(() => alert('Failed to fetch feedback.'));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">View Feedback</h1>
      <div className="overflow-x-auto bg-white shadow border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Feedback Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">"{item.title}"</td>
                <td className="px-4 py-3">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td
                  className="px-4 py-3 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => {
                    setSelectedFeedback(item);
                    setShowModal(true);
                  }}
                >
                  View Feedback
                </td>
              </tr>
            ))}
            {feedback.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No feedback available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 rounded-t-lg">
              <div className="flex items-center gap-2">
                <FaRegCommentDots />
                <h2 className="text-base font-medium">View Feedback</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-red-300 text-lg"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                    {selectedFeedback.name[0]}
                  </div>
                  <div className="font-semibold text-sm text-gray-800">{selectedFeedback.name}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(selectedFeedback.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedFeedback.message}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
