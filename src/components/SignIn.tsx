import React, { useState } from 'react';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { MdOutlineLock } from 'react-icons/md';
import './SignIn.css';
import SignInModal from './SignInModal';


interface SignInProps {
    onLoginSuccess: (email: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();

            const user = users.find(
                (u: any) => u.email === email && u.password === password
            );

            if (user) {
                setError('');
                onLoginSuccess(user.email);
                setShowModal(true);
            } else {
                setError('❌ Invalid email or password');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Error connecting to server.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="signin-container">
            <div className="signin-left">
                <h1 className="main-title"><strong>N</strong>   Help Desk Ticketing System</h1>
                <h2 className="title">Sign In</h2>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <MdOutlineAlternateEmail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <MdOutlineLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="signin-button">
                        SIGN IN
                    </button>
                </form>

                {showModal && (
                    <SignInModal message="✅ Login Successful!" onClose={handleCloseModal} />
                )}
            </div>
            <div className="signin-right">
                <h2>Welcome Back!</h2>
                <p>
                    To keep connected with us please sign in with your email address and password
                </p>
            </div>
        </div>
    );
};

export default SignIn;