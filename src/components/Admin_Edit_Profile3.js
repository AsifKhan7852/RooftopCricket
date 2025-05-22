import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Admin_Edit_Profile3.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';

export default function Admin_Edit_Profile3(props) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { adminData, rooftopData, images } = state || {};
    const localData = JSON.parse(localStorage.getItem('adminsignin'));
    const rooftop = localData?.rooftops?.[0] || {};
    const email = localData?.admin?.email || '';
    const token = localData?.token || '';

    const [startTime, setStartTime] = useState(rooftop.startTime || '');
    const [endTime, setEndTime] = useState(rooftop.endTime || '');
    const [pitches, setPitches] = useState(rooftop.numberOfPitches || '');
    const [price, setPrice] = useState(rooftop.pricePerHour || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        Object.entries(adminData).forEach(([key, value]) => {
            if (key === 'Password' && !value) return;
            formData.append(`Admin.${key}`, value);
        });

        const rooftopPayload = {
            ...rooftopData,
            StartTime: startTime,
            EndTime: endTime,
            NumberOfPitches: pitches,
            PricePerHour: price,
        };

        Object.entries(rooftopPayload).forEach(([key, value]) => {
            formData.append(`Rooftop.${key}`, value);
        });

        if (images && images.length > 0) {
            images.forEach(file => {
                formData.append('Rooftop.Images', file);
            });
        }

        try {
            const res = await fetch(`${props.ngrok_url}/api/RooftopAdmin/updateAdminWithRooftop/${email}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: formData,
            });

            if (res.ok) {
                alert('Profile updated successfully!');
                navigate('/admin_signup3');
            } else {
                const text = await res.text();
                console.error('Server response:', text);
                alert('Update failed. Try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='editprofile3-container'>
            <div className="editprofile3-text-section">
                <img src={arrow} alt="back" onClick={() => navigate(-1)} />
                <h2>Schedule & Pricing</h2>
                <form className='editprofile3-form' onSubmit={handleSubmit}>
                    <label>Time Schedule</label><br />
                    <input value={startTime} onChange={e => setStartTime(e.target.value)} placeholder='Opening' size={24} required />
                    <input value={endTime} onChange={e => setEndTime(e.target.value)} placeholder='Closing' size={24.5} required /><br /><br />
                    <label>Number of pitches</label><br />
                    <input type='number' value={pitches} onChange={e => setPitches(e.target.value)} style={{ width: '30.5vw' }} required /><br /><br />
                    <label>Price per hour</label><br />
                    <input value={price} onChange={e => setPrice(e.target.value)} placeholder='Enter price per hour' size={55} required /><br /><br />
                    <button type='submit' disabled={loading}>
                        {loading ? <div className="dual-ring"></div> : 'Submit'}
                    </button>
                </form>
            </div>
            <div className="editprofile3-image-section">
                <img src={img1} alt="bg" />
            </div>
        </div>
    );
}
