import React, { useState } from 'react';
import type { User, RoleOption } from '../../../../../types/user';
import { UserService } from '../../../../../services/users/UserService';

const defaultUser: Omit<User, 'id'> = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
    role: 'staff',
    department: '',
    supportTeams: [],
};

const roles: RoleOption[] = ['staff', 'admin', 'agent'];

const CreateUser: React.FC = () => {
    const [formData, setFormData] = useState<Omit<User, 'id'>>(defaultUser);
    const [supportTeamsInput, setSupportTeamsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSupportTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSupportTeamsInput(value);
        const teams = value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, supportTeams: teams }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newUser = await UserService.create(formData);
            alert(`User '${newUser.username}' created successfully!`);
            setFormData(defaultUser);
            setSupportTeamsInput('');
        } catch (err) {
            console.error(err);
            setError('Failed to create user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-black mb-4">Create User</h1>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md text-black">
                <h3 className="text-lg font-semibold mb-4">User Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        minLength={6}
                        required
                    />

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        required
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        required
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                        required
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                    />

                    <input
                        type="text"
                        name="supportTeams"
                        placeholder="Support Teams (comma-separated)"
                        value={supportTeamsInput}
                        onChange={handleSupportTeamsChange}
                        className="border p-2 rounded w-full"
                    />

                    <div className="flex items-center gap-2">
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold text-white transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating...' : 'CREATE USER'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUser;
