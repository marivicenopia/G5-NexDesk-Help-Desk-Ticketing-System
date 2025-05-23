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
    <div className="p-8 min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-black"
        >
          <MdAdd className="text-2xl" />
          Add Article
        </button>
        <MdDelete
          className="text-2xl text-gray-400 hover:text-red-600 cursor-pointer"
          title="Go to Delete Article Page"
          onClick={handleRedirectToDeletePage}
        />
      </div>

      {/* Article Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Object.entries(grouped).map(([category, articles]) => {
          const styles = categoryStyles[category] || {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            iconBg: 'bg-gray-500',
          };

          return (
            <div key={category} className="bg-white p-6 rounded-xl shadow-md min-h-[270px]">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-full p-3 ${styles.iconBg} text-white`}>
                  <MdArticle className="text-xl" />
                </div>
                <h2 className={`text-lg font-bold ${styles.text}`}>{category}</h2>
              </div>

              {/* Article List */}
              <ul className="text-[15px] text-gray-800 space-y-2 pl-1">
                {articles.map((article) => (
                  <li
                    key={article.id}
                    className="flex justify-between items-center group hover:text-blue-600"
                  >
                    <div className="flex items-start gap-2">
                      <MdArticle className="text-gray-500 mt-1" />
                      <button
                        onClick={() =>
                          navigate(PATHS.ADMIN.VIEW_ARTICLE.path.replace(':id', article.id.toString()))
                        }
                        className="text-left hover:underline"
                      >
                        {article.title}
                      </button>
                    </div>
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-blue-600"
                      title="Edit Article"
                    >
                      <MdEdit />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Knowledgebase;
