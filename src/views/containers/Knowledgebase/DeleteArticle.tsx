import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/constant";

interface Article {
  id: number;
  title: string;
  date: string;
  status: string;
}

const DeleteArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    const res = await axios.get("http://localhost:3001/articles");
    const formatted = res.data.map((a: any) => ({
      ...a,
      date: a.date || new Date().toLocaleDateString("en-US"),
      status: a.status || "On Track",
    }));
    setArticles(formatted);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/articles/${id}`);
      alert("Article deleted successfully.");
      navigate(PATHS.ADMIN.KNOWLEDGEBASE.path); // ✅ redirect after delete
    } catch (error) {
      alert("Failed to delete article.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Delete Article</h2>
      <div className="overflow-auto rounded shadow border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3">{article.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      article.status === "COMPLETED"
                        ? "bg-green-500 text-white"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(article.id)}
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
                <td colSpan={4} className="text-center py-6 text-gray-500">
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
