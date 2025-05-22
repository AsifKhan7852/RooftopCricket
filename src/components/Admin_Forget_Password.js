import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin_Forget_Password.css';
import rolepic from '../Images/rolepic.png';

export default function Admin_Forget_Password(props) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        setMessage("");
        setError("");

        if (!email) {
            setError("Please enter an email.");
            return;
        }

        try {
            const response = await fetch(
                `${props.ngrok_url}/api/otp/send?Email=${encodeURIComponent(email)}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send reset email.");
            }

            const data = await response.json();
            console.log("Reset email response:", data);
            setMessage("Reset instructions sent to your email.");

            // Redirect to OTP page with email and otp
            navigate("/admin_forget_otp", { state: { email, otp: data.otp } });
        } catch (err) {
            console.error("Error sending reset email:", err);
            setError("Could not send reset email. Try again.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Forgot Password?</h2>
                <p>Please enter your email to reset the password</p>
                <label>Email address</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="reset-button" onClick={handleResetPassword}>
                    Reset Password
                </button>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="image-section">
                <img src={rolepic} alt="Cricket Player" />
            </div>
        </div>
    );
}
