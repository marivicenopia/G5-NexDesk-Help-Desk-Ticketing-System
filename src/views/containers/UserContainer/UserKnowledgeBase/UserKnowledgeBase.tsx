import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";
import { Pagination } from '../../../components/Pagination';

interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    author: string;
    status: string;
}

const UserKnowledgeBase: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage, setArticlesPerPage] = useState(5); // Number of articles per page

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/articles');
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const categories = ["all", ...Array.from(new Set(articles.map(article => article.category)))];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Reset to first page when search, category, or articles per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, articlesPerPage]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const popularArticles = articles.slice(0, 5);

    const recentArticles = articles.slice(0, 5);

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + "...";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
                    <p className="text-gray-600">Find answers to common questions and learn how to use our platform</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search Articles
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                placeholder="Search by title, content, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="perPage" className="block text-sm font-medium text-gray-700 mb-2">
                            Articles per Page
                        </label>
                        <select
                            id="perPage"
                            value={articlesPerPage}
                            onChange={(e) => setArticlesPerPage(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={15}>15 per page</option>
                            <option value={20}>20 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Articles List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {searchTerm || selectedCategory !== "all"
                                    ? `Search Results (${filteredArticles.length})`
                                    : `All Articles (${filteredArticles.length})`
                                }
                            </h3>
                            {filteredArticles.length > articlesPerPage && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, filteredArticles.length)} of {filteredArticles.length} articles
                                </p>
                            )}
                        </div>

                        {currentArticles.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {currentArticles.map((article) => (
                                    <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                                        {article.title}
                                                    </h4>
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {article.category}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-3">{truncateContent(article.content)}</p>
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                        Status: {article.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                    <span>By {article.author}</span>
                                                    <span>•</span>
                                                    <span>Category: {article.category}</span>
                                                </div>
                                            </div>
                                            <div className="ml-6 flex-shrink-0">
                                                <Link
                                                    to={`/user/knowledgebase/view/${article.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Read More →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || selectedCategory !== "all"
                                        ? "Try adjusting your search or filter criteria."
                                        : "No articles have been created yet."
                                    }
                                </p>
                            </div>
                        )}

                        {/* Unified Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredArticles.length}
                            itemsPerPage={articlesPerPage}
                            onPageChange={handlePageChange}
                            startIndex={indexOfFirstArticle}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Popular Articles */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                        <div className="space-y-3">
                            {popularArticles.length > 0 ? (
                                popularArticles.map((article, index) => (
                                    <div key={article.id} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/user/knowledgebase/view/${article.id}`}
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600 block truncate"
                                            >
                                                {article.title}
                                            </Link>
                                            <p className="text-xs text-gray-500">Status: {article.status}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No articles available</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Articles */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
                        <div className="space-y-3">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article) => (
                                    <div key={article.id} className="border-l-2 border-blue-200 pl-3">
                                        <Link
                                            to={`/user/knowledgebase/view/${article.id}`}
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 block"
                                        >
                                            {article.title}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1">By {article.author}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No articles available</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
                        <div className="space-y-3">
                            <Link
                                to={PATHS.USER.CREATE_TICKET.path}
                                className="flex items-center space-x-2 text-sm text-blue-800 hover:text-blue-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Create Support Ticket</span>
                            </Link>
                            <Link
                                to={PATHS.USER.CREATE_FEEDBACK.path}
                                className="flex items-center space-x-2 text-sm text-blue-800 hover:text-blue-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span>Submit Feedback</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserKnowledgeBase;
