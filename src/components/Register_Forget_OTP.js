import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import vsignin from '../Images/vsignin.png';
import './Register_Forget_OTP.css';

export default function Register_Forget_OTP(props) {
  const { state } = useLocation();
  const { email, otp: initialOtp } = state || {};
  const [otp, setOtp] = useState(initialOtp);
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
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
    setVerifying(true);
    const enteredCode = code.join('');
    setTimeout(() => {
      if (enteredCode === otp) {
        setSuccess("OTP Verified Successfully!");
        setError("");
        setTimeout(() => {
          navigate("/register_newpassword", { state: { email } });
        }, 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        setSuccess("");
      }
      setVerifying(false);
    }, 1000); // simulate delay, keep logic unchanged
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch(
        `${props.ngrok_url}/api/otp/send?Email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to resend OTP.");

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
    setResending(false);
  };

  return (
    <div className="forget-otp-container">
      <div className="forget-otp-left">
        <img src={vsignin} alt="Player Illustration" className="forget-otp-image" />
      </div>
      <div className="forget-otp-right">
        <h1 className="forget-otp-heading">Check your Email</h1>
        <p className="forget-otp-subtext">
          We sent a reset link to <strong>{email}</strong>.<br />
          Enter the 4-digit code mentioned in the email.
        </p>
        <div className="forget-otp-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="forget-otp-input"
            />
          ))}
        </div>
        <button
          className="forget-otp-verify-btn"
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? <div className="dual-ring"></div> : "Verify Code"}
        </button>
        <button
          className="forget-otp-resend-btn"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? <div className="dual-ring"></div> : "Resend Code"}
        </button>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
