<<<<<<< HEAD
import React, { useState } from 'react';
import type { User, RoleOption } from '../../../../types/user';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import type { User, RoleOption } from '../../../../types/user';
import { AuthService } from '../../../../services/auth/AuthService';

interface Department {
    id: string;
    name: string;
}
>>>>>>> origin/main

const defaultUser: Omit<User, 'id'> = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    isActive: true,
<<<<<<< HEAD
    role: 'user',
=======
    role: 'staff',
>>>>>>> origin/main
    department: '',
    supportTeams: [],
};

<<<<<<< HEAD
const roles: RoleOption[] = ['user', 'admin', 'agent', 'staff'];

const CreateUser: React.FC = () => {
    const [formData, setFormData] = useState<Omit<User, 'id'>>(defaultUser);
    const [supportTeamsInput, setSupportTeamsInput] = useState('');
=======
// Define roles based on user permissions
const getAvailableRoles = (currentUserRole: string | null): RoleOption[] => {
    if (currentUserRole === 'superadmin') {
        return ['staff', 'agent', 'admin'];
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
    const [departments, setDepartments] = useState<Department[]>([
        { id: '1', name: 'IT' },
        { id: '2', name: 'HR' },
        { id: '3', name: 'Finance' },
        { id: '4', name: 'Marketing' },
        { id: '5', name: 'Operations' }
    ]);
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [newDepartment, setNewDepartment] = useState('');
>>>>>>> origin/main

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;

        if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
            setFormData(prev => ({ ...prev, [target.name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [target.name]: target.value }));
        }
    };

<<<<<<< HEAD
    // For supportTeams, simple comma-separated input handling
    const handleSupportTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSupportTeamsInput(value);
        const teams = value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, supportTeams: teams }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('User Data:', formData);
        alert('User created successfully!');
        // Add your API call or logic here
=======
    const handleAddDepartment = () => {
        if (newDepartment.trim()) {
            const newDept = {
                id: (departments.length + 1).toString(),
                name: newDepartment.trim()
            };
            setDepartments(prev => [...prev, newDept]);
            setFormData(prev => ({ ...prev, department: newDept.name }));
            setNewDepartment('');
            setShowAddDepartment(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = {
                ...formData,
                id: Date.now().toString()
            };

            await axios.post('http://localhost:3001/users', userData);
            alert('User created successfully!');
            navigate('/admin/manage/users');
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
        } finally {
            setLoading(false);
        }
>>>>>>> origin/main
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-black mb-4">Create User</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md text-black">
                <h3 className="text-lg font-semibold mb-4">User Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter First Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Last Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div>
<<<<<<< HEAD
                        <label className="block mb-1">Role</label>
=======
                        <label className="block mb-1">User Type</label>
>>>>>>> origin/main
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        >
<<<<<<< HEAD
                            {roles.map(r => (
=======
                            {availableRoles.map((r: RoleOption) => (
>>>>>>> origin/main
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Department</label>
<<<<<<< HEAD
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Department"
                        />
=======
                        <div className="flex gap-2">
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setShowAddDepartment(true)}
                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                +
                            </button>
                        </div>
>>>>>>> origin/main
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
<<<<<<< HEAD

                    <div className="md:col-span-2">
                        <label className="block mb-1">Support Teams (comma-separated)</label>
                        <input
                            type="text"
                            name="supportTeams"
                            value={supportTeamsInput}
                            onChange={handleSupportTeamsChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="e.g. Team A, Team B, Team C"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold text-white transition"
                    >
                        CREATE USER
                    </button>
                </div>
            </form>
=======
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
>>>>>>> origin/main
        </div>
    );
};

export default CreateUser;
