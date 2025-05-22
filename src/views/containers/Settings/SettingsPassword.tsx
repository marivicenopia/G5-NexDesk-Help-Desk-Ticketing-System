import React, { useEffect, useState } from "react";
import { AuthService } from "../../../services/auth/AuthService";

const SettingsPassword: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [passwordError, setPasswordError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const stored = AuthService.getStoredUser();
            if (stored) {
                const data = await AuthService.getCurrentUser(Number(stored.id));
                setUser(data);
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
        await AuthService.updateUser(user.id, { password: passwords.new });
        setSuccessMsg("Password updated!");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
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
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Change Password
                </button>
                {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
            </form>
        </div>
    );
};

export default SettingsPassword;