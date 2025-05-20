import React from "react";

interface TableProps<T>{
    data: T[];
    columns: {
        key: keyof T;
        label: string;
        render?: (item: T) => React.ReactNode;
    }[];
    title: string;
}

const DynamicTable = <T extends object>({ data, columns, title }: TableProps<T>) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
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
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column) => {
                                const value = item[column.key];
                                return (
                                <td key={`${index}-${String(column.key)}`} className="px-6 py-4 whitespace-nowrap">
                                    {column.render ? (
                                        column.render(item)
                                    ) : (
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                                        </div>
                                    )}
                                </td>
                            )})}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;