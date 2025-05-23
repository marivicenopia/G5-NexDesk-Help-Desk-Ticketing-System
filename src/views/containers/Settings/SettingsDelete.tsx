import React, { useEffect, useState } from "react";
import { AuthService } from "../../../services/auth/AuthService";

const SettingsDelete: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const stored = AuthService.getStoredUser();
            if (stored) {
                const data = await AuthService.getCurrentUser(Number(stored.id));
                if (data) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, []);

    const handleDeleteAccount = async () => {
        if (!user) return;
        await fetch(`http://localhost:3001/users/${user.id}`, { method: "DELETE" });
        AuthService.logout();
        window.location.href = "/login";
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Delete Account</h3>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Delete Account
            </button>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h4 className="text-lg font-bold mb-4">Confirm Account Deletion</h4>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsDelete;