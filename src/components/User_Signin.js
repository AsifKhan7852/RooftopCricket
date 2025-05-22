import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./User_Signin.css";
import img1 from "../Images/vsignin.png";

export default function User_Signin(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/Register_Home_Page";
    const cart = location.state?.cart || [];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("Email", email);
        formData.append("Password", password);

        try {
            const response = await fetch(
                `${props.ngrok_url}/api/RegisteredUser/login`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const message = data?.message || "Invalid email or password";
                throw new Error(message);
            }

            if (Array.isArray(data) && data.length > 0) {
                const userData = data[0];
                localStorage.setItem("User", JSON.stringify(userData));
                navigate(from, { state: { cart } });
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const handleForgetPassword = () => {
        navigate("/Register_Forget_Password");
    };

    return (
        <div className="usign_container">
            <div className="usign_img_wrapper">
                <img src={img1} alt="Signin" />
            </div>
            <div className="usign_text_section">
                <h2>Welcome back!</h2>
                <p>Enter your Credentials to access your account</p>
                <br />
                <form className="usign_form" onSubmit={handleLogin}>
                    <label>Email address</label>
                    <br />
                    <input
                        type="text"
                        className="usign_input"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <br />
                    <label>Password</label>
                    <span className="usign_forget" onClick={handleForgetPassword}>
                       Forget password
                    </span>
                    <br />
                    <div className="usign_password_container">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="usign_input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="usign_toggle_password"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? <div className="dual-ring-spinner"></div> : "Login"}
                    </button>
                    <br />
                </form>

                {error && (
                    <div className="usign_message_box">
                        {error}
                    </div>
                )}

                <div className="usign_or">
                    <hr />
                    <h4>or</h4>
                    <hr />
                </div>
                <div className="usign_signup">
                    <p>Don't have an account?</p>
                    <Link to="/user_signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
