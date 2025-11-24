export const getStatusColor = (status: string | undefined | null) => {
    const normalized = status?.toLowerCase().trim() || '';

    switch (normalized) {
        case 'open':
            return 'bg-green-100 text-green-800';
        case 'assigned':
            return 'bg-blue-100 text-blue-800';
        case 'in progress':
            return 'bg-yellow-100 text-yellow-800';
        case 'resolved':
            return 'bg-purple-100 text-purple-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

export const getPriorityColor = (priority: string | undefined | null) => {
    const normalized = priority?.toLowerCase().trim() || '';

    switch (normalized) {
        case 'low':
            return 'bg-slate-100 text-slate-700';
        case 'medium':
            return 'bg-blue-100 text-blue-800';
        case 'high':
            return 'bg-orange-100 text-orange-800';
        case 'urgent':
            return 'bg-red-100 text-red-800';
        case 'critical':
            return 'bg-red-200 text-red-900 border border-red-300'; // Added border for extra emphasis
        default:
            return 'bg-gray-100 text-gray-600';
    }
};