import React, { useEffect } from 'react';
import './Admin_Home_Page.css';
import { useNavigate } from 'react-router-dom';
import img3 from '../Images/admin_body.png';
import img4 from '../Images/bottom-bar2.png';
import img5 from '../Images/bottom-bar1.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Home_Page() {
 const navigate = useNavigate();
    useEffect(() => {

     const gettoken = localStorage.getItem('adminsignin'); // or sessionStorage.getItem('token')
        if (!gettoken) {
            navigate('/');
            return;
        }

        // Block back button
        const handlePopState = (e) => {
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return (
        <div className='amain'>
            <Admin_Navbar />
            <div className="abody">
                <div className="abody_text">
                    <p className="game-on-text" style={{ fontFamily: 'Rogbold' }}>
                        <span className="game">Game</span>{' '}
                        <span className="on">On</span>{' '}
                        <span className="above">Above</span>{' '}
                        <span className="the">The</span>{' '}
                        <span className="city">City</span>
                    </p>
                    <p className='aexplore' style={{ fontFamily: 'Rogbold' }}>Rooftop Cricket</p>
                </div>
                <div className="abody_img">
                    <img src={img3} alt="" className="animated-img" />
                </div>
            </div>

            <div className="avisitor_footor">
                <img src={img4} alt="" />
                <img src={img5} alt="" />
            </div>
        </div>
    );
}