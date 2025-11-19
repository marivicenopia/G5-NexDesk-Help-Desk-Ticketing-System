import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User, RoleOption } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';
import { UserService } from '../../../../services/users/UserService';
import { DepartmentService, type Department } from '../../../../services/departments/DepartmentService';
import { LuCheck, LuX, LuEye, LuEyeOff, LuDice6, LuPlus } from 'react-icons/lu';

// Department interface is now imported from DepartmentService

const defaultUser: Omit<User, 'id'> = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
    role: 'staff',
    departmentId: '',
    supportTeams: [],
};

// Define roles based on user permissions
const getAvailableRoles = (currentUserRole: string | null): RoleOption[] => {
    if (currentUserRole === 'superadmin') {
        return ['staff', 'agent', 'admin', 'superadmin'];
    }
    // Regular admins can only create staff and agents
    return ['staff', 'agent'];
};

const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState<Omit<User, 'id'>>(defaultUser);
    const [loading, setLoading] = useState(false);

    // Get current user role from navigation state or AuthService
    const currentUserRole = location.state?.currentUserRole || AuthService.getRole();
    const availableRoles = getAvailableRoles(currentUserRole);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [newDepartment, setNewDepartment] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: [] as string[]
    });
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [usernameValidation, setUsernameValidation] = useState({
        isChecking: false,
        isAvailable: true,
        message: ''
    });

    // Field validation errors state
    const [fieldErrors, setFieldErrors] = useState({
        username: false,
        password: false,
        firstName: false,
        lastName: false,
        email: false,
        role: false,
        departmentId: false
    });

    // Track if form has been submitted (for validation display)
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Debounce timer for username validation
    const [usernameDebounceTimer, setUsernameDebounceTimer] = useState<number | null>(null);

    // Load departments on component mount
    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const deptList = await DepartmentService.getActive();
                // Sort departments by ID to ensure consistent ordering
                const sortedDeptList = deptList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                setDepartments(sortedDeptList);
            } catch (error) {
                console.error('Error loading departments:', error);
                // Set fallback departments if API fails - updated to match database
                setDepartments([
                    { id: '1', name: 'IT' },
                    { id: '2', name: 'HR' },
                    { id: '3', name: 'Finance' },
                    { id: '4', name: 'Marketing' },
                    { id: '5', name: 'Operations' },
                    { id: '6', name: 'Customer Support' }
                ]);
            }
        };

        loadDepartments();
    }, []);

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (usernameDebounceTimer) {
                clearTimeout(usernameDebounceTimer);
            }
        };
    }, [usernameDebounceTimer]);

    const validateUsername = async (username: string) => {
        // Check for empty username
        if (!username) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: ''
            });
            return;
        }

        // Check for whitespace-only username
        if (!username.trim()) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username cannot contain only spaces'
            });
            return;
        }

        // Trim the username for further validation
        const trimmedUsername = username.trim();

        // Check minimum length after trimming
        if (trimmedUsername.length < 3) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username must be at least 3 characters'
            });
            return;
        }

        // Check for spaces within the username
        if (/\s/.test(trimmedUsername)) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username cannot contain spaces'
            });
            return;
        }

        // Check for valid username format (alphanumeric and common safe characters)
        if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsername)) {
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Username can only contain letters, numbers, dots, hyphens, and underscores'
            });
            return;
        }

        // Show checking status
        setUsernameValidation({
            isChecking: true,
            isAvailable: true,
            message: 'Checking availability...'
        });

        try {
            const exists = await UserService.userExists(trimmedUsername);
            setUsernameValidation({
                isChecking: false,
                isAvailable: !exists,
                message: exists ? 'Username is already taken' : 'Username is available'
            });
        } catch (error) {
            console.error('Error checking username availability:', error);
            setUsernameValidation({
                isChecking: false,
                isAvailable: false,
                message: 'Unable to check availability. Please try again.'
            });
        }
    };

    // Helper function to get specific error messages for names
    const getNameValidationError = (fieldName: string, value: string): string => {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return `${fieldName} is required`;
        }
        if (/\d/.test(trimmedValue)) {
            return `${fieldName} cannot contain numbers`;
        }
        return '';
    };

    // Validate individual fields
    const validateField = (name: string, value?: string): boolean => {
        if (!value) return false;

        switch (name) {
            case 'username':
                return value.trim().length >= 3 && usernameValidation.isAvailable;
            case 'password':
                return passwordValidation.isValid;
            case 'firstName':
            case 'lastName':
                // Names must be at least 1 character and contain no numbers
                const trimmedName = value.trim();
                const hasNumbers = /\d/.test(trimmedName);
                return trimmedName.length > 0 && !hasNumbers;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value.trim());
            case 'role':
                return value.trim().length > 0;
            case 'departmentId':
                return value.trim().length > 0;
            default:
                return true;
        }
    };

    // Validate all required fields
    const validateAllFields = (): boolean => {
        const newFieldErrors = {
            username: !validateField('username', formData.username),
            password: !validateField('password', formData.password),
            firstName: !validateField('firstName', formData.firstName),
            lastName: !validateField('lastName', formData.lastName),
            email: !validateField('email', formData.email),
            role: !validateField('role', formData.role),
            departmentId: !validateField('departmentId', formData.departmentId)
        };

        setFieldErrors(newFieldErrors);

        // Return true if no errors
        return !Object.values(newFieldErrors).some(error => error);
    };

    const validatePassword = (password: string, username?: string) => {
        const errors: string[] = [];
        const currentUsername = username || formData.username;

        // Check length requirements (8-64 characters)
        if (password.length < 8) {
            errors.push('Must be at least 8 characters long');
        } else if (password.length > 64) {
            errors.push('Must not exceed 64 characters');
        }

        // Check for uppercase letters
        if (!/[A-Z]/.test(password)) {
            errors.push('Must contain at least one uppercase letter');
        }

        // Check for lowercase letters
        if (!/[a-z]/.test(password)) {
            errors.push('Must contain at least one lowercase letter');
        }

        // Check for numbers
        if (!/\d/.test(password)) {
            errors.push('Must contain at least one number');
        }

        // Check if password is the same as username (case-insensitive)
        if (currentUsername && password.toLowerCase() === currentUsername.toLowerCase()) {
            errors.push('Password cannot be the same as username');
        }

        // Check if password contains username (case-insensitive)
        if (currentUsername && currentUsername.length >= 3 &&
            password.toLowerCase().includes(currentUsername.toLowerCase())) {
            errors.push('Password cannot contain the username');
        }

        // Check for special characters
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            errors.push('Must contain at least one special character');
        }

        // Check for common weak patterns
        const weakPatterns = [
            /(..)\1{2,}/, // Repeated patterns
            /123456|abcdef|qwerty/i, // Common sequences
            /password|admin|login/i // Common words
        ];

        if (weakPatterns.some(pattern => pattern.test(password))) {
            errors.push('Password contains common weak patterns');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const generateStrongPassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const allChars = uppercase + lowercase + numbers + symbols;

        let password = '';

        // Ensure at least one character from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        // Fill the rest randomly (total 12 characters)
        for (let i = 4; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        const passwordArray = password.split('');
        for (let i = passwordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
        }

        return passwordArray.join('');
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Clear field error when user starts typing (only if form has been submitted)
            if (hasSubmitted) {
                setFieldErrors(prev => ({ ...prev, [name]: false }));
            }

            // Real-time validation after initial submit attempt
            if (hasSubmitted && value.trim().length > 0) {
                const isValid = validateField(name, value);
                setFieldErrors(prev => ({ ...prev, [name]: !isValid }));
            }

            // Validate password in real-time
            if (name === 'password') {
                const validation = validatePassword(value, formData.username);
                setPasswordValidation(validation);
            }

            // Re-validate password when username changes
            if (name === 'username' && formData.password) {
                const validation = validatePassword(formData.password, value);
                setPasswordValidation(validation);
            }

            // Validate username in real-time with debouncing
            if (name === 'username') {
                // Clear existing timer
                if (usernameDebounceTimer) {
                    clearTimeout(usernameDebounceTimer);
                }

                // Set new timer to validate after 500ms of no typing
                const newTimer = setTimeout(() => {
                    validateUsername(value);
                }, 500);

                setUsernameDebounceTimer(newTimer);

                // Reset validation state while typing
                if (value !== formData.username) {
                    setUsernameValidation({
                        isChecking: false,
                        isAvailable: true,
                        message: ''
                    });
                }
            }
        }
    };

    const handleAddDepartment = async () => {
        if (newDepartment.trim()) {
            try {
                const createdDept = await DepartmentService.create({
                    name: newDepartment.trim(),
                    description: `${newDepartment.trim()} Department`
                });

                setDepartments(prev => [...prev, createdDept]);
                setFormData(prev => ({ ...prev, departmentId: createdDept.id }));
                setNewDepartment('');
                setShowAddDepartment(false);
                alert('Department created successfully!');
            } catch (error) {
                console.error('Error creating department:', error);
                alert('Failed to create department. Please try again.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSubmitted(true);

        // Trim username before validation and submission
        const trimmedUsername = formData.username.trim();

        // Update formData with trimmed username
        const cleanFormData = {
            ...formData,
            username: trimmedUsername
        };

        // Check if username is valid after trimming
        if (!trimmedUsername) {
            setFieldErrors(prev => ({ ...prev, username: true }));
            alert('Username is required.');
            return;
        }

        if (trimmedUsername !== formData.username) {
            // Update the form data with trimmed username
            setFormData(cleanFormData);
            // Re-validate with trimmed username
            await validateUsername(trimmedUsername);
            return; // Let user see the validation result before resubmitting
        }

        // Validate all fields
        if (!validateAllFields()) {
            alert('Please correct the highlighted fields before submitting.');
            return;
        }

        // Validate username availability before submitting
        if (!usernameValidation.isAvailable || usernameValidation.isChecking) {
            setFieldErrors(prev => ({ ...prev, username: true }));
            alert('Please ensure the username is available before submitting.');
            return;
        }

        // Validate password before submitting
        if (!passwordValidation.isValid) {
            setFieldErrors(prev => ({ ...prev, password: true }));
            alert('Please ensure your password meets all security requirements before submitting.');
            return;
        }

        setLoading(true); try {
            // Create user using the integrated UserService with clean data
            await UserService.create(cleanFormData);
            alert('User created successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error creating user:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create user. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-black mb-4">Create User</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md text-black">
                <h3 className="text-lg font-semibold mb-4">User Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            Username <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 ${fieldErrors.username || (!usernameValidation.isAvailable && !usernameValidation.isChecking && formData.username.length > 0)
                                    ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                    : formData.username.length > 0
                                        ? usernameValidation.isAvailable && !usernameValidation.isChecking
                                            ? 'border-green-300 bg-green-50 focus:ring-green-200'
                                            : usernameValidation.isChecking
                                                ? 'border-yellow-300 bg-yellow-50 focus:ring-yellow-200'
                                                : 'border-red-300 bg-red-50 focus:ring-red-200'
                                        : 'border-gray-300 bg-gray-100 focus:ring-blue-200'
                                    }`}
                                placeholder="Enter Username (min 3 characters)"
                                minLength={3}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {usernameValidation.isChecking && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}
                                {!usernameValidation.isChecking && formData.username.length > 0 && (
                                    <span className={`text-sm ${usernameValidation.isAvailable ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {usernameValidation.isAvailable ? <LuCheck size={16} /> : <LuX size={16} />}
                                    </span>
                                )}
                            </div>
                        </div>
                        {formData.username.length > 0 && usernameValidation.message && (
                            <div className={`mt-1 text-xs ${usernameValidation.isAvailable
                                ? 'text-green-600'
                                : usernameValidation.isChecking
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}>
                                {usernameValidation.message}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Password <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input
                                type={showPasswordRequirements ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 pr-32 rounded-md border focus:outline-none focus:ring-2 ${fieldErrors.password || (!passwordValidation.isValid && formData.password.length > 0)
                                    ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                    : formData.password
                                        ? passwordValidation.isValid
                                            ? 'border-green-300 bg-green-50 focus:ring-green-200'
                                            : 'border-red-300 bg-red-50 focus:ring-red-200'
                                        : 'border-gray-300 bg-gray-100 focus:ring-blue-200'
                                    }`}
                                placeholder="Enter secure password (8-64 characters)"
                                minLength={8}
                                maxLength={64}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordRequirements(!showPasswordRequirements)}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Toggle password visibility"
                                >
                                    {showPasswordRequirements ? <LuEye size={16} /> : <LuEyeOff size={16} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPassword = generateStrongPassword();
                                        setFormData(prev => ({ ...prev, password: newPassword }));
                                        setPasswordValidation(validatePassword(newPassword, formData.username));
                                    }}
                                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                                    title="Generate strong password"
                                >
                                    <LuDice6 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-2 space-y-1">
                            <div className="text-sm font-medium text-gray-700">Password Requirements:</div>
                            <div className="grid grid-cols-1 gap-1 text-xs">
                                <div className={`flex items-center gap-2 ${formData.password.length >= 8 && formData.password.length <= 64 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{formData.password.length >= 8 && formData.password.length <= 64 ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                    8-64 characters long
                                </div>
                                <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{/[A-Z]/.test(formData.password) ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                    One uppercase letter (A-Z)
                                </div>
                                <div className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{/[a-z]/.test(formData.password) ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                    One lowercase letter (a-z)
                                </div>
                                <div className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{/\d/.test(formData.password) ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                    One number (0-9)
                                </div>
                                <div className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    <span>{/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(formData.password) ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                    One special character (!@#$%^&*...)
                                </div>
                                {formData.username && (
                                    <>
                                        <div className={`flex items-center gap-2 ${formData.password.toLowerCase() !== formData.username.toLowerCase() ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            <span>{formData.password.toLowerCase() !== formData.username.toLowerCase() ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                            Cannot be the same as username
                                        </div>
                                        <div className={`flex items-center gap-2 ${!formData.password.toLowerCase().includes(formData.username.toLowerCase()) ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            <span>{!formData.password.toLowerCase().includes(formData.username.toLowerCase()) ? <LuCheck size={14} /> : <LuX size={14} />}</span>
                                            Cannot contain the username
                                        </div>
                                    </>
                                )}
                            </div>

                            {passwordValidation.errors.length > 0 && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                                    <div className="font-medium">Password Issues:</div>
                                    <ul className="list-disc list-inside mt-1">
                                        {passwordValidation.errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1">First Name <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring ${fieldErrors.firstName
                                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter First Name"
                        />
                        {fieldErrors.firstName && (
                            <div className="mt-1 text-xs text-red-600">
                                {getNameValidationError('First name', formData.firstName)}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Last Name <span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring ${fieldErrors.lastName
                                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter Last Name"
                        />
                        {fieldErrors.lastName && (
                            <div className="mt-1 text-xs text-red-600">
                                {getNameValidationError('Last name', formData.lastName)}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Email <span className="text-red-600">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring ${fieldErrors.email
                                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter Email"
                        />
                        {fieldErrors.email && (
                            <div className="mt-1 text-xs text-red-600">
                                Please enter a valid email address
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">User Type <span className="text-red-600">*</span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring ${fieldErrors.role
                                ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                                }`}
                        >
                            {availableRoles.map((r: RoleOption) => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                        {fieldErrors.role && (
                            <div className="mt-1 text-xs text-red-600">
                                Please select a user role
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Department</label>
                        <div className="flex gap-2">
                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleInputChange}
                                className={`flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring ${fieldErrors.departmentId
                                    ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                    : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
                                    }`}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowAddDepartment(true)}
                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <LuPlus size={16} />
                            </button>
                        </div>
                        {fieldErrors.departmentId && (
                            <div className="mt-1 text-xs text-red-600">
                                Please select a department
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="block mb-1">Active</label>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold text-white transition disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'CREATE USER'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/manage/users')}
                        className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Add Department Modal */}
            {showAddDepartment && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-10 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Add New Department</h3>
                        <input
                            type="text"
                            value={newDepartment}
                            onChange={(e) => setNewDepartment(e.target.value)}
                            placeholder="Department name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddDepartment(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddDepartment}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateUser;
