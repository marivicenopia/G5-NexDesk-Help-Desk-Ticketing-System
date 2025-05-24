import React, { useEffect, useState } from 'react';
import UserTable from '../../../../components/UserTable';
import { userTableSchema as baseUserColumns } from '../../../../../config/tableSchema';
import { UserService } from '../../../../../services/users/UserService';
import type { User } from '../../../../../types/user';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const UsersViewContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleEdit = (user: User) => {
    // Example: open edit modal or navigate to edit page
    alert(`Edit user: ${user.firstname} ${user.lastname}`);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`)) {
      try {
        await UserService.delete(String(user.id));
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };


  const userColumns = [
  ...baseUserColumns,
  {
    key: 'actions' as keyof User,
    label: 'Actions',
    render: (user: User) => (
      <div className="flex space-x-4">
        <button
          onClick={() => handleEdit(user)}
          className="text-blue-600 hover:text-blue-800"
          aria-label="Edit User"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={() => handleDelete(user)}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete User"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    ),
  },
];

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex justify-center items-start w-full min-h-screen p-2">
      <div className="max-w-8xl w-full bg-white/5">
        <UserTable data={users} columns={userColumns} title="User Data" />
      </div>
    </div>
  );
};

export default UsersViewContainer;
