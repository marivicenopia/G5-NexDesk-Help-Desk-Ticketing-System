import React, { useEffect, useState } from "react";
import { UserService } from "../../../services/users/UserService";

const SettingsGeneral: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [editData, setEditData] = useState({ firstname: "", lastname: "", username: "", email: "" });
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const data = await UserService.getById(userId);
                    setUser(data);
                    setEditData({
                        firstname: data.firstname || "",
                        lastname: data.lastname || "",
                        username: data.username || "",
                        email: data.email || "",
                    });
                } catch {
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, []);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

const handleSaveGeneral = async () => {
    if (!user) return;
    try {
        // Merge all user fields, only overwrite those in editData
        const updatedUser = { ...user, ...editData };
        await UserService.update(user.id, updatedUser);
        setUser(updatedUser);
        setSuccessMsg("Profile updated!");
        setTimeout(() => setSuccessMsg(""), 2000);
    } catch {
        setSuccessMsg("Failed to update profile.");
        setTimeout(() => setSuccessMsg(""), 2000);
    }
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