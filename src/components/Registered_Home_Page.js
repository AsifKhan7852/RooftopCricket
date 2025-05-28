import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registered_Home_Page.css';
import img3 from '../Images/registerbodyimage.png';
import img4 from '../Images/bottom-bar2.png';
import img5 from '../Images/bottom-bar1.png';
import Register_Navbar from './Register_Navbar';

export default function Registered_Home_Page() {
    const navigate = useNavigate();

    useEffect(() => {
        const gettoken = localStorage.getItem('User');
        if (!gettoken) {
            navigate('/');
            return;
        }

        // Disable browser back button
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="rmain">
            <Register_Navbar />
            <div className="rbody">
                <div className="rbody_text">
                    <p style={{ fontFamily: 'Rogbold' }}>Game On, Above The City</p>
                    <p className="rexplore" style={{ fontFamily: 'Rogbold' }}>Rooftop Cricket</p>
                </div>
                <div className="rbody_img">
                    <img src={img3} alt="Cricket" />
                </div>
            </div>

            <div className="rvisitor_footor">
                <img src={img4} alt="Bar 1" />
                <img src={img5} alt="Bar 2" />
            </div>
        </div>
    );
}