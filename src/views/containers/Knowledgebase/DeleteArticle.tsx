import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../../routes/constant";

interface Article {
  id: number;
  title: string;
  date: string;
}

const DeleteArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.includes('/admin/');
  const basePath = isAdminRoute ? '/admin' : '/agent';

  const fetchArticles = async () => {
    const res = await axios.get("http://localhost:3001/articles");
    const formatted = res.data.map((a: any) => ({
      id: a.id,
      title: a.title,
      date: a.date || new Date().toLocaleDateString("en-US"),
    }));
    setArticles(formatted);
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the article "${title}"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/articles/${id}`);
      alert("Article deleted successfully.");
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      alert("Failed to delete article.");
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
      <div className="overflow-auto rounded shadow border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3">{article.date}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
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
    </div>
  );
};

export default DeleteArticle;
