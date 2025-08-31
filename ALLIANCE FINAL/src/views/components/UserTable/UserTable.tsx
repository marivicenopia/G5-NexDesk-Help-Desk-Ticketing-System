import React from "react";
import type { User } from "../../../types/user";

interface UserTableProps {
    data: User[];
    columns: { key: keyof User; label: string; render?: (user: User) => React.ReactNode }[],
    title?: string;
}

const UserTable: React.FC<UserTableProps> = ({ data, columns, title }) => {
    return (
        <div className="w-full">
            {title && <h2 className="text-xl font-bold text-[#031849] mb-2">{title}</h2>}
            <table className="min-w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((user) => (
                        <tr key={user.id}>
                            {columns.map((column) => {
                                const value = user[column.key];
                                return (
                                    <td key={`${user.id}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap">
                                        {column.render ? (
                                            column.render(user)
                                        ) : (
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable;