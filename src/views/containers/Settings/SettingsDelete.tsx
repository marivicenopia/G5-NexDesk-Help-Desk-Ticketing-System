import React, { useEffect, useState } from "react";
import { UserService } from "../../../services/users/UserService";
import warningSign from "../../../assets/warning_sign.png";

const SettingsDelete: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const data = await UserService.getById(userId);
                    setUser(data);
                } catch {
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, []);

    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            await UserService.delete(user.id);
            localStorage.removeItem("userId");
            window.location.href = "/login";
        } catch (err) {
            // Optionally handle error
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            >
                Delete Account
            </button>

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Dimmed background */}
                    <div
                        className="absolute inset-0 backdrop-blur-sm bg-white bg-opacity-10"
                        onClick={() => setShowDeleteModal(false)}
                    ></div>
                    {/* Modal */}
                    <div className="relative bg-white max-w-md w-full mx-auto p-6 rounded-lg shadow-xl z-10 flex flex-col items-center justify-center text-center">
                        <img src={warningSign} alt="Warning" className="w-16 h-16 mb-4" />
                        <h4 className="text-xl font-bold mb-3 text-gray-900">Confirm Account Deletion</h4>
                        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                            Are you sure you want to delete your account?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 font-medium px-4 py-2 text-sm cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                style={{ color: "#0B1215" }}
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 text-white font-medium px-4 py-2 hover:bg-red-700 text-sm cursor-pointer rounded-lg transition-colors"
                                style={{ backgroundColor: "#FF0000" }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsDelete;