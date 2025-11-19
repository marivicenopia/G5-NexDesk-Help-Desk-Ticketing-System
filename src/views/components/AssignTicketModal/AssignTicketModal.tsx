import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiUsers, FiChevronDown } from 'react-icons/fi';
import type { Ticket } from '../../../types/ticket';
import type { User } from '../../../types/user';

interface AssignTicketModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
    onAssign: (ticketId: string | number, assignData: AssignmentData) => Promise<void>;
}

export interface AssignmentData {
    assignedTo: string;
    assignmentType: 'agent' | 'team';
    assignmentNotes?: string;
    assignedBy: string;
    assignedDate: string;
}

const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
    ticket,
    isOpen,
    onClose,
    onAssign
}) => {
    const [assignmentType, setAssignmentType] = useState<'agent' | 'team'>('agent');
    const [selectedAgent, setSelectedAgent] = useState<string>('');
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [assignmentNotes, setAssignmentNotes] = useState<string>('');
    const [availableAgents, setAvailableAgents] = useState<User[]>([]);
    const [availableTeams, setAvailableTeams] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Predefined teams based on departments
    const teams = [
        'IT Support',
        'Network Operations',
        'Software Support',
        'Hardware Support',
        'Email Support',
        'Human Resources',
        'Facility Management',
        'General Support'
    ];

    useEffect(() => {
        if (isOpen) {
            fetchAvailableAgents();
            setAvailableTeams(teams);
            // Reset form
            setAssignmentType('agent');
            setSelectedAgent('');
            setSelectedTeam('');
            setAssignmentNotes('');
        }
    }, [isOpen]);

    const fetchAvailableAgents = async () => {
        try {
            const response = await fetch('/api/user', { credentials: 'include', headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                const raw = await response.text();
                let parsed: any;
                try { parsed = raw ? JSON.parse(raw) : []; } catch { parsed = []; }
                const users: any[] = Array.isArray(parsed) ? parsed : (parsed.response || parsed.users || parsed.user || []);
                const normalized: User[] = users.map((u: any) => ({
                    id: u.id ?? u.userId ?? u.email,
                    username: u.username ?? u.userName ?? u.email ?? '',
                    password: '',
                    firstName: u.firstName ?? u.firstname ?? '',
                    lastName: u.lastName ?? u.lastname ?? '',
                    email: u.email ?? '',
                    isActive: u.isActive ?? true,
                    role: (u.role ?? (Array.isArray(u.roles) ? u.roles[0] : '') ?? '').toLowerCase(),
                }));
                const agents = normalized.filter(user =>
                    user.isActive && (user.role === 'agent' || user.role === 'admin' || user.role === 'superadmin')
                );
                setAvailableAgents(agents);
            } else {
                console.warn('Users endpoint not available', response.status);
                setAvailableAgents([]);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
            setAvailableAgents([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ticket) return;

        const assignedTo = assignmentType === 'agent' ? selectedAgent : selectedTeam;
        if (!assignedTo) {
            alert(`Please select ${assignmentType === 'agent' ? 'an agent' : 'a team'}`);
            return;
        }

        setLoading(true);
        try {
            const assignmentData: AssignmentData = {
                assignedTo,
                assignmentType,
                assignmentNotes: assignmentNotes.trim(),
                assignedBy: localStorage.getItem('userEmail') || 'Unknown',
                assignedDate: new Date().toISOString()
            };

            await onAssign(ticket.id, assignmentData);
            onClose();
        } catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Failed to assign ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !ticket) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Assign Ticket</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Ticket #{ticket.id}: {ticket.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Assignment Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Assignment Type
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="agent"
                                    checked={assignmentType === 'agent'}
                                    onChange={(e) => setAssignmentType(e.target.value as 'agent')}
                                    className="mr-2"
                                />
                                <FiUser className="mr-1" size={16} />
                                Specific Agent
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="team"
                                    checked={assignmentType === 'team'}
                                    onChange={(e) => setAssignmentType(e.target.value as 'team')}
                                    className="mr-2"
                                />
                                <FiUsers className="mr-1" size={16} />
                                Team/Department
                            </label>
                        </div>
                    </div>

                    {/* Agent Selection */}
                    {assignmentType === 'agent' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Agent
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    required
                                >
                                    <option value="">Choose an agent...</option>
                                    {availableAgents.map((agent) => (
                                        <option key={String(agent.id)} value={agent.email}>
                                            {(agent.firstname || agent.firstName) || ''} {(agent.lastname || agent.lastName) || ''} ({agent.email})
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    )}

                    {/* Team Selection */}
                    {assignmentType === 'team' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Team/Department
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedTeam}
                                    onChange={(e) => setSelectedTeam(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    required
                                >
                                    <option value="">Choose a team...</option>
                                    {availableTeams.map((team) => (
                                        <option key={team} value={team}>
                                            {team}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    )}

                    {/* Assignment Notes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Notes (Optional)
                        </label>
                        <textarea
                            value={assignmentNotes}
                            onChange={(e) => setAssignmentNotes(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Add any notes about this assignment..."
                        />
                    </div>

                    {/* Current Assignment Info */}
                    {ticket.assignedTo && (
                        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                <strong>Currently assigned to:</strong> {ticket.assignedTo}
                            </p>
                        </div>
                    )}

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Assigning...' : 'Assign Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTicketModal;