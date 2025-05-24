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
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Dimmed background */}
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    {/* Modal */}
                    <div className="relative bg-white w-96 h-96 p-10 rounded-[16px] shadow-lg z-10 flex flex-col items-center justify-center text-center">
                        <img src={warningSign} alt="Warning" className="w-32 h-32 mb-4" />
                        <h4 className="text-2xl font-bold mb-4">Confirm Account Deletion</h4>
                        <p className="mb-6 text-lg">
                            Are you sure you want to delete your account?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="font-bold px-5 py-2 text-lg cursor-pointer"
                                style={{ borderRadius: "15px", backgroundColor: "#EDEDED", color: "#0B1215" }}
                            >
                                No, Keep it.
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="text-white font-bold px-5 py-2 hover:bg-red-700 text-lg cursor-pointer"
                                style={{ borderRadius: "15px", backgroundColor: "#FF0000" }}
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