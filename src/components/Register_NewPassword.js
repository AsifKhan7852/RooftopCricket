import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import vsignin from '../Images/vsignin.png';
import './Register_NewPassword.css';

export default function Register_NewPassword(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    // Password validation
    if (newPassword.length <= 8) {
      setError("Password must be greater than 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must include at least one capital letter.");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError("Password must include at least one small letter.");
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError("Password must include at least one number.");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError("Password must include at least one special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/RegisteredUser/resetpassword/${encodeURIComponent(email)}?newpassword=${encodeURIComponent(newPassword)}`,
        {
          method: "POST",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text);
      }

      setSuccess("Password updated successfully!");
      setError("");

      setTimeout(() => {
        navigate("/user_signin");
      }, 1500);

    } catch (err) {
      setError("Failed to update password: " + err.message);
      setSuccess("");
    }
  };

  return (
    <div className="newpass-container">
      <div className="newpass-left">
        <img src={vsignin} alt="Player Illustration" className="newpass-image" />
      </div>
      <div className="newpass-right">
        <h1 className="newpass-heading">Set a new Password</h1>
        <div className="newpass-input-group">
          <p className="newpass-subtext">
            Create a new password. Ensure it differs from previous ones for security.
          </p>
          <div className="password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="newpass-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="newpass-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
        </div>
        <button className="newpass-button" onClick={handleUpdatePassword}>
          Update Password
        </button>
        {success && <p className="newpass-success">{success}</p>}
        {error && <p className="newpass-error">{error}</p>}
      </div>
    </div>
  );
}