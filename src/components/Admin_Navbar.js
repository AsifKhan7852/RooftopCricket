import React, { useState } from 'react';
import './Admin_Navbar.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin_Navbar(props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminsignin');
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="admin_navbar_wrapper" style={{ backgroundColor: props.bc }}>
            <div className="admin_navbar_container">
                <button className="hamburger_menu" onClick={toggleMobileMenu}>
                    ☰
                </button>
                <div className={`admin_navbar_text ${isMobileMenuOpen ? 'mobile_menu_open' : ''}`}>
                    <Link to="/admin_home_page" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>

                    <div className="admin_navbar_dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="admin_navbar_dropbtn">
                            Manage Bookings ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="admin_navbar_dropdown_content">
                                <Link to="/admin_manage_available" onClick={() => setIsMobileMenuOpen(false)}>Manage available slots</Link>
                                <Link to="/admin_book_slot" onClick={() => setIsMobileMenuOpen(false)}>Book a new slot</Link>
                                <Link to="/admin_manage_booked" onClick={() => setIsMobileMenuOpen(false)}>Manage booked slots</Link>
                            </div>
                        )}
                    </div>

                    <Link to='/manage_customer' onClick={() => setIsMobileMenuOpen(false)}>Manage Customers</Link>
                    <Link to='/create_slot' onClick={() => setIsMobileMenuOpen(false)}>Create Slots</Link>
                    <Link to='/view_reports' onClick={() => setIsMobileMenuOpen(false)}>View Reports</Link>

                    <div className="admin_navbar_account_dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="admin_navbar_account_dropbtn">
                            Account Setting ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="admin_navbar_account_dropdown_content">
                                <Link to="/admin_edit_profile1" onClick={() => setIsMobileMenuOpen(false)}>Edit Profile</Link>
                                <Link to="/" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}