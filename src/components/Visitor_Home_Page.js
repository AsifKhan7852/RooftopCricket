import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Visitor_Home_Page.css';
import img1 from '../Images/aboutusbackground.png';
import img2 from '../Images/signinup.png';
import img3 from '../Images/visitorbody.jpg';
import img4 from '../Images/bottom-bar2.png';
import img5 from '../Images/bottom-bar1.png';

export default function Visitor_Home_Page() {
  useEffect(() => {
    // Add animation class to elements after component mounts
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
      el.classList.add('animate');
    });

    // Prevent back button from navigating to this page
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="main">
      <div className="visit_nav">
        <div className="aboutus animate-on-load">
          <img src={img1} alt="About Us Background" />
          <Link to="/aboutus" className="nav-link">About us</Link>
          <Link to="/faq" className="nav-link">View FAQ Sec</Link>
        </div>
        <div className="signin animate-on-load">
          <img src={img2} alt="Sign In/Up" />
          <Link to="/visitor_signup" className="nav-link">Sign up</Link>
          <Link to="/visitor_signin" className="nav-link">Sign in</Link>
        </div>
      </div>

      <div className="body">
        <div className="body_text animate-on-load">
          <p className="game-title" style={{ fontFamily: 'Rogbold' }}>
            <span className="word-by-word">Game On, Above The City</span>
          </p>
          <p className="explore" style={{ fontFamily: 'Rogbold' }}>
            <span className="word-by-word">Explore Rooftops</span>
          </p>

          <Link to="/book_rooftop" className="visit-btn pulse-animate">
            Visit to view more <span>→</span>
          </Link>
        </div>
        <div className="body_img animate-on-load">
          <img src={img3} alt="Visitor Body" className="player-image fade-in-infinite" />
        </div>
      </div>

      <div className="visitor_footor animate-on-load">
        <img src={img4} alt="Bottom Bar Left" className="slide-in-left" />
        <a
          href="https://wa.me/923015317852"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-animate"
        >
          Help Center
        </a>
        <img src={img5} alt="Bottom Bar Right" className="slide-in-right" />
      </div>
    </div>
  );
}
