import React, { useState, useEffect } from 'react';
import './Settings.css';

interface Settings {
    userEmail: string;
}

const Settings: React.FC<Settings> = ({ userEmail }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/users?email=${userEmail}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0];
                    setName(user.name);
                    setUsername(user.username);
                    setEmail(user.email);
                    setPassword(user.password);
                    setUserId(user.id);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching user:', err);
                setLoading(false);
            });
    }, [userEmail]);

    const handleSave = () => {
        if (userId !== null) {
            fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, email, password }),
            })
                .then((res) => res.json())
                .then((updatedUser) => {
                    setName(updatedUser.name);
                    setUsername(updatedUser.username);
                    setEmail(updatedUser.email);
                    setPassword(updatedUser.password);
                    alert('Changes saved!');
                })
                .catch((err) => {
                    console.error('Error updating user:', err);
                });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="settings-container">
            <h1 className="title">Settings</h1>
            <p className="subtitle">Update your account settings</p>
            <div className="profile-section">
                <div className="profile-image-section">
                    <div className="profile-image">Your Image</div>
                    <button className="change-profile-btn">CHANGE PROFILE</button>
                </div>
                <div className="profile-form">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="save-btn" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;