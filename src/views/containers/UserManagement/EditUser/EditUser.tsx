import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { User, RoleOption } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';
import { UserService } from '../../../../services/users/UserService';
import { DepartmentService, type Department } from '../../../../services/departments/DepartmentService';
import UserEditSubMenu from '../../../components/SideBar/UserEditSubMenu';
import warningSign from '../../../../assets/warning_sign.png';
import { ValidationError } from '../../../../errors/ValidationError';

// Define available roles based on current user permissions
const getAvailableRoles = (currentUserRole: string | null, targetUserRole: string): RoleOption[] => {
    if (currentUserRole === 'superadmin') {
        return ['staff', 'agent', 'admin', 'superadmin'];
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
    const [newPassword, setNewPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'info' | 'password' | 'delete'>('info');
    const role = AuthService.getRole()

    // Validation states
    const [fieldErrors, setFieldErrors] = useState({
        username: false,
        firstName: false,
        lastName: false,
        email: false,
        role: false,
        departmentId: false
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [usernameValidation, setUsernameValidation] = useState({
        isChecking: false,
        isAvailable: true,
        message: ''
    });

    // Get current user role for permission checking
    const currentUserRole = location.state?.currentUserRole || AuthService.getRole();

    const [departments, setDepartments] = useState<Department[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        departmentId: '',
        isActive: true
    });

    // Store original form data for reset functionality
    const [originalFormData, setOriginalFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        departmentId: '',
        isActive: true
    });

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const deptList = await DepartmentService.getActive();
                setDepartments(deptList);
            } catch (error) {
                console.error('Error loading departments:', error);
                // Set fallback departments if API fails
                setDepartments([
                    { id: '1', name: 'IT' },
                    { id: '2', name: 'HR' },
                    { id: '3', name: 'Finance' },
                    { id: '4', name: 'Marketing' },
                    { id: '5', name: 'Operations' }
                ]);
            }
        };

        loadDepartments();

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const userData = await UserService.getById(userId!);

            // Check permissions - only superadmins can edit admin users
            if ((userData.role === 'admin' || userData.role === 'superadmin') && currentUserRole !== 'superadmin') {
                alert('You do not have permission to edit this user.');
                navigate('/admin/manage/users');
                return;
            }

            setUser(userData);
            const initialData = {
                username: userData.username || '',
                firstname: userData.firstName || '',
                lastname: userData.lastName || '',
                email: userData.email || '',
                role: userData.role || '',
                departmentId: userData.departmentId || '',
                isActive: userData.isActive !== false
            };
            setFormData(initialData);
            setOriginalFormData(initialData);
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to load user data');
            navigate('/admin/manage/users');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setHasSubmitted(true);

        if (!validateForm()) {
            alert('Please fix the validation errors before saving.');
            return;
        }
        // console.log('debug sa ta')
        // console.log(formData)
        // console.log("HELLO WORD ASFNJKABHFKABIHEAHVFU")
        // console.log(formData.role)
        // console.log("fdnkabhsajd")
        // console.log(role)
        // if (role == "admin"){
        //     if (formData.role == "admin" || formData.role == "superadmin"){
        //         console.log("dili pwede")
        //     }
        // }

        setSaving(true);
        try {
            if (role == "admin"){
                if (formData.role == "admin" || formData.role == "superadmin"){
                    console.log("HELLO WORD ASFNJKABHFKABIHEAHVFU")
                    throw new ValidationError("You cannot change roles to admin or superadmin")
                }
            }
            const updatedUserData = {
                username: formData.username.trim(),
                firstName: formData.firstname.trim(),
                lastName: formData.lastname.trim(),
                email: formData.email.trim().toLowerCase(),
                role: formData.role as RoleOption,
                departmentId: formData.departmentId,
                isActive: formData.isActive
            };
            await UserService.update(userId!, updatedUserData);
            alert('User updated successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof ValidationError){
                const displayError = "Failed to update user: " + error.message
                alert(displayError)
            }else{
                const displayError = "Failed to update user: " + error
                alert(displayError)
            }
            
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
            await UserService.update(userId!, {
                password: newPassword
            });
            alert('Password updated successfully!');
            setNewPassword('');
            setActiveTab('info');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await UserService.delete(userId!);
            alert('User deleted successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleReset = () => {
        setFormData(originalFormData);
        setFieldErrors({
            username: false,
            firstName: false,
            lastName: false,
            email: false,
            role: false,
            departmentId: false
        });
        setHasSubmitted(false);
        setUsernameValidation({
            isChecking: false,
            isAvailable: true,
            message: ''
        });
    };

    const canDeleteUser = () => {
        if (!user) return false;
        // Super admins can delete anyone except themselves
        if (currentUserRole === 'superadmin') {
            return user.userId !== AuthService.getUserId(); // Don't allow self-deletion
        }
        // Regular admins cannot delete admin or superadmin users
        return currentUserRole === 'admin' && user.role !== 'admin' && user.role !== 'superadmin';
    };

    const canChangeRole = () => {
        if (!user) return false;
        // Super admins can change any role
        if (currentUserRole === 'superadmin') return true;
        // Regular admins cannot change admin/superadmin roles
        return !(user.role === 'admin' || user.role === 'superadmin');
    };

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const validateUsername = async (username: string, currentUsername: string) => {
        if (username === currentUsername) {
            setUsernameValidation({ isChecking: false, isAvailable: true, message: '' });
            return;
        }

        const trimmedUsername = username.trim();
        if (trimmedUsername.length < 3) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username must be at least 3 characters long'
            });
            return;
        }

        if (!/^[a-zA-Z0-9_.]+$/.test(trimmedUsername)) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username can only contain letters, numbers, underscores, and periods'
            });
            return;
        }

        setUsernameValidation({ isChecking: true, isAvailable: true, message: 'Checking availability...' });

        try {
            const users = await UserService.getAll();
            const isAvailable = !users.some(u => u.username?.toLowerCase() === trimmedUsername.toLowerCase() && u.userId !== userId);

            setUsernameValidation({
                isChecking: false,
                isAvailable,
                message: isAvailable ? 'Username is available' : 'Username is already taken'
            });
        } catch (error) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Error checking username availability'
            });
        }
    };

    const getNameValidationError = (fieldName: string, value: string): string => {
        if (!value.trim()) return `${fieldName} is required`;
        if (value.trim().length < 2) return `${fieldName} must be at least 2 characters long`;
        if (/\d/.test(value)) return `${fieldName} cannot contain numbers`;
        if (!/^[a-zA-Z\s'.-]+$/.test(value)) return `${fieldName} can only contain letters, spaces, apostrophes, periods, and hyphens`;
        return '';
    };

    const validateForm = (): boolean => {
        const errors = {
            username: !formData.username.trim() || formData.username.trim().length < 3 || !usernameValidation.isAvailable,
            firstName: !!getNameValidationError('First name', formData.firstname),
            lastName: !!getNameValidationError('Last name', formData.lastname),
            email: !formData.email.trim() || !validateEmail(formData.email),
            role: !formData.role.trim(),
            departmentId: !formData.departmentId.trim()
        };

        setFieldErrors(errors);
        return !Object.values(errors).some(error => error);
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
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit User</h1>
                    <button
                        onClick={() => navigate('/admin/manage/users')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                    >
                        Back to Users
                    </button>
                </div>

                {/* Main Card Container */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex">
                        {/* Left Sidebar Navigation */}
                        <UserEditSubMenu
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            canDelete={canDeleteUser()}
                        />

                        {/* Right Content Area */}
                        <div className="flex-1 p-8">
                            {/* Tab Content */}
                            {activeTab === 'info' && (
                                <div className="space-y-6">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">General</h2>
                                        <p className="text-gray-600">Manage user account information and settings.</p>
                                    </div>

                                    {/* Basic Information */}
                                    {/* Edit when clicked */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Username 
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({ ...formData, username: value });
                                                    if (hasSubmitted) {
                                                        validateUsername(value, user?.username || '');
                                                    }
                                                }}
                                                onBlur={() => validateUsername(formData.username, user?.username || '')}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${hasSubmitted && fieldErrors.username
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter username"
                                            />
                                            {hasSubmitted && fieldErrors.username && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {!formData.username.trim()
                                                        ? 'Username is required'
                                                        : formData.username.trim().length < 3
                                                            ? 'Username must be at least 3 characters long'
                                                            : !usernameValidation.isAvailable
                                                                ? usernameValidation.message
                                                                : 'Invalid username'
                                                    }
                                                </p>
                                            )}
                                            {usernameValidation.message && !fieldErrors.username && (
                                                <p className={`text-sm mt-1 ${usernameValidation.isAvailable ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    {usernameValidation.message}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({ ...formData, email: value });
                                                    if (hasSubmitted) {
                                                        setFieldErrors(prev => ({
                                                            ...prev,
                                                            email: !value.trim() || !validateEmail(value)
                                                        }));
                                                    }
                                                }}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${hasSubmitted && fieldErrors.email
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter email"
                                            />
                                            {hasSubmitted && fieldErrors.email && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {!formData.email.trim()
                                                        ? 'Email is required'
                                                        : 'Please enter a valid email address'
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.firstname}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({ ...formData, firstname: value });
                                                    if (hasSubmitted) {
                                                        setFieldErrors(prev => ({
                                                            ...prev,
                                                            firstName: !!getNameValidationError('First name', value)
                                                        }));
                                                    }
                                                }}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${hasSubmitted && fieldErrors.firstName
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter first name"
                                            />
                                            {hasSubmitted && fieldErrors.firstName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {getNameValidationError('First name', formData.firstname)}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastname}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFormData({ ...formData, lastname: value });
                                                    if (hasSubmitted) {
                                                        setFieldErrors(prev => ({
                                                            ...prev,
                                                            lastName: !!getNameValidationError('Last name', value)
                                                        }));
                                                    }
                                                }}
                                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent ${hasSubmitted && fieldErrors.lastName
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                                    }`}
                                                placeholder="Enter last name"
                                            />
                                            {hasSubmitted && fieldErrors.lastName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {getNameValidationError('Last name', formData.lastname)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Role and Department */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                disabled={!canChangeRole()}
                                            >
                                                {getAvailableRoles(currentUserRole, user.role).map(role => (
                                                    <option key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            {!canChangeRole() && (
                                                <p className="text-sm text-gray-500 mt-2">
                                                    You cannot change this user's role.
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Department
                                            </label>
                                            <select
                                                value={formData.departmentId}
                                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* User Status */}
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Active User</span>
                                        </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleReset}
                                            disabled={saving}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Change Password Tab */}
                            {activeTab === 'password' && (
                                <div className="space-y-6">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password</h2>
                                        <p className="text-gray-600">Change your password to keep your account secure.</p>
                                    </div>

                                    <div className="max-w-md">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter new password"
                                            />
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleChangePassword}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors"
                                            >
                                                Update Password
                                            </button>
                                            <button
                                                onClick={() => setNewPassword('')}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delete User Tab */}
                            {activeTab === 'delete' && canDeleteUser() && (
                                <div className="space-y-6">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-red-600 mb-2">Delete User</h2>
                                        <p className="text-gray-600">Permanently remove this user account and all associated data.</p>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                        <div className="flex items-start space-x-4">
                                            <img src={warningSign} alt="Warning" className="w-12 h-12 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-red-800 mb-2">
                                                    Permanently Delete User
                                                </h3>
                                                <p className="text-red-700 mb-4">
                                                    Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>?
                                                    This action cannot be undone and will permanently remove:
                                                </p>
                                                <ul className="list-disc list-inside text-red-700 mb-6 space-y-1">
                                                    <li>User account and profile information</li>
                                                    <li>All associated tickets and history</li>
                                                    <li>User permissions and access rights</li>
                                                </ul>

                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={() => setShowDeleteModal(true)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                                                    >
                                                        Yes, Delete User
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('info')}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
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
                                            Are you sure you want to delete <strong>{user.firstName} {user.lastName}</strong>'s account?
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;