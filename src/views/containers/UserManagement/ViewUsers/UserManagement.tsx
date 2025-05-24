import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserTable from '../../../components/UserTable';
import { userTableSchema } from '../../../../config/tableSchema';
import { UserService } from '../../../../services/users/UserService';
import type { User } from '../../../../types/user';

const UserManagementContainer: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();

    // Dummy handlers for edit and delete (replace with real logic as needed)
    const handleEdit = (user: User) => {
        alert(`Edit user: ${user.firstname} ${user.lastname}`);
    };

    const handleDelete = (user: User) => {
        alert(`Delete user: ${user.firstname} ${user.lastname}`);
    };

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                const response = await UserService.getAll();
                if (isMounted) setUsers(response);
            } catch (err) {
                if (isMounted) setError('Failed to fetch users');
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    // Get role filter from query string
    const params = new URLSearchParams(location.search);
    const roleFilter = params.get("role");

    // Filter users if role is specified
    const filteredUsers = roleFilter
        ? users.filter((u) => u.role === roleFilter)
        : users;

    if (loading) {
        return <div className="text-center p-4">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="flex justify-center items-start w-full min-h-screen p-2">
            <div className="max-w-4xl w-full bg-white/5">
                <UserTable data={filteredUsers} columns={userTableSchema(handleEdit, handleDelete)} title="User Data" />
            </div>
        </div>
    );
};

export default UserManagementContainer;