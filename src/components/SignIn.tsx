import React from 'react';
import { useState } from 'react';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { MdOutlineLock } from 'react-icons/md';
import './SignIn.css';
import users from '../data/users.json';
import SignInModal from './SignInModal';
{/* To use React-Icons - npm install react-icons*/ }

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const user = users.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            setError('');
            setShowModal(true);
        } else {
            setError('Invalid email or password');
            setEmail('');
            setPassword('');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="signin-container">
            <div className="signin-left">
                <h1 className="main-title"><strong>N</strong>   Help Desk Ticketing System</h1>
                <h1 className="title">Sign in</h1>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <MdOutlineAlternateEmail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div className="input-group">
                        <MdOutlineLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="signin-button">SIGN IN</button>
                </form>
                {showModal && (
                    <SignInModal message="✅ Login Successful!" onClose={handleCloseModal} />
                )}
            </div>
            <div className="signin-right">
                <h2>Welcome Back!</h2>
                <p>To keep connected with us please sign in with your email address and password</p>
            </div>
        </div>
    );
};

export default SignIn;
