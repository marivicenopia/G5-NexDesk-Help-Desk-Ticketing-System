import React, { useState } from 'react';
import type { User, RoleOption } from '../../../../types/user';

const defaultUser: Omit<User, 'id'> = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    isActive: true,
    role: 'user',
    department: '',
    supportTeams: [],
};

const roles: RoleOption[] = ['user', 'admin', 'agent', 'staff'];

const CreateUser: React.FC = () => {
    const [formData, setFormData] = useState<Omit<User, 'id'>>(defaultUser);
    const [supportTeamsInput, setSupportTeamsInput] = useState('');

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
                        <label className="block mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        >
                            {roles.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter Department"
                        />
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
        </div>
    );
};

export default CreateUser;
