import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Register_Edit_Profile.css';
import img1 from "../Images/user_signup.png";

export default function Register_Edit_Profile(props) {
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("User")) || {};
    const token = storedUser.Token;

    const [name, setName] = useState(storedUser.Name || "");
    const [email, setEmail] = useState(storedUser.Email || "");
    const [phoneNo, setPhoneNo] = useState(storedUser.PhoneNo || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        if (!storedUser.UserId || !token) {
            navigate("/user_signin");
        }
    }, []);

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeSlashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");
        setMessageType("");

        if (!storedUser.UserId || !token) {
            setMessage("Authentication error! Please log in again.");
            setMessageType("error");
            return;
        }

        let validationErrors = {};

        if (!/^\d{11}$/.test(phoneNo)) {
            validationErrors.phoneNo = "Phone number must be exactly 11 digits.";
        }

        if (password) {
            if (password.length <= 8) {
                validationErrors.password = "Password must be greater than 8 characters.";
            } else if (!/[A-Z]/.test(password)) {
                validationErrors.password = "Password must include at least one capital letter.";
            } else if (!/[a-z]/.test(password)) {
                validationErrors.password = "Password must include at least one small letter.";
            } else if (!/\d/.test(password)) {
                validationErrors.password = "Password must include at least one number.";
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                validationErrors.password = "Password must include at least one special character.";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append("UserId", storedUser.UserId);
        formData.append("Name", name);
        formData.append("Email", email);
        formData.append("PhoneNo", phoneNo);
        formData.append("Password", password);

        setLoading(true); // Start loading

        try {
            const response = await fetch(
                `${props.ngrok_url}/api/RegisteredUser/updateprofile/${storedUser.UserId}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.text();

            if (response.ok) {
                setMessage(data.message || "Profile Updated Successfully!");
                setMessageType("success");

                localStorage.setItem("User", JSON.stringify({
                    ...storedUser,
                    Name: name,
                    Email: email,
                    PhoneNo: phoneNo,
                    Token: token
                }));

                setTimeout(() => {
                    navigate("/Register_Home_Page");
                }, 2000);
            } else {
                setMessage(data || "Update failed. Try again.");
                setMessageType("error");
            }
        } catch (err) {
            setMessage("Error connecting to server");
            setMessageType("error");
        }

        setLoading(false); // Stop loading
    };

    return (
        <div className="useredit_container">
            <div className="useredit_form_section">
                <h2>Update Your Profile</h2>
                <form className="useredit_form" onSubmit={handleUpdate}>
                    <label>Name</label><br />
                    <input type="text" placeholder="Enter your name" size={55} value={name} onChange={(e) => setName(e.target.value)} required /><br /><br />

                    <label>Email address</label><br />
                    <input type="email" placeholder="Enter your email address" size={55} value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />

                    <label>Phone number</label><br />
                    <input type="text" placeholder="Enter your phone number" size={55} value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                    {errors.phoneNo && <p className="error-message">{errors.phoneNo}</p>}
                    <br /><br />

                    <label>Password</label><br />
                    <div className="password-wrapper">
                        <input
                            className="password-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password(Optional)"
                            size={55}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </span>
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    <br /><br />

                    <button type="submit" disabled={loading}>
                        {loading ? <div className="dual-ring-loader"></div> : "Update"}
                    </button>
                </form>

                {message && (
                    <p className={`useredit_message-box ${messageType}`}>
                        {message}
                    </p>
                )}
            </div>

            <div className="useredit_image_section">
                <img src={img1} alt="Signup" />
            </div>
        </div>
    );
}
