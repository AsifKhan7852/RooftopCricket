import React from 'react';
import './Super_Admin_Navbar.css';
import { useNavigate, Link } from 'react-router-dom';

export default function Super_Admin_Navbar(props) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('superadmin');
        navigate('/');
    };

    return (
        <div className="super_admin_navbar_wrapper"  style={{backgroundColor:props.bc}}>
            <div className="super_admin_navbar_container">
                <div className='super_admin_navbar_links'>
                    <Link to='/super_home_page'>Home</Link>
                    <Link to='/manage_rooftop'>Manage Rooftops</Link>
                    <Link to='/manage_user'>Manage Users</Link>
                    <Link to='/manage_faq'>Manage FAQs</Link>
                    <Link to='/manage_term'>Manage Terms & Conditions</Link>
                    <Link to='/manage_rooftop_registeration'>Rooftop Registrations</Link>
                    <Link to='/' onClick={handleLogout}>Logout</Link>
                </div>
            </div>
        </div>
    );
}
