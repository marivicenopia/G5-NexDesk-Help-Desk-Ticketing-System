import React, { useEffect, useState } from "react";
import { AuthService } from "../../../services/auth/AuthService";

const SettingsGeneral: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [editData, setEditData] = useState({ firstname: "", lastname: "", username: "", email: "" });
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const stored = AuthService.getStoredUser();
            if (stored) {
                const data = await AuthService.getCurrentUser(Number(stored.id));
                setUser(data);
                setEditData({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    username: data.username,
                    email: data.email,
                });
            }
        };
        fetchUser();
    }, []);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSaveGeneral = async () => {
        if (!user) return;
        await AuthService.updateUser(user.id, editData);
        setSuccessMsg("Profile updated!");
        setTimeout(() => setSuccessMsg(""), 2000);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="firstname" className="block text-base font-medium mb-1">
                        First Name
                    </label>
                    <input
                        id="firstname"
                        name="firstname"
                        value={editData.firstname}
                        onChange={handleEditChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="First Name"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-base font-medium mb-1">
                        Last Name
                    </label>
                    <input
                        id="lastname"
                        name="lastname"
                        value={editData.lastname}
                        onChange={handleEditChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Last Name"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-base font-medium mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Username"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-base font-medium mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Email"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSaveGeneral}
                    className="mt-6 bg-[#031849] text-white px-4 py-2 hover:bg-blue-700"
                    style={{ borderRadius: "9.66px" }}
                >
                    Save Changes
                </button>
            </div>
            {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        </div>
    );
};

export default SettingsGeneral;