import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./User_Signup.css";
import img1 from "../Images/user_signup.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function User_Signup(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) return setError("Name is required");
    if (!email) return setError("Email is required");
    if (!emailRegex.test(email)) return setError("Invalid email format");
    if (!phoneNo) return setError("Phone number is required");
    if (!/^\d{11}$/.test(phoneNo)) return setError("Phone number must be exactly 11 digits");
    if (!password) return setError("Password is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) return setError("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) return setError("Password must contain at least one lowercase letter");
    if (!/\d/.test(password)) return setError("Password must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return setError("Password must contain at least one special character");
    if (password !== confirmPassword) return setError("Passwords do not match");

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Email", email);
    formData.append("PhoneNo", phoneNo);
    formData.append("Password", password);

    setLoading(true);
    try {
      const response = await fetch(`${props.ngrok_url}/api/RegisteredUser/signup`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert("Signup Successful! Redirecting to login...");
        navigate("/user_signin");
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Error connecting to server");
    }
  };

  return (
    <div className="signup_container">
      <div className="signup_left_panel">
        <h2>Get Started Now</h2>
        <form className="signup_form" onSubmit={handleSignup}>
          <label>Name</label>
          <br />
          <input type="text" placeholder="Enter your name" size={55} value={name} onChange={(e) => setName(e.target.value)} required />
          <br /><br />

          <label>Email address</label>
          <br />
          <input type="email" placeholder="Enter your email address" size={55} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <br /><br />

          <label>Phone number</label>
          <br />
          <input type="text" placeholder="Enter your phone number" size={55} value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
          <br /><br />

          <label>Password</label>
          <br />
          <div className="password_container">
            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" size={55} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="password_toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <br />

          <label>Confirm Password</label>
          <br />
          <div className="password_container">
            <input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" size={55} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <span className="password_toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <br />

          <input type="checkbox" required />
          <label>I agree to the terms & policy</label>
          <br />

          <button type="submit" disabled={loading}>
            {loading ? <div className="dual-ring-spinner"></div> : "Signup"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="signup_or_separator">
          <hr />
          <h4>or</h4>
          <hr />
        </div>
        <div className="signup_login_prompt">
          <p>Have an account?</p>
          <Link to="/user_signin">Sign in</Link>
        </div>
      </div>

      <div className="signup_right_panel">
        <img src={img1} alt="Signup" className="animated_image" />
      </div>
    </div>
  );
}
