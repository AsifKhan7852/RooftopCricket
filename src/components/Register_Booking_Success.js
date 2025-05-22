import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Register_Booking_Success.css';

const Register_Booking_Success = (props) => {
    const [message, setMessage] = useState('Processing your booking...');
    const [status, setStatus] = useState('processing'); // 'processing', 'success', or 'error'
    const location = useLocation();
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (hasVerified.current) return;
            hasVerified.current = true;

            const params = new URLSearchParams(location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                setMessage('Invalid payment session. Please try again.');
                setStatus('error');
                return;
            }

            try {
                const backendUrl = props.ngrok_url || 'http://localhost:5165';
                const response = await fetch(`${backendUrl}/api/Payment/verify-and-book`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId })
                });

                let result;
                try {
                    result = await response.json();
                } catch (jsonError) {
                    console.error('JSON parsing error:', jsonError);
                    throw new Error('Invalid server response. Please contact support.');
                }

                if (response.ok) {
                    setMessage(result.message || 'Booking confirmed successfully!');
                    setStatus('success');
                    setTimeout(() => navigate('/register_home_page'), 3000);
                } else {
                    setMessage(result.message || 'Booking failed. Please contact support.');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setMessage(error.message || 'Error processing booking. Please contact support.');
                setStatus('error');
            }
        };

        verifyPayment();
    }, [location, navigate, props.ngrok_url]);

    return (
        <div className="rbs-container">
            <div className="rbs-card">
                {status === 'processing' && (
                    <div className="rbs-processing">
                        <div className="rbs-spinner"></div>
                        <h2 className="rbs-title">{message}</h2>
                        <p className="rbs-text">Please wait while we confirm your booking</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="rbs-success">
                        <div className="rbs-success-icon">
                            <svg className="rbs-icon" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="rbs-title">Booking Confirmed!</h2>
                        <p className="rbs-text">{message}</p>
                        <div className="rbs-redirect">
                            <div className="rbs-progress-bar">
                                <div className="rbs-progress-fill"></div>
                            </div>
                            <p className="rbs-redirect-text">Redirecting to home page...</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="rbs-error">
                        <div className="rbs-error-icon">
                            <svg className="rbs-icon" viewBox="0 0 24 24">
                                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 className="rbs-title">Booking Failed</h2>
                        <p className="rbs-text">{message}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="rbs-button"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register_Booking_Success;