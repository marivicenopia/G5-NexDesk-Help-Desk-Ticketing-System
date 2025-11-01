import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/constant";

interface AddArticleForm {
    title: string;
    content: string;
    category: string;
    tags: string;
}

const UserAddArticle: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AddArticleForm>({
        title: "",
        content: "",
        category: "General",
        tags: ""
    });

    const [errors, setErrors] = useState<Partial<AddArticleForm>>({});

    const categories = [
        "General",
        "Getting Started",
        "Account Management",
        "Troubleshooting",
        "Features",
        "API Documentation",
        "Best Practices",
        "FAQ"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof AddArticleForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<AddArticleForm> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters long";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        } else if (formData.content.length < 50) {
            newErrors.content = "Content must be at least 50 characters long";
        }

        if (formData.tags.trim() && formData.tags.includes(" ")) {
            newErrors.tags = "Tags should be separated by commas, not spaces";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const articleData = {
                ...formData,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
                author: "Staff", // In a real app, this would come from auth context
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await fetch('http://localhost:3001/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData),
            });

            if (response.ok) {
                // Success - redirect to knowledge base
                navigate(PATHS.USER.KNOWLEDGEBASE.path);
            } else {
                console.error('Failed to create article');
            }
        } catch (error) {
            console.error('Error creating article:', error);
        } finally {
            setLoading(false);
        }
    };

    const wordCount = formData.content.trim().split(/\s+/).filter(word => word).length;
    const charCount = formData.content.length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Article</h2>
                <p className="text-gray-600">Share your knowledge and help other users by creating a new article.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter a clear, descriptive title for your article"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="tag1, tag2, tag3"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tags ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.tags && (
                            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Separate tags with commas (e.g., setup, guide, beginners)
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Article Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={12}
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Write your article content here. Be detailed and provide step-by-step instructions where appropriate..."
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.content ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Minimum 50 characters required</span>
                        <span>{wordCount} words • {charCount} characters</span>
                    </div>
                </div>

                {/* Writing Tips */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3">Writing Tips</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Use clear, concise language that's easy to understand</li>
                        <li>Break up long sections with subheadings and bullet points</li>
                        <li>Include step-by-step instructions for procedures</li>
                        <li>Add relevant screenshots or examples when possible</li>
                        <li>Preview your article before publishing</li>
                    </ul>
                </div>

                {/* Preview Section */}
                {formData.content && (
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title || "Article Title"}</h4>
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {formData.category}
                                </span>
                                {formData.tags && (
                                    <div className="flex flex-wrap gap-1">
                                        {formData.tags.split(",").map((tag, index) => (
                                            <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{formData.content}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.USER.KNOWLEDGEBASE.path)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </>
                        ) : (
                            'Publish Article'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserAddArticle;
