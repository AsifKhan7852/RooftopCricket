import React, { useState } from 'react';
import './Admin_Navbar.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin_Navbar(props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminsignin');
        navigate('/');
    };

    return (
        <div className="admin_navbar_wrapper" style={{backgroundColor:props.bc}}>
            <div className="admin_navbar_container">
                <div className='admin_navbar_text'>
                    <Link to="/admin_home_page">Home</Link>

                    <div className="admin_navbar_dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="admin_navbar_dropbtn">
                            Manage Bookings ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="admin_navbar_dropdown_content">
                                <Link to="/admin_manage_available">Manage available slots</Link>
                                <Link to="/admin_book_slot">Book a new slot</Link>
                                <Link to="/admin_manage_booked">Manage booked slots</Link>
                            </div>
                        )}
                    </div>

                    <Link to='/manage_customer'>Manage Customers</Link>
                    <Link to='/create_slot'>Create Slots</Link>
                    <Link to='/view_reports'>View Reports</Link>

                    <div className="admin_navbar_account_dropdown">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="admin_navbar_account_dropbtn">
                            Account Setting ▼
                        </button>
                        {isDropdownOpen && (
                            <div className="admin_navbar_account_dropdown_content">
                                <Link to="/admin_edit_profile1">Edit Profile</Link>
                                <Link to="/" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
