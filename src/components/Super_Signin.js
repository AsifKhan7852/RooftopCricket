import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Super_Signin.css';
import img1 from '../Images/admin_signin.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Super_Signin({ ngrok_url }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const sendOtp = async (email) => {
        try {
            const response = await fetch(
                `${ngrok_url}/api/otp/send?Email=${encodeURIComponent(email)}`,
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
            return data.otp;
        } catch (error) {
            console.error('Error sending OTP:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${ngrok_url}/api/SuperAdmin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                const otp = await sendOtp(email);
                if (otp) {
                    const superadmin = {
                        token: data.token,
                        email: email,
                    };
                    localStorage.setItem('superadmin', JSON.stringify(superadmin));
                    navigate('/super_signin_otp', { state: { otp } });
                } else {
                    setError('Failed to send OTP. Please try again.');
                }
            } else {
                setError(data?.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="supersignin-container">
            <div className="supersignin-image">
                <img src={img1} alt="" className="floating-image" />
            </div>
            <div className="supersignin-content">
                <h2>Welcome back!</h2>
                <p>Enter your Credentials to access your account</p>
                {error && <div className="supersignin-error">{error}</div>}
                <form onSubmit={handleSubmit} className="supersignin-form">
                    <label htmlFor="email">Email address or Phone No</label>
                    <br />
                    <input
                        type="text"
                        id="email"
                        placeholder="Enter your email address or phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size={55}
                        required
                    />
                    <br /><br />
                    <div className="supersignin-password-header">
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="supersignin-password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size={55}
                            required
                        />
                        <span
                            className="supersignin-eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <br /><br />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <div className="dual-ring-spinner"></div> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
