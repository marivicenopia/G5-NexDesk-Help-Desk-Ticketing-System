import React from "react";
import type { User } from "../../../types/user";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface UserTableProps {
  data: User[];
  columns: Column<User>[];
  title?: string;
}

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const getInitials = (firstName: string = "", lastName: string = "") => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    return colors[index % colors.length];
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-8 text-gray-500">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users</h2>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(index)}`}>
                      {getInitials(user.firstname, user.lastname)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.isActive ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'staff' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {user.role}
                  </span>
                </td>

                {/* Department */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department || '-'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="Edit User"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete User"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      title="More Options"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to {Math.min(10, data.length)} of {data.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
