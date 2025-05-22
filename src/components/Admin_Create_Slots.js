import React, { useState } from 'react';
import './Admin_Create_Slots.css';
import img1 from '../Images/admin_body.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Create_Slots(props) {
    const [formData, setFormData] = useState({
        month: '2025-04',
        startTime: '',
        endTime: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');

            const adminData = JSON.parse(localStorage.getItem('adminsignin')) || {};
            const rooftopId = adminData?.rooftops?.[0]?.rooftopId || null;
            const token = adminData?.token || null;

            if (!rooftopId) throw new Error('Rooftop ID not found');
            if (!token) throw new Error('Authorization token not found');

            const monthNames = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
            ];
            const monthNumber = parseInt(formData.month.split('-')[1], 10) - 1;
            const monthName = monthNames[monthNumber];

            const fd = new FormData();
            fd.append('Month', monthName);
            fd.append('StartTime', formData.startTime);
            fd.append('EndTime', formData.endTime);
            fd.append('RooftopId', rooftopId);

            const response = await fetch(`${props.ngrok_url}/api/Slots/createSlots`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: fd
            });

            const resultText = await response.text();

            if (!response.ok) {
                throw new Error(resultText || 'Failed to create slots');
            }

            setMessage(resultText || 'Slots created successfully');

            setFormData(prev => ({
                ...prev,
                startTime: '',
                endTime: ''
            }));
        } catch (err) {
            console.error('Error creating slots:', err);
            setMessage(err.message || 'Failed to create slots');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='a_create_slot'>
        <Admin_Navbar bc="#3E8989" />
            <div className="a_head fade-in">
                <h4>Slots Creation</h4>
            </div>

            <div className="create_body">
                <div className="create_text">
                    <div className="calender">
                        <input 
                            className='calender_input' 
                            type="month" 
                            name="month"
                            value={formData.month}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="calender_form">
                        <form onSubmit={handleSubmit}>
                            <br />
                            <label htmlFor="">Time Schedule</label> <br /><br />
                            <input 
                                type="time" 
                                name="startTime"
                                placeholder='Start time (HH:MM)' 
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                            /> <br /> <br />
                            <input 
                                type="time" 
                                name="endTime"
                                placeholder='End time (HH:MM)' 
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                            /> <br /> <br /> <br />
                            <button 
                                type="submit" 
                                className="create-slots-button"
                                disabled={loading}
                            >
                                {loading ? <span className="spinner-btn"></span> : 'Create Slots'}
                            </button>
                            {message && <div className="message">{message}</div>}
                        </form>
                    </div>
                </div>
                <div className="create_img">
                    <img src={img1} alt="" />
                </div>
            </div>
        </div>
    );
}
