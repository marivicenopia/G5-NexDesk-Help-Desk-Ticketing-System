import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PATHS } from '../../../routes/constant';
import { API_CONFIG } from '../../../config/api';

interface Category {
  categoryId: string;
  name: string;
}

const EditArticle = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_ARTICLE(id!)}`);
        setFormData({
          author: res.data.author || '',
          title: res.data.title || '',
          categoryId: res.data.categoryId || '',
          content: res.data.content || '',
        });
      } catch (err) {
        console.error('Failed to fetch article');
        alert('Article not found.');
        navigate(PATHS.ADMIN.KNOWLEDGEBASE.path);
      }
    };

    if (id) fetchArticle();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: Update endpoint not yet implemented in C# backend
      // For now, this will show an error
      alert('Update functionality is not yet available. Please delete and recreate the article.');
      navigate(PATHS.ADMIN.KNOWLEDGEBASE.path);
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update the article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Edit Article</h2>

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
              placeholder="Enter author name"
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
              placeholder="Enter article title"
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
          <label className="block font-semibold text-sm mb-1">Edit Your Article</label>
          <textarea
            name="content"
            rows={6}
            placeholder="Edit your article here..."
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white font-bold px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'UPDATING...' : 'UPDATE'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
