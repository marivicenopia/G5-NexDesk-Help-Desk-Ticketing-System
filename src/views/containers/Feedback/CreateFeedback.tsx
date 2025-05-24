import { useState } from 'react';
import axios from 'axios';

const CreateFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
    experience: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExperienceClick = (emoji: string) => {
    setFormData({ ...formData, experience: emoji });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/feedback', formData);
      alert('Feedback submitted successfully!');
      setFormData({
        name: '',
        email: '',
        title: '',
        message: '',
        experience: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit feedback.');
    }
  };

  return (
    <div className="p-10 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Feedback</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Please Enter Name"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Please Enter Email"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Article Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Please Enter Title"
              required
              className="w-full border px-3 py-2 rounded"
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
                className={`hover:scale-110 transition ${
                  formData.experience === emoji ? 'ring-2 ring-blue-500 rounded' : ''
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
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 font-semibold rounded"
          >
            Send Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeedback;
