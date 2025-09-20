import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdArticle, MdDelete, MdAdd, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/constant';

interface Article {
  id: number;
  category: string;
  title: string;
}

const categoryStyles: Record<string, { bg: string; text: string; iconBg: string }> = {
  'Introduction to I.T': { bg: 'bg-green-100', text: 'text-green-700', iconBg: 'bg-green-500' },
  'Coding & Dev': { bg: 'bg-cyan-100', text: 'text-cyan-700', iconBg: 'bg-cyan-500' },
  'Cybersecurity': { bg: 'bg-pink-100', text: 'text-pink-700', iconBg: 'bg-pink-500' },
  'Databases': { bg: 'bg-orange-100', text: 'text-orange-700', iconBg: 'bg-orange-500' },
  'Cloud & DevOps': { bg: 'bg-lime-100', text: 'text-lime-700', iconBg: 'bg-lime-500' },
  'Networking': { bg: 'bg-purple-100', text: 'text-purple-700', iconBg: 'bg-purple-500' },
};

const Knowledgebase = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    const res = await axios.get('http://localhost:3001/articles');
    setArticles(res.data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAdd = () => {
    navigate(PATHS.ADMIN.ADD_ARTICLE.path);
  };

  const handleEdit = (id: number) => {
    navigate(PATHS.ADMIN.EDIT_ARTICLE.path.replace(':id', id.toString()));
  };

  const handleRedirectToDeletePage = () => {
    navigate(PATHS.ADMIN.DELETE_ARTICLE.path);
  };

  const grouped = articles.reduce((acc: Record<string, Article[]>, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category].push(article);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#031849] mb-1">Knowledge Base</h1>
            <p className="text-gray-600">Browse articles and documentation by category</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <MdAdd className="w-4 h-4" />
              Add Article
            </button>
            <button
              onClick={handleRedirectToDeletePage}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Manage Articles"
            >
              <MdDelete className="w-4 h-4" />
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Article Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([category, articles]) => {
          const styles = categoryStyles[category] || {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            iconBg: 'bg-gray-500',
          };

          return (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`rounded-lg p-3 ${styles.iconBg} text-white`}>
                  <MdArticle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${styles.text}`}>{category}</h3>
                  <p className="text-sm text-gray-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Article List */}
              <div className="space-y-3">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex justify-between items-center group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <MdArticle className="text-gray-400 mt-1 w-4 h-4 flex-shrink-0" />
                      <button
                        onClick={() =>
                          navigate(PATHS.ADMIN.VIEW_ARTICLE.path.replace(':id', article.id.toString()))
                        }
                        className="text-left text-sm text-gray-900 hover:text-blue-600 transition-colors font-medium line-clamp-2"
                      >
                        {article.title}
                      </button>
                    </div>
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-gray-400 hover:text-blue-600"
                      title="Edit Article"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {articles.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No articles in this category</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12">
          <MdArticle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">Start building your knowledge base by adding articles.</p>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <MdAdd className="w-4 h-4" />
            Add First Article
          </button>
        </div>
      )}
    </div>
  );
};

export default Knowledgebase;
