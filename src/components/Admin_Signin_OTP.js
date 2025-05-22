import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Admin_Signin_OTP.css';
import otpImage from '../Images/otpimage.png';
import otpHand from '../Images/otphand.png';

export default function Admin_Signin_OTP(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const adminsignin = JSON.parse(localStorage.getItem('adminsignin'));
    const email = adminsignin?.admin?.email || '';
    const [otp, setOtp] = useState(location.state?.otp || '');
    const [digit1, setDigit1] = useState('');
    const [digit2, setDigit2] = useState('');
    const [digit3, setDigit3] = useState('');
    const [digit4, setDigit4] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);

    const maskEmail = (email) => {
        if (!email) return '';
        const [local, domain] = email.split('@');
        const maskedLocal = local[0] + '*'.repeat(local.length - 1);
        return `${maskedLocal}@${domain}`;
    };

    const sendOtp = async () => {
        if (!email) {
            console.error('Email not found');
            setError('Email not found');
            setSuccessMessage('');
            return;
        }
        try {
            const response = await fetch(
                `${props.ngrok_url}/api/otp/send?Email=${encodeURIComponent(email)}`,
                {
                    method: 'POST',
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                    },
                }
            );
            if (!response.ok) throw new Error('Failed to send OTP');
            const data = await response.json();
            console.log(data.message);
            setOtp(data.otp);
            setError('');
            setSuccessMessage('OTP sent successfully!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            setError('Failed to resend OTP. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleChange = (e, setDigit, nextRef) => {
        const value = e.target.value.replace(/\D/g, '');
        setDigit(value);
        if (value && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    const verifyOtp = () => {
        const enteredOtp = digit1 + digit2 + digit3 + digit4;
        if (enteredOtp === otp) {
            console.log('OTP verified successfully');
            navigate('/admin_home_page');
        } else {
            setError('Invalid OTP');
            console.log('Invalid OTP');
            setSuccessMessage('');
        }
    };

    return (
        <div className="admin-signin-otp-container">
            <div className="admin-signin-otp-left">
                <img src={otpImage} alt="Cricket Player" />
            </div>
            <div className="admin-signin-otp-right">
                <div className="admin-signin-otp-box">
                    <div className="admin-signin-otp-hand-wrapper">
                        <img src={otpHand} alt="Hand with Phone" />
                    </div>
                    <div className="admin-signin-otp-details">
                        <h2>OTP Verification</h2>
                        <p>Enter the OTP sent to {maskEmail(email)}</p>
                        <div className="admin-signin-otp-input-group">
                            <input
                                maxLength="1"
                                value={digit1}
                                onChange={(e) => handleChange(e, setDigit1, inputRef2)}
                                ref={inputRef1}
                            />
                            <input
                                maxLength="1"
                                value={digit2}
                                onChange={(e) => handleChange(e, setDigit2, inputRef3)}
                                ref={inputRef2}
                            />
                            <input
                                maxLength="1"
                                value={digit3}
                                onChange={(e) => handleChange(e, setDigit3, inputRef4)}
                                ref={inputRef3}
                            />
                            <input
                                maxLength="1"
                                value={digit4}
                                onChange={(e) => handleChange(e, setDigit4, null)}
                                ref={inputRef4}
                            />
                        </div>
                        {error && <p className="admin-signin-otp-error">{error}</p>}
                        <button className="admin-signin-otp-verify-btn" onClick={verifyOtp}>Verify</button>
                        <br />
                        <button className="admin-signin-otp-resend-btn" onClick={sendOtp}>Resend OTP</button>
                        {successMessage && <p className="admin-signin-otp-success">{successMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
