import React, { useState } from 'react';
import './Register_Navbar.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Register_Navbar(props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("User")) || {};
    const token = storedUser.Token;

    const handleDeleteAccount = async () => {
        if (!storedUser.UserId || !token) {
            alert("User not found! Please log in again.");
            navigate("/");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${props.ngrok_url}/api/RegisteredUser/delete/${storedUser.UserId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Account deleted successfully!");
                localStorage.removeItem("User");
                navigate("/");
            } else {
                const data = await response.json();
                alert(data.message || "Failed to delete account. Please try again.");
            }
        } catch (error) {
            alert("Error connecting to server. Please try again later.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("User");
        navigate("/");
    };

    const openWhatsAppChat = () => {
        const phoneNumber = '+923015317852';
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');
    };

    return (
        <div className="register_navbar_wrapper" style={{backgroundColor:props.bc}}>
            <div className="register_navbar_container">
                <div className='register_navbar_text'>
                    <Link to='/register_home_page'>Home</Link>
                    <Link to='/book_rooftop'>Book Roof-Top</Link>
                    <Link to='/mybooking'>My Bookings</Link>
                    <Link to='/faq'>View FAQ Sec</Link>
                    <Link to='/aboutus'>About us</Link>
                    <Link to='#' onClick={openWhatsAppChat} style={{ cursor: 'pointer' }}>Help Center</Link>
                    <div className="register_navbar_dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="register_navbar_dropbtn">
                            Account Setting ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="register_navbar_dropdown_content">
                                <Link to="/user_edit_profile">Edit Profile</Link>
                                <Link to='#' onClick={handleDeleteAccount} className="register_navbar_dropdown_delete">Delete Account</Link>
                                <Link to='/' onClick={handleLogout} className="register_navbar_dropdown_logout">Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
