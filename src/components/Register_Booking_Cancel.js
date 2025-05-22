import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register_Booking_Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold">Payment Cancelled</h2>
            <p className="mt-2">Your payment was cancelled. Please try again.</p>
            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
                Return to Home
            </button>
        </div>
    );
};

export default Register_Booking_Cancel;