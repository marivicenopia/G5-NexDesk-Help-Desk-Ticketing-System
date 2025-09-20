import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import type { User } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';
import { Pagination } from '../../../components/Pagination';
import { DeleteAccountModal } from '../../../components/DeleteAccountModal';

const UserManagementContainer: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();
    const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const usersPerPage = 10;
    const navigate = useNavigate();

    // Get current user's role for permission checking
    const currentUserRole = AuthService.getRole();

    // Helper function to check if current user can modify a specific user
    const canModifyUser = (user: User) => {
        // Super admins can modify anyone
        if (currentUserRole === 'superadmin') {
            return true;
        }
        // Regular admins cannot modify admin or superadmin users
        if (currentUserRole === 'admin' && (user.role === 'admin' || user.role === 'superadmin')) {
            return false;
        }
        // Regular admins can modify agents and users
        return currentUserRole === 'admin';
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole, selectedDepartment, selectedStatus]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3001/users');
            setUsers(response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        if (!canModifyUser(user)) {
            alert('You do not have permission to edit this user.');
            return;
        }
        navigate(`/admin/users/edit/${user.id}`, { state: { currentUserRole } });
    };

    const handleView = (user: User) => {
        navigate(`/admin/users/view/${user.id}`, { state: { currentUserRole } });
    };

    const handleDelete = (user: User) => {
        // Only superadmin can delete accounts
        if (currentUserRole !== 'superadmin') {
            alert('You do not have permission to delete user accounts.');
            return;
        }

        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setDeleteLoading(true);
            await axios.delete(`http://localhost:3001/users/${userToDelete.id}`);
            alert('User account deleted successfully!');
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user account');
        } finally {
            setDeleteLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleAddUser = () => {
        // Pass current user role to restrict options in CreateUser component
        navigate('/admin/create/user', { state: { currentUserRole } });
    };

    // Get unique departments for filter dropdown
    const uniqueDepartments = [...new Set(users.map(user => user.department).filter(Boolean))];

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedRole('all');
        setSelectedDepartment('all');
        setSelectedStatus('all');
        setCurrentPage(1);
    };

    // Filter users based on role, department, status and search term
    const filteredUsers = users.filter(user => {
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'active' && user.isActive) ||
            (selectedStatus === 'inactive' && !user.isActive);
        const matchesSearch = user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesDepartment && matchesStatus && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin':
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'agent':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeClass = (isActive: boolean) => {
        return isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage system users and their permissions</p>
                    </div>
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Add User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="staff">Staff</option>
                            <option value="agent">Agents</option>
                            <option value="admin">Admins</option>
                            <option value="superadmin">Super Admins</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Departments</option>
                            {uniqueDepartments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Reset Filters Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleResetFilters}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        Clear all filters
                    </button>
                </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Showing {currentUsers.length} of {filteredUsers.length} users
                    {filteredUsers.length !== users.length && (
                        <span> (filtered from {users.length} total)</span>
                    )}
                </p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {user.firstname?.[0]}{user.lastname?.[0]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstname} {user.lastname}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    @{user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.department || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.isActive)}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                            {canModifyUser(user) && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    {/* Only superadmin can delete accounts */}
                                                    {currentUserRole === 'superadmin' && (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {!canModifyUser(user) && (
                                                <span className="text-gray-400 text-sm italic">
                                                    No permissions
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Unified Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredUsers.length}
                    itemsPerPage={usersPerPage}
                    onPageChange={setCurrentPage}
                    startIndex={startIndex}
                />
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                userFullName={userToDelete ? `${userToDelete.firstname} ${userToDelete.lastname}` : ''}
                loading={deleteLoading}
            />
        </div>
    );
};

export default UserManagementContainer;