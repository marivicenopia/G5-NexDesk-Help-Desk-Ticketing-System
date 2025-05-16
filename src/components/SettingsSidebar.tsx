import React, { useState, useEffect } from 'react';
import './SettingsSidebar.css';

interface SettingsSidebarProps {
    userEmail: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ userEmail }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [name, setName] = useState('');

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        fetch(`http://localhost:3001/users?email=${userEmail}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const user = data[0];
                    setName(user.name);
                }
            })
            .catch((err) => {
                console.error('Error fetching user:', err);
            });
    }, [userEmail]);


    return (
        <div className={`settings-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="user-section">
                    <div className="user-info">
                        <div className="initials">N</div>
                        {!isCollapsed && (
                            <div className="user-details">
                                <div className="name" >{name} </div>
                            </div>
                        )}
                    </div>
                    <button className="collapse-btn" onClick={toggleCollapse}>
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <nav className="nav-menu">
                    <a href="#">Profile</a>
                    <a href="/">Log out</a>
                </nav>
            )}
        </div>
    );
};

export default SettingsSidebar;
