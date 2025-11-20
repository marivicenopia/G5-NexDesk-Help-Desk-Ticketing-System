import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { API_CONFIG } from '../../../config/api';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  status: string;
  categoryId: string;
  categoryName: string;
}

const ViewArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminRoute = location.pathname.includes('/admin/');
  const basePath = isAdminRoute ? '/admin' : '/agent';

  useEffect(() => {
    if (id) {
      axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_ARTICLE(id)}`)
        .then((res) => setArticle(res.data))
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    } else {
      setArticle(null);
      setLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(`${basePath}/knowledgebase`);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-lg">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg mb-4">Article not found.</div>
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mx-auto"
        >
          <FaArrowLeft className="mr-2" />
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-white">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Knowledge Base
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">{article.title}</h1>

      {article.author && (
        <div className="text-sm text-gray-500 mb-4">Author: {article.author}</div>
      )}

      <div className="prose max-w-4xl text-gray-700 text-base leading-relaxed whitespace-pre-line">
        {article.content || "No content available for this article."}
      </div>

    </div>
  );
};

export default ViewArticle;
