import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserTable from '../../../components/UserTable';
import { userTableSchema } from '../../../../config/tableSchema';
import { UserService } from '../../../../services/users/UserService';
import type { User } from '../../../../types/user';

// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import UserTable from '../../../components/UserTable';
// import { userTableSchema } from '../../../../config/tableSchema';
// import { UserService } from '../../../../services/users/UserService';
// import type { User } from '../../../../types/user';

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
        if (window.confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`)) {
            alert(`Delete user: ${user.firstname} ${user.lastname}`);
            // Add actual delete logic here
        }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching users...');
                const response = await UserService.getAll();
                console.log('Users fetched:', response);
                if (isMounted) {
                    setUsers(response || []);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch users');
                }
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

    console.log('Current state:', { loading, error, usersCount: users.length, filteredUsersCount: filteredUsers.length, roleFilter });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600">Loading users...</div>
                    <div className="mt-2 text-sm text-gray-500">Please wait while we fetch the user data.</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-red-600 mb-2">Error Loading Users</div>
                    <div className="text-sm text-red-500">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (filteredUsers.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-gray-600 mb-2">No Users Found</div>
                    <div className="text-sm text-gray-500">
                        {roleFilter ? `No users found with role: ${roleFilter}` : 'No users available in the system.'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start w-full min-h-screen p-2">
            <div className="max-w-6xl w-full bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-[#031849] mb-1">
                            {roleFilter ? `${roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)} Users` : 'All Users'}
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                            {roleFilter && ` with role: ${roleFilter}`}
                        </p>
                    </div>
                    <UserTable
                        data={filteredUsers}
                        columns={userTableSchema(handleEdit, handleDelete)}
                        title=""
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagementContainer;