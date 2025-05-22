import React, { useEffect } from 'react';
import './About_us.css';
import img1 from '../Images/vsignin.png';
import img2 from '../Images/admin_body.png';
import hamna from '../Images/hamna.jpg';
import ahsan from '../Images/Ahsan.jpg';
import asif from '../Images/asif.jpg';

export default function About_us() {
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.animated-card, .name1, .animated-img');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 50) {
                    el.classList.add('animate');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='aboutus_wrapper'>
            <div className='aboutus_main'>
                <div className="aboutus_main2">
                    <div className='left_img animated-img'>
                        <img className='body_img' src={img1} alt="" />
                    </div>
                    <div className="aboutus_text">
                        <div className='mission'>
                            <h4>MISSION</h4>
                            <p>Connect cricket fans and promote rooftop cricket events.</p>
                        </div>
                        <div className='vision'>
                            <h4>VISION</h4>
                            <p>To build a vibrant community for rooftop cricket lovers.</p>
                        </div>
                        <div className='history'>
                            <h4>HISTORY</h4>
                            <p>
                                                     We started the Rooftop Cricket website in early 2024, driven by our
                                <br />   passion for the sport and the desire to create a unique platform for cricket
                                enthusiasts. The <br />    idea was born during a casual rooftop match, where we
                                realized the need for a dedicated <br />                     space to connect players,
                                share experiences, and organize events.<br />          Since then, we've been working
                                to bring this vision to life, focusing on community <br />                                   engagement and
                                promoting rooftop cricket culture.
                            </p>
                        </div>
                        <div className="achievment">
                            <h4>MILESTONES & ACHIEVMENTS</h4>
                        </div>
                    </div>
                    <div className="right_img animated-img">
                        <img src={img2} alt="" />
                    </div>
                </div>

                <div className="cart">
                    <div className="cart1 animated-card">
                        <h4>     Concept <br /> Development</h4>
                        <p>Finalized the website idea in early 2024</p>
                    </div>
                    <div className="cart2 animated-card">
                        <h4>Website Launch</h4>
                        <p>  Launched the beta version in June 2024</p>
                    </div>
                    <div className="cart3 animated-card">
                        <h4>Community <br />Engagement</h4>
                        <p>       Gained 500+ <br />memebers in the first <br />            month.</p>
                    </div>
                    <div className="cart4 animated-card">
                        <h4>Event Organization</h4>
                        <p>     Hosted our first <br />tournament in August <br />               2024.</p>
                    </div>
                    <div className="cart5 animated-card">
                        <h4>Partnerships</h4>
                        <p>Formed local brand <br />   partnerships by <br />  September 2024.</p>
                    </div>
                </div>

                <div className="produced">
                    <h4>PRODUCED BY</h4>
                    <div className="name">
                        <div className="name1">
                            <img className="animated-img" src={hamna} alt="Hamna" />
                            <p>HAMNA EMAN</p>
                        </div>
                        <div className="name1">
                            <img className="animated-img" src={ahsan} alt="Ahsan" />
                            <p>Ahsan Tariq</p>
                        </div>
                        <div className="name1">
                            <img className="animated-img" src={asif} alt="Asif" />
                            <p>Asif Khan</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
