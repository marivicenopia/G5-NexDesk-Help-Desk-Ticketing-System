import React, { useEffect, useState } from 'react';
import UserTable from '../../../../components/UserTable';
import { UserService } from '../../../../../services/users/UserService';
import type { User } from '../../../../../types/user';

const UsersViewContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  console.log('Current state:', { loading, error, usersCount: users.length });

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

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">No Users Found</div>
          <div className="text-sm text-gray-500">No users available in the system.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UserTable data={users} columns={[]} />
    </div>
  );
};

export default UsersViewContainer;
