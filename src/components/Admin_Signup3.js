import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Admin_Signup3.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';

export default function Admin_Signup3({ ngrok_url }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { adminData, rooftopData, images } = state || {};

    const [startTime, setStartTime] = useState('10:00 AM');
    const [endTime, setEndTime] = useState('11:00 PM');
    const [pitches, setPitches] = useState(1);
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();

        Object.entries(adminData).forEach(([key, value]) => {
            formData.append(`Admin.${key}`, value);
        });

        const rooftopPayload = {
            ...rooftopData,
            StartTime: startTime,
            EndTime: endTime,
            NumberOfPitches: Number(pitches),
            PricePerHour: price,
        };

        Object.entries(rooftopPayload).forEach(([key, value]) => {
            formData.append(`Rooftop.${key}`, value);
        });

        images.forEach(file => formData.append('Rooftop.Images', file));

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const res = await fetch(`${ngrok_url}/api/RooftopAdmin/addAdminWithRooftop`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeout);
            const data = await res.text();

            switch (res.status) {
                case 200:
                    setMessage(data || 'Signup successful.');
                    alert('Account created successfully')
                    navigate('/admin_signup3');
                    break;
                case 404:
                    setMessage('Server not found. Please check the backend URL.');
                    break;
                case 409:
                    setMessage(data || 'This account may already exist.');
                    break;
                case 500:
                    setMessage('Server error occurred. Please try again later.');
                    break;
                default:
                    setMessage('Unexpected error. Please try again.');
                    break;
            }
        } catch (err) {
            console.error(err);
            if (err.name === 'AbortError') {
                setMessage('Request timed out. Please try again.');
            } else {
                setMessage('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='signup3-container'>
            <div className="signup3-text-section">
                <img
                    src={arrow}
                    alt="back"
                    onClick={() => navigate('/admin_signup1', { state: { adminData, rooftopData, images } })}
                />
                <h2>Schedule & Pricing</h2>

                <form className='signup3-form' onSubmit={handleSubmit}>
                    <label>Time Schedule</label><br />
                    <div className="time-row">
                        <input
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                            placeholder='Opening (10:00 AM)'
                            size={15}
                            required
                        />
                        <input
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                            placeholder='Closing (11:00 PM)'
                            size={15}
                            required
                        />
                    </div>
                    <br />
                    <label>Number of pitches</label><br />
                    <input
                        type='number'
                        value={pitches}
                        onChange={e => setPitches(e.target.value)}
                        style={{ width: '30vw' }}
                        required
                    />
                    <br /><br />
                    <label>Price per hour</label><br />
                    <input
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder='Enter price per hour'
                        size={55}
                        required
                    />
                    <br /><br />
                    <button type='submit' disabled={loading}>
                        {loading ? (
                            <div className="dual-spinner-ring">
                                <div className="ring1"></div>
                                <div className="ring2"></div>
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </button>
                    {message && (
                        <p
                            className={`signup3-message ${message.toLowerCase().includes('success') ? 'success' : 'error'}`}
                        >
                            {message}
                        </p>
                    )}
                </form>

                <div className='signup3-divider'>
                    <hr /><h4>or</h4><hr />
                </div>
                <div className="signup3-signin-redirect">
                    <p>Have an account?</p>
                    <Link to="/admin_signup3">Sign in</Link>
                </div>
            </div>
            <div className="signup3-image-section">
                <img src={img1} alt="bg" />
            </div>
        </div>
    );
}
