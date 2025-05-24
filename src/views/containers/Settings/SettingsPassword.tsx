import React, { useEffect, useState } from "react";
import { UserService } from "../../../services/users/UserService";

const SettingsPassword: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [passwordError, setPasswordError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setSuccessMsg("");
        if (passwords.new !== passwords.confirm) {
            setPasswordError("New password and confirm password do not match.");
            return;
        }
        if (!user) return;
        if (passwords.current !== user.password) {
            setPasswordError("Current password is incorrect.");
            return;
        }
        try {
            await UserService.update(user.id, { password: passwords.new });
            setSuccessMsg("Password updated!");
            setPasswords({ current: "", new: "", confirm: "" });
        } catch {
            setPasswordError("Failed to update password.");
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <form onSubmit={handlePasswordChange} className="space-y-3">
                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                {passwordError && <div className="text-red-600">{passwordError}</div>}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-[#031849] text-white px-4 py-2 rounded hover:bg-blue-700 mt-5"
                        style={{ borderRadius: "9.66px" }}
                    >
                        Change Password
                    </button>
                </div>
                {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
            </form>
        </div>
    );
};

export default SettingsPassword;