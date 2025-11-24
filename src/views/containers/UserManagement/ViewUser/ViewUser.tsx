import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { User } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';
import { UserService } from '../../../../services/users/UserService';
import { DepartmentService, type Department } from '../../../../services/departments/DepartmentService';

const ViewUser: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);

    // Get current user role for permission checking
    const currentUserRole = location.state?.currentUserRole || AuthService.getRole();

    // Helper function to check if current user can modify the viewed user
    const canModifyUser = (user: User) => {
        if (currentUserRole === 'superadmin') {
            return true;
        }
        if (currentUserRole === 'admin' && (user.role === 'admin' || user.role === 'superadmin')) {
            return false;
        }
        return currentUserRole === 'admin';
    };

    const getDepartmentName = (departmentId?: string) => {
        if (!departmentId) return 'N/A';
        const department = departments.find(dept => dept.id === departmentId);
        return department ? department.name : 'N/A';
    };

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const deptList = await DepartmentService.getActive();
                console.log('ViewUser - Loaded departments from API:', deptList);
                // Sort departments by ID to ensure consistent ordering
                const sortedDeptList = deptList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                setDepartments(sortedDeptList);
            } catch (error) {
                console.error('ViewUser - Error loading departments:', error);
                // Set fallback departments if API fails - updated to match database
                const fallbackDepts = [
                    { id: '1', name: 'IT' },
                    { id: '2', name: 'HR' },
                    { id: '3', name: 'Finance' },
                    { id: '4', name: 'Marketing' },
                    { id: '5', name: 'Operations' },
                    { id: '6', name: 'Customer Support' }
                ];
                console.log('ViewUser - Using fallback departments:', fallbackDepts);
                setDepartments(fallbackDepts);
            }
        };

        loadDepartments();

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const foundUser = await UserService.getById(userId!);
            setUser(foundUser);
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to load user data');
            navigate('/admin/manage/users');
        } finally {
            setLoading(false);
        }
    };

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

    if (!user) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">User not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                    <div className="flex gap-3">
                        {canModifyUser(user) ? (
                            <button
                                onClick={() => navigate(`/admin/users/edit/${userId}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit User
                            </button>
                        ) : (
                            <div className="flex items-center">
                                <span className="text-gray-500 text-sm italic">No edit permissions</span>
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/admin/manage/users')}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Back to Users
                        </button>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center mb-8">
                    <div className="flex-shrink-0 h-20 w-20">
                        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                        </div>
                    </div>
                    <div className="ml-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-gray-600">@{user.username}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.isActive)}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Personal Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <p className="text-gray-900">{user.firstName || 'N/A'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <p className="text-gray-900">{user.lastName || 'N/A'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <p className="text-gray-900">{user.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Account Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <p className="text-gray-900">{user.username || 'N/A'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <p className="text-gray-900">{getDepartmentName(user.departmentId)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.isActive)}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                        Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <p className="text-gray-900 font-mono">{user.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Created</label>
                            <p className="text-gray-900">N/A</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;
