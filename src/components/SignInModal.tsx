import React from 'react';
import './SignInModal.css';

interface SignInModalProps {
    message: string;
    onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SignInModal;
