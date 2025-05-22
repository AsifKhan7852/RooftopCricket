import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Super_Signin_OTP.css';
import otpImage from '../Images/otpimage.png';
import otpHand from '../Images/otphand.png';

export default function Super_Signin_OTP(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const adminsignin = JSON.parse(localStorage.getItem('superadmin'));
    const email = adminsignin?.email || '';
    const [otp, setOtp] = useState(location.state?.otp || '');
    const [digit1, setDigit1] = useState('');
    const [digit2, setDigit2] = useState('');
    const [digit3, setDigit3] = useState('');
    const [digit4, setDigit4] = useState('');
    const [error, setError] = useState('');

    // Create refs to handle focus
    const input1 = useRef(null);
    const input2 = useRef(null);
    const input3 = useRef(null);
    const input4 = useRef(null);

    const maskEmail = (email) => {
        if (!email) return '';
        const [local, domain] = email.split('@');
        const maskedLocal = local[0] + '*'.repeat(local.length - 1);
        return `${maskedLocal}@${domain}`;
    };

    const handleChange = (e, setDigit, nextInputRef) => {
        const val = e.target.value;
        if (/^[0-9]?$/.test(val)) {
            setDigit(val);
            if (val && nextInputRef) {
                nextInputRef.current.focus();
            }
        }
    };

    const sendOtp = async () => {
        if (!email) {
            console.error('Email not found');
            setError('Email not found');
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
            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }
            const data = await response.json();
            console.log(data.message);
            setOtp(data.otp);
            setError('');
        } catch (error) {
            console.error('Error sending OTP:', error);
            setError('Failed to resend OTP. Please try again.');
        }
    };

    const verifyOtp = () => {
        const enteredOtp = digit1 + digit2 + digit3 + digit4;
        if (enteredOtp === otp) {
            console.log('OTP verified successfully');
            navigate('/super_home_page');
        } else {
            setError('Invalid OTP');
            console.log('Invalid OTP');
        }
    };

    return (
        <div className="super-otp-container">
            <div className="super-otp-left-panel">
                <img src={otpImage} alt="Cricket Player" />
            </div>
            <div className="super-otp-right-panel">
                <div className="super-otp-card">
                    <div className="super-otp-hand">
                        <img src={otpHand} alt="Hand with Phone" />
                    </div>
                    <div className="super-otp-content">
                        <h2>OTP Verification</h2>
                        <p>Enter the OTP sent to {maskEmail(email)}</p>
                        <div className="super-otp-input-group">
                            <input
                                type="text"
                                maxLength="1"
                                value={digit1}
                                onChange={(e) => handleChange(e, setDigit1, input2)}
                                ref={input1}
                                autoFocus
                            />
                            <input
                                type="text"
                                maxLength="1"
                                value={digit2}
                                onChange={(e) => handleChange(e, setDigit2, input3)}
                                ref={input2}
                            />
                            <input
                                type="text"
                                maxLength="1"
                                value={digit3}
                                onChange={(e) => handleChange(e, setDigit3, input4)}
                                ref={input3}
                            />
                            <input
                                type="text"
                                maxLength="1"
                                value={digit4}
                                onChange={(e) => handleChange(e, setDigit4, null)}
                                ref={input4}
                            />
                        </div>
                        {error && <p className="super-otp-error">{error}</p>}
                        <button className="super-otp-verify-btn" onClick={verifyOtp}>Verify</button>
                        <br />
                        <button className="super-otp-resend-btn" onClick={sendOtp}>Resend OTP</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
