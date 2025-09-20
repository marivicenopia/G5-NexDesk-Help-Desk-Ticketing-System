import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import type { User, RoleOption } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';
import warningSign from '../../../../assets/warning_sign.png';

interface Department {
    id: string;
    name: string;
}

// Define available roles based on current user permissions
const getAvailableRoles = (currentUserRole: string | null, targetUserRole: string): RoleOption[] => {
    if (currentUserRole === 'superadmin') {
        return ['staff', 'agent', 'admin'];
    }
    // Regular admins cannot change admin/superadmin roles
    if (targetUserRole === 'admin' || targetUserRole === 'superadmin') {
        return [targetUserRole as RoleOption]; // Keep current role, no changes allowed
    }
    // Regular admins can change staff/agent roles
    return ['staff', 'agent'];
};

const EditUser: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Get current user role for permission checking
    const currentUserRole = location.state?.currentUserRole || AuthService.getRole();

    const [departments] = useState<Department[]>([
        { id: '1', name: 'IT' },
        { id: '2', name: 'HR' },
        { id: '3', name: 'Finance' },
        { id: '4', name: 'Marketing' },
        { id: '5', name: 'Operations' }
    ]);

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        department: '',
        isActive: true
    });

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/users/${userId}`);
            const userData = response.data;

            // Check permissions - only superadmins can edit admin users
            if ((userData.role === 'admin' || userData.role === 'superadmin') && currentUserRole !== 'superadmin') {
                alert('You do not have permission to edit this user.');
                navigate('/admin/manage/users');
                return;
            }

            setUser(userData);
            setFormData({
                username: userData.username || '',
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                email: userData.email || '',
                role: userData.role || '',
                department: userData.department || '',
                isActive: userData.isActive !== false
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to load user data');
            navigate('/admin/manage/users');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedUser = {
                ...user,
                ...formData
            };

            await axios.patch(`http://localhost:3001/users/${userId}`, updatedUser);
            alert('User updated successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword.trim()) {
            alert('Please enter a new password');
            return;
        }

        try {
            await axios.patch(`http://localhost:3001/users/${userId}`, {
                password: newPassword
            });
            alert('Password updated successfully!');
            setShowPasswordModal(false);
            setNewPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:3001/users/${userId}`);
            alert('User deleted successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
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
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h1>

                {/* User Info (Editable) */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">User Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter First Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Last Name"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Role and Department */}
                <div className="space-y-6">{/* Space added for visual separation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {user && getAvailableRoles(currentUserRole, user.role).map((role: RoleOption) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                        {user && currentUserRole !== 'superadmin' && (user.role === 'admin' || user.role === 'superadmin') && (
                            <p className="text-sm text-gray-500 mt-1">
                                Only super admins can modify admin role assignments.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Active User
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Change Password
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Delete User
                    </button>

                    <button
                        onClick={() => navigate('/admin/manage/users')}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center z-50 p-4">
                    {/* Dimmed background */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowDeleteModal(false)}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white max-w-md w-full mx-auto p-6 rounded-lg shadow-xl z-10 flex flex-col items-center justify-center text-center">
                        <img src={warningSign} alt="Warning" className="w-16 h-16 mb-4" />
                        <h4 className="text-xl font-bold mb-3 text-gray-900">Confirm User Deletion</h4>
                        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                            Are you sure you want to delete <strong>{user.firstname} {user.lastname}</strong>'s account?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 font-medium px-4 py-2 text-sm cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                style={{ color: "#0B1215" }}
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="flex-1 text-white font-medium px-4 py-2 hover:bg-red-700 text-sm cursor-pointer rounded-lg transition-colors"
                                style={{ backgroundColor: "#FF0000" }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditUser;
