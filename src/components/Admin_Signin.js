import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin_Signin.css';
import img1 from '../Images/admin_signin.png';

export default function Admin_Signin({ ngrok_url }) {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeSlashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

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
            if (!response.ok) throw new Error('Failed to send OTP');
            const data = await response.json();
            return data.otp;
        } catch (error) {
            console.error('Error sending OTP:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!emailOrPhone || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${ngrok_url}/api/RooftopAdmin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    Email: emailOrPhone,
                    Password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const otp = await sendOtp(emailOrPhone);
                if (otp) {
                    const adminsignin = {
                        admin: data.admin,
                        rooftops: data.rooftops,
                        token: data.token,
                    };
                    localStorage.setItem('adminsignin', JSON.stringify(adminsignin));
                    navigate('/admin_signin_otp', { state: { otp } });
                } else {
                    setError('Failed to send OTP. Please try again.');
                }
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('Error connecting to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgetPassword = () => {
        navigate('/admin_forget_password', { state: { email: emailOrPhone } });
    };

    return (
        <div className="admin-signin-container">
            <div className="admin-signin-image">
                <img src={img1} alt="Admin background" />
            </div>
            <div className="admin-signin-form-container">
                <h2>Welcome back!</h2>
                <p>Enter your Credentials to access your account</p>
                <br />
                <form onSubmit={handleLogin} className="admin-signin-form">
                    <label htmlFor="emailOrPhone">Email address or Phone No</label>
                    <br />
                    <input
                        type="text"
                        id="emailOrPhone"
                        placeholder="Enter your email address or phone number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        size={55}
                    />
                    <br /><br />
                    <label htmlFor="password">Password</label>
                    <span className="admin-forget-password" onClick={handleForgetPassword}>Forget password?</span>
                    <br />
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size={55}
                            className="password-input"
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </span>
                    </div>
                    {error && <div className="error-message-container"><p className="admin-error-message-new">{error}</p></div>}
                    <button type="submit" className="admin-login-button" disabled={loading}>
                        {loading ? <div className="dual-ring"></div> : "Login"}
                    </button>
                    <br />
                </form>
                <div className="admin-or-divider">
                    <hr />
                    <h4>or</h4>
                    <hr />
                </div>
                <div className="admin-signup-link">
                    <p>Don't have an account?</p>
                    <Link to="/admin_signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
