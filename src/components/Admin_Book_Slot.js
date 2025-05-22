import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Admin_Book_Slot.css';

import img1 from '../Images/admin_body.png';
import search from '../Images/search.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Book_Slot(props) {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const storedCart = JSON.parse(localStorage.getItem('admin_cart')) || [];
    const [cart, setCart] = useState(location.state?.cart || storedCart);

    const adminsignin = JSON.parse(localStorage.getItem('adminsignin')) || {};
    const rooftops = adminsignin.rooftops || [];
    const rooftopId = rooftops.length > 0 ? rooftops[0].rooftopId : null;

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const filterSlots = (data) => {
        return data.map(slot => {
            const cartItem = cart.find(item => item.slotId === slot.slotId);
            return cartItem ? { ...slot, availableCapacity: slot.availableCapacity - 1 } : slot;
        }).filter(slot => slot.availableCapacity > 0);
    };

    const fetchSlots = async (date = '') => {
        setMessage('');
        if (!rooftopId) {
            setMessage("Rooftop ID not found.");
            setMessageType("error");
            setSlots([]);
            return;
        }

        try {
            let url = `${props.ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${rooftopId}`;
            if (date) url += `&date=${encodeURIComponent(formatDate(date))}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    setMessage(text || "Failed to fetch slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    const updatedSlots = filterSlots(data);
                    setSlots(updatedSlots);
                }
            } catch (jsonError) {
                if (!response.ok) {
                    setMessage(text || "Failed to fetch slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    setMessage("Unexpected API response format.");
                    setMessageType("error");
                    setSlots([]);
                }
            }
        } catch (error) {
            setMessage("Error fetching slots. Please try again.");
            setMessageType("error");
            setSlots([]);
        }
    };

    const handleSearch = async () => {
        setMessage('');
        if (!selectedDate || !startTime) {
            setMessage("Please select a date and start time.");
            setMessageType("error");
            return;
        }

        const now = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${startTime}`);

        if (selectedDateTime <= now) {
            setMessage("Start time must be in the future.");
            setMessageType("error");
            return;
        }

        try {
            let url = `${props.ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${rooftopId}`;
            if (selectedDate) url += `&date=${encodeURIComponent(formatDate(selectedDate))}`;
            if (startTime) url += `&startTime=${encodeURIComponent(startTime)}`;
            if (endTime) url += `&endTime=${encodeURIComponent(endTime)}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    setMessage(text || "Failed to fetch slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    const updatedSlots = filterSlots(data);
                    setSlots(updatedSlots);
                    setMessage(text || "Slots fetched successfully.");
                    setMessageType("success");
                }
            } catch (jsonError) {
                if (!response.ok) {
                    setMessage(text || "Failed to fetch slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    setMessage("Invalid response format from server.");
                    setMessageType("error");
                    setSlots([]);
                }
            }
        } catch (error) {
            setMessage("Error fetching slots. Please try again.");
            setMessageType("error");
            setSlots([]);
        }
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate, cart]);

    const handleAddToCart = (slotId) => {
        const selectedSlot = slots.find(slot => slot.slotId === slotId);
        if (!selectedSlot || selectedSlot.availableCapacity <= 0) return;

        const updatedSlots = slots.map(slot =>
            slot.slotId === slotId
                ? { ...slot, availableCapacity: slot.availableCapacity - 1 }
                : slot
        ).filter(slot => slot.availableCapacity > 0);
        setSlots(updatedSlots);

        const updatedCart = [...cart, {
            slotId: selectedSlot.slotId,
            slotDate: selectedSlot.date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime
        }];
        setCart(updatedCart);
        localStorage.setItem('admin_cart', JSON.stringify(updatedCart));
    };

    const handleBack = () => {
        navigate('/admin_home_page', { state: { cart } });
    };

    const handleProceed = () => {
        if (cart.length === 0) {
            setMessage("Please add at least one slot to proceed.");
            setMessageType("error");
            return;
        }
        navigate('/admin_booking_form', { state: { cart } });
    };

    return (
        <div className='admin_slot_container'>
        <Admin_Navbar bc="#3E8989" />
            <div className="admin_slot_header">
                <h4>Slots Booking</h4>
            </div>

            <div className="admin_slot_body">
                <div className="admin_slot_left">
                    <div className="admin_slot_filter">
                        <input
                            className='admin_slot_input'
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <label>From: </label>
                        <input
                            className='admin_slot_input'
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                        <label>To:</label>
                        <input
                            className='admin_slot_input'
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                        <div className="admin_slot_search" onClick={handleSearch}>
                            <img src={search} alt="Search" style={{ pointerEvents: "none" }} />
                        </div>
                    </div>

                    <div className="admin_slot_table_wrapper">
                        <table className="admin_slot_table">
                            <thead>
                                <tr>
                                    <th>Slot Date</th>
                                    <th>Slot Time</th>
                                    <th>Status</th>
                                    <th>Available Pitches</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {message ? (
                                    <tr>
                                        <td colSpan="5" className={`admin_slot_message ${messageType}`}>
                                            {message}
                                        </td>
                                    </tr>
                                ) : slots.length > 0 ? (
                                    slots.map((slot) => (
                                        <tr key={slot.slotId}>
                                            <td>{slot.date}</td>
                                            <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                                            <td>{slot.status}</td>
                                            <td>{slot.availableCapacity}</td>
                                            <td>
                                                <button
                                                    className="admin_slot_button"
                                                    onClick={() => handleAddToCart(slot.slotId)}
                                                    disabled={slot.availableCapacity === 0}
                                                >
                                                    {slot.availableCapacity > 0 ? "Add to Cart" : "Unavailable"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="admin_slot_proceed_wrapper">
                            <button className="admin_slot_proceed_btn" onClick={handleProceed}>
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}