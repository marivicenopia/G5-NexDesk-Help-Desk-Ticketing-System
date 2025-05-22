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
            <h3 className="text-lg font-semibold mb-2">General</h3>
            <div className="space-y-3">
                <input
                    name="firstname"
                    value={editData.firstname}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="First Name"
                />
                <input
                    name="lastname"
                    value={editData.lastname}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Last Name"
                />
                <input
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Username"
                />
                <input
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Email"
                />
            </div>
            <button
                onClick={handleSaveGeneral}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Save Changes
            </button>
            {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        </div>
    );
};

export default SettingsGeneral;