import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Register_Available_Slots.css';
import img1 from '../Images/admin_body.png';
import search from '../Images/search.png';
import Register_Navbar from './Register_Navbar';

export default function Register_Available_Slots(props) {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const storedRooftopId = localStorage.getItem("RooftopId") || {};

    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem('bookingCart');
        return savedCart ? JSON.parse(savedCart) : (location.state?.cart || []);
    });

    useEffect(() => {
        sessionStorage.setItem('bookingCart', JSON.stringify(cart));
    }, [cart]);

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const fetchSlots = async (date = '') => {
        try {
            let url = `${props.ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${storedRooftopId}`;
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
                const updatedSlots = data.map(slot => {
                    const bookedCount = cart.filter(c => c.slotId === slot.slotId).length;
                    return {
                        ...slot,
                        availableCapacity: slot.availableCapacity - bookedCount
                    };
                }).filter(slot => slot.availableCapacity > 0); // Only show slots with capacity > 0

                setSlots(updatedSlots);
                setErrorMessage('');
            } catch {
                setErrorMessage(text);
                setSlots([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorMessage("Something went wrong while fetching slots.");
        }
    };

    const handleSearch = async () => {
        if (!selectedDate || !startTime) {
            alert("Please select a date and start time.");
            return;
        }

        const now = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${startTime}`);
        if (selectedDateTime <= now) {
            alert("Start time must be in the future.");
            return;
        }

        try {
            let url = `${props.ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${storedRooftopId}`;
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
                const updatedSlots = data.map(slot => {
                    const bookedCount = cart.filter(c => c.slotId === slot.slotId).length;
                    return {
                        ...slot,
                        availableCapacity: slot.availableCapacity - bookedCount
                    };
                }).filter(slot => slot.availableCapacity > 0); // Filter out unavailable slots

                setSlots(updatedSlots);
                setErrorMessage('');
            } catch {
                setErrorMessage(text);
                setSlots([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorMessage("Something went wrong while fetching slots.");
        }
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate, cart]);

    const handleAddToCart = (slotId) => {
        const selectedSlot = slots.find(slot => slot.slotId === slotId);
        if (!selectedSlot || selectedSlot.availableCapacity <= 0) return;

        const updatedCart = [...cart, {
            slotId: selectedSlot.slotId,
            slotDate: selectedSlot.date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime
        }];
        setCart(updatedCart);

        setSlots(prevSlots =>
            prevSlots.map(slot =>
                slot.slotId === slotId
                    ? { ...slot, availableCapacity: slot.availableCapacity - 1 }
                    : slot
            ).filter(slot => slot.availableCapacity > 0) // Remove if availability drops to 0
        );
    };

    const handleProceed = () => {
        if (cart.length === 0) {
            alert("Please add at least one slot to the cart before proceeding.");
            return;
        }
        navigate('/register_booking_form', { state: { cart } });
    };

    return (
        <div className='register_n_book'>
            <Register_Navbar bc="#3E8989" />
            <div className="register_avail_head">
                <h4>Available Slots</h4>
            </div>

            <div className="register_avail_body">
                <div className="register_avail_text">
                    <div className="register_avail_calender">
                        <input
                            className='register_avail_calender_input'
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <label>From: </label>
                        <input
                            className='register_avail_calender_input'
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />

                        <label>To:</label>
                        <input
                            className='register_avail_calender_input'
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />

                        <div className="register_avail_search" onClick={handleSearch}>
                            <img src={search} alt="Search" />
                        </div>
                    </div>

                    <div className="register_avail_table-container">
                        <table className="register_avail_custom-table">
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
                                {slots.length > 0 ? (
                                    slots.map((slot) => (
                                        <tr key={slot.slotId}>
                                            <td>{slot.date}</td>
                                            <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                                            <td>{slot.status}</td>
                                            <td>{slot.availableCapacity}</td>
                                            <td>
                                                <button
                                                    className="register_avail_button"
                                                    onClick={() => handleAddToCart(slot.slotId)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">{errorMessage || "No slots available"}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="register_b_btn">
                            <button onClick={handleProceed}>Proceed</button>
                        </div>
                    </div>
                </div>
                <div className="register_avail_img">
                    <img src={img1} alt="Decoration" />
                </div>
            </div>
        </div>
    );
}
