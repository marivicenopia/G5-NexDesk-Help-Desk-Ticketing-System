import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/constant';
import { API_CONFIG } from '../../../config/api';
import { AuthService } from '../../../services/auth/AuthService';

interface Category {
  categoryId: string;
  name: string;
}

const AddArticle = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    title: '',
    categoryId: '',
    content: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_CATEGORIES}`);
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const article = {
      title: formData.title,
      category: formData.categoryId,
      author: formData.author,
      content: formData.content,
    };

    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_ADD_ARTICLE}`,
        article,
        {
          withCredentials: true,
          headers: {
            ...AuthService.getAuthHeader()
          }
        }
      );
      alert('Article added successfully!');

      // Navigate based on user role
      const userRole = AuthService.getRole();
      if (userRole === 'agent') {
        navigate(PATHS.AGENT.KNOWLEDGEBASE.path);
      } else {
        navigate(PATHS.ADMIN.KNOWLEDGEBASE.path);
      }
    } catch (error: any) {
      console.error('Failed to submit article', error);

      // Show detailed validation errors if available
      if (error.response?.data?.data && Array.isArray(error.response.data.data)) {
        const errorMessages = error.response.data.data.join('\n');
        alert(`Validation Errors:\n${errorMessages}`);
      } else {
        alert(error.response?.data?.message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Add Article</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto space-y-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-sm mb-1">Author Name</label>
            <input
              type="text"
              name="author"
              placeholder="Please Enter Name"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1">Article Title</label>
            <input
              type="text"
              name="title"
              placeholder="Please Enter Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-sm mb-1">Category Type</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-sm mb-1">
            Write Your Article
            <span className="text-xs text-gray-500 font-normal ml-2">(minimum 50 characters)</span>
          </label>
          <textarea
            name="content"
            rows={6}
            placeholder="Start writing your article here... (minimum 50 characters required)"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            Characters: {formData.content.length}/50 minimum
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <button
            type="button"
            onClick={() => {
              const userRole = AuthService.getRole();
              if (userRole === 'agent') {
                navigate(PATHS.AGENT.KNOWLEDGEBASE.path);
              } else {
                navigate(PATHS.ADMIN.KNOWLEDGEBASE.path);
              }
            }}
            className="bg-gray-600 text-white font-bold px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Knowledge Base
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({
                author: '',
                title: '',
                categoryId: '',
                content: '',
              })}
              className="bg-orange-600 text-white font-bold px-6 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white font-bold px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;
