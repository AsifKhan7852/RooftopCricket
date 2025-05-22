import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import vsignin from '../Images/vsignin.png';
import './Admin_Forget_OTP.css';

export default function Admin_Forget_OTP(props) {
  const { state } = useLocation();
  const { email, otp: initialOtp } = state || {};
  const [otp, setOtp] = useState(initialOtp);
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode === otp) {
      setSuccess("OTP Verified Successfully!");
      setError("");

      setTimeout(() => {
        navigate("/admin_newpassword", { state: { email } });
      }, 1500);
    } else {
      setError("Invalid OTP. Please try again.");
      setSuccess("");
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch(
        `${props.ngrok_url}/api/otp/send?Email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend OTP.");
      }

      const data = await response.json();
      console.log("Resent OTP:", data);
      setOtp(data.otp);
      setSuccess("New OTP sent to your email.");
      setError("");
      setCode(['', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Could not resend OTP. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="admin-otp-wrapper">
      <div className="admin-otp-left">
        <img src={vsignin} alt="Player Illustration" className="admin-otp-image" />
      </div>
      <div className="admin-otp-right">
        <h1 className="admin-otp-title">Check your Email</h1>
        <p className="admin-otp-description">
          We sent a reset link to <strong>{email}</strong>.<br />
          Enter the 4-digit code mentioned in the email.
        </p>
        <div className="admin-otp-input-group">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="admin-otp-input"
            />
          ))}
        </div>
        <button className="admin-otp-btn-verify" onClick={handleVerify}>
          Verify Code
        </button>
        <button className="admin-otp-btn-resend" onClick={handleResend}>
          Resend Code
        </button>
        {success && <p className="admin-otp-success">{success}</p>}
        {error && <p className="admin-otp-error">{error}</p>}
      </div>
    </div>
  );
}
