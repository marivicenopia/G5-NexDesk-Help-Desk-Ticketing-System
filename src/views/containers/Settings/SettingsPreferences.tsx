import React, { useState, useEffect } from 'react';
import { AuthService } from '../../../services/auth/AuthService';
import { PreferencesService, type TicketPreferences, DEFAULT_PREFERENCES } from '../../../services/preferences/PreferencesService';

const SettingsPreferences: React.FC = () => {
    const [preferences, setPreferences] = useState<TicketPreferences>(DEFAULT_PREFERENCES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const statusOptions = [
        { value: 'all', label: 'All Tickets' },
        { value: 'open', label: 'Open Tickets' },
        { value: 'assigned', label: 'Assigned Tickets' },
        { value: 'in progress', label: 'In Progress Tickets' },
        { value: 'on hold', label: 'On Hold Tickets' },
        { value: 'resolved', label: 'Resolved Tickets' },
        { value: 'closed', label: 'Closed Tickets' }
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'critical', label: 'Critical Priority' },
        { value: 'urgent', label: 'Urgent Priority' },
        { value: 'high', label: 'High Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'low', label: 'Low Priority' }
    ];

    const sortByOptions = [
        { value: 'priority', label: 'Priority' },
        { value: 'status', label: 'Status' },
        { value: 'submittedDate', label: 'Date Created' },
        { value: 'title', label: 'Title' },
        { value: 'department', label: 'Department' }
    ];

    const itemsPerPageOptions = [
        { value: 5, label: '5 per page' },
        { value: 10, label: '10 per page' },
        { value: 20, label: '20 per page' },
        { value: 50, label: '50 per page' }
    ];

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const userId = AuthService.getToken();
            if (!userId) return;

            const userPreferences = PreferencesService.getPreferences(userId);
            setPreferences(userPreferences);
        } catch (error) {
            console.error('Error loading preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof TicketPreferences, value: string | number) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const userId = AuthService.getToken();
            if (!userId) {
                setError('User not authenticated');
                return;
            }

            // Save preferences using the service
            PreferencesService.savePreferences(userId, preferences);

            setSuccess('Preferences saved successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error) {
            console.error('Error saving preferences:', error);
            setError('Failed to save preferences. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setPreferences(DEFAULT_PREFERENCES);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Default Filter Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Ticket Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Status */}
                    <div>
                        <label htmlFor="defaultStatus" className="block text-sm font-medium text-gray-700 mb-2">
                            Default Status Filter
                        </label>
                        <select
                            id="defaultStatus"
                            value={preferences.defaultStatus}
                            onChange={(e) => handleInputChange('defaultStatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Default Priority */}
                    <div>
                        <label htmlFor="defaultPriority" className="block text-sm font-medium text-gray-700 mb-2">
                            Default Priority Filter
                        </label>
                        <select
                            id="defaultPriority"
                            value={preferences.defaultPriority}
                            onChange={(e) => handleInputChange('defaultPriority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {priorityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Default Sorting Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Sorting Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sort By */}
                    <div>
                        <label htmlFor="defaultSortBy" className="block text-sm font-medium text-gray-700 mb-2">
                            Sort Tickets By
                        </label>
                        <select
                            id="defaultSortBy"
                            value={preferences.defaultSortBy}
                            onChange={(e) => handleInputChange('defaultSortBy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {sortByOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label htmlFor="defaultSortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                            Sort Order
                        </label>
                        <select
                            id="defaultSortOrder"
                            value={preferences.defaultSortOrder}
                            onChange={(e) => handleInputChange('defaultSortOrder', e.target.value as 'asc' | 'desc')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="desc">High to Low / Newest First</option>
                            <option value="asc">Low to High / Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Display Options Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items Per Page */}
                    <div>
                        <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                            Tickets Per Page
                        </label>
                        <select
                            id="itemsPerPage"
                            value={preferences.itemsPerPage}
                            onChange={(e) => handleInputChange('itemsPerPage', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Current Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Current Settings Preview</h4>
                <p className="text-sm text-blue-800">
                    Default view: <span className="font-medium">
                        {statusOptions.find(s => s.value === preferences.defaultStatus)?.label} - {' '}
                        {priorityOptions.find(p => p.value === preferences.defaultPriority)?.label}
                    </span> sorted by <span className="font-medium">
                        {sortByOptions.find(s => s.value === preferences.defaultSortBy)?.label}
                    </span> ({preferences.defaultSortOrder === 'desc' ? 'High to Low' : 'Low to High'}) showing {' '}
                    <span className="font-medium">{preferences.itemsPerPage} tickets per page</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Reset to Defaults
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center"
                >
                    {saving && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </form>
    );
};

export default SettingsPreferences;
