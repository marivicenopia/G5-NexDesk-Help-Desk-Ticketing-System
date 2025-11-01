import React from 'react';
import warningSign from '../../../assets/warning_sign.png';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    loading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Yes, Delete',
    loading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Dimmed background */}
            <div
                className="absolute inset-0 backdrop-blur-sm bg-white bg-opacity-10"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white max-w-md w-full mx-auto p-6 rounded-lg shadow-xl z-10 flex flex-col items-center justify-center text-center">
                <img src={warningSign} alt="Warning" className="w-16 h-16 mb-4" />
                <h4 className="text-xl font-bold mb-3 text-gray-900">{title}</h4>
                <p className="mb-6 text-sm text-gray-600 leading-relaxed">
                    {message}
                    <br />
                    This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 font-medium px-4 py-2 text-sm cursor-pointer disabled:opacity-50 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ color: "#0B1215" }}
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 text-white font-medium px-4 py-2 hover:bg-red-700 text-sm cursor-pointer disabled:opacity-50 rounded-lg transition-colors"
                        style={{ backgroundColor: "#FF0000" }}
                    >
                        {loading ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;