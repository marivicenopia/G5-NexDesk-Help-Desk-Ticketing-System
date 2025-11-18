import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";
import { API_CONFIG } from "../../../../config/api";

interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    categoryName: string;
    author: string;
    status: string;
}

const UserViewArticle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                setLoading(true);

                // Fetch the specific article
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_ARTICLE(id)}`);
                if (response.ok) {
                    const articleData = await response.json();
                    const formattedArticle: Article = {
                        id: articleData.id,
                        title: articleData.title,
                        content: articleData.content,
                        category: articleData.categoryId,
                        categoryName: articleData.categoryName || articleData.categoryId,
                        author: articleData.author,
                        status: articleData.status
                    };
                    setArticle(formattedArticle);

                    // Fetch related articles from the same category
                    const categoriesResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE_GET_CATEGORIES}`);
                    const categories = await categoriesResponse.json();
                    const allArticles: Article[] = [];
                    categories.forEach((category: any) => {
                        category.articles.forEach((art: any) => {
                            if (art.id !== articleData.id && art.categoryId === articleData.categoryId) {
                                allArticles.push({
                                    id: art.id,
                                    title: art.title,
                                    content: '',
                                    category: category.categoryId,
                                    categoryName: category.name,
                                    author: art.author,
                                    status: art.status
                                });
                            }
                        });
                    });
                    setRelatedArticles(allArticles.slice(0, 4));
                } else {
                    console.error('Article not found');
                    navigate(PATHS.USER.KNOWLEDGEBASE.path);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                navigate(PATHS.USER.KNOWLEDGEBASE.path);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, navigate]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Article Not Found</h3>
                <p className="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
                <Link
                    to={PATHS.USER.KNOWLEDGEBASE.path}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back to Knowledge Base
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Navigation */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to={PATHS.USER.KNOWLEDGEBASE.path} className="hover:text-blue-600">
                    Knowledge Base
                </Link>
                <span>→</span>
                <span className="text-gray-900">{article.title}</span>
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-lg shadow-sm">
                {/* Article Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {article.categoryName}
                                </span>
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    Status: {article.status}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">{article.title}</h1>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span>By {article.author}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(PATHS.USER.KNOWLEDGEBASE.path)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* Article Body */}
                <div className="p-6">
                    <div className="prose max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>
                </div>

                {/* Article Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Was this article helpful?
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded border border-green-200 transition-colors">
                                👍 Yes
                            </button>
                            <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors">
                                👎 No
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedArticles.map((relatedArticle) => (
                            <Link
                                key={relatedArticle.id}
                                to={`/user/knowledgebase/view/${relatedArticle.id}`}
                                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                                <h4 className="font-medium text-gray-900 mb-2">{relatedArticle.title}</h4>
                                {relatedArticle.content && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        {relatedArticle.content.substring(0, 100)}...
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>By {relatedArticle.author}</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        {relatedArticle.categoryName}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between">
                <Link
                    to={PATHS.USER.KNOWLEDGEBASE.path}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Knowledge Base</span>
                </Link>
                <Link
                    to={PATHS.USER.CREATE_TICKET.path}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Still Need Help? Create Ticket</span>
                </Link>
            </div>
        </div>
    );
};

export default UserViewArticle;
