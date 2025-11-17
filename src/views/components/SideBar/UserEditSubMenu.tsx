import React from "react";

interface UserEditSubMenuProps {
    activeTab: 'info' | 'password' | 'delete';
    onTabChange: (tab: 'info' | 'password' | 'delete') => void;
    canDelete: boolean;
}

const UserEditSubMenu: React.FC<UserEditSubMenuProps> = ({ activeTab, onTabChange, canDelete }) => {
    return (
        <div className="w-64 bg-gray-50 p-4 rounded-l-lg">
            <div className="space-y-2">
                <button
                    onClick={() => onTabChange('info')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'info'
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    General
                </button>
                <button
                    onClick={() => onTabChange('password')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'password'
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Password
                </button>
                {canDelete && (
                    <button
                        onClick={() => onTabChange('delete')}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'delete'
                                ? 'bg-red-100 text-red-700 font-medium'
                                : 'text-red-600 hover:bg-red-100'
                            }`}
                    >
                        Delete User
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserEditSubMenu;