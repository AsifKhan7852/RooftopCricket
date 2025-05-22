import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Super_Home_Page.css';
import img3 from '../Images/SuperAdminBody.jpg';
import img4 from '../Images/bottom-bar2.png';
import img5 from '../Images/bottom-bar1.png';
import Super_Admin_Navbar from './Super_Admin_Navbar';

export default function Super_Home_Page() {

    const navigate = useNavigate();

    useEffect(() => {
        const gettoken = localStorage.getItem('superadmin'); // or sessionStorage.getItem('token')
        if (!gettoken) {
            navigate('/');
            return;
        }
        // Prevent back navigation
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return (
        <div className='superhome_main'>
            <Super_Admin_Navbar />
            <div className="superhome_body">
                <div className="superhome_text_section animated-text">
                    <p style={{ fontFamily: 'Rogbold' }}>Game On, Above The City</p>
                    <p className='superhome_subtitle' style={{ fontFamily: 'Rogbold' }}>Rooftop Cricket</p>
                </div>
                <div className="superhome_image_section">
                    <img src={img3} alt="Rooftop" className="animated-image" />
                </div>
            </div>

            <div className="superhome_footer">
                <img src={img4} alt="Footer Left" />
                <img src={img5} alt="Footer Right" />
            </div>
        </div>
    );
}