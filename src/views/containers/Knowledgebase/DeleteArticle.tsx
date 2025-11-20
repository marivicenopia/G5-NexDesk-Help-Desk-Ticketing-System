import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../../routes/constant";
import { API_CONFIG } from "../../../config/api";
import { AuthService } from "../../../services/auth/AuthService";

interface Article {
  id: string;
  title: string;
  status: string;
}

const DeleteArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.includes('/admin/');
  const basePath = isAdminRoute ? '/admin' : '/agent';

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_CATEGORIES}`);
      const allArticles: Article[] = [];
      res.data.forEach((category: any) => {
        category.articles.forEach((article: any) => {
          allArticles.push({
            id: article.id,
            title: article.title,
            status: article.status
          });
        });
      });
      setArticles(allArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      alert('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the article "${title}"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_DELETE_ARTICLE(id)}`, {
        withCredentials: true,
        headers: {
          ...AuthService.getAuthHeader()
        }
      });
      alert("Article deleted successfully.");
      fetchArticles();
    } catch (error: any) {
      console.error('Error deleting article:', error);
      alert(error.response?.data?.message || "Failed to delete article.");
    }
  };

  const handleGoBack = () => {
    navigate(`${basePath}/knowledgebase`);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      <h2 className="text-2xl font-bold mb-6">Delete Article</h2>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-auto rounded shadow border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-t">
                  <td className="px-4 py-3">{article.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${article.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={article.status === 'COMPLETED'}
                      className={`${article.status === 'COMPLETED'
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-800'
                        }`}
                      title={article.status === 'COMPLETED' ? 'Cannot delete completed articles' : 'Delete'}
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeleteArticle;
