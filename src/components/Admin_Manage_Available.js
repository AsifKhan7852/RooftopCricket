import React, { useEffect, useState } from 'react';
import './Admin_Manage_Available.css';
import img1 from '../Images/admin_body.png';
import search from '../Images/search.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Manage_Available({ ngrok_url }) {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const adminsignin = JSON.parse(localStorage.getItem('adminsignin')) || {};
    const rooftops = adminsignin.rooftops || [];
    const rooftopId = rooftops.length > 0 ? rooftops[0].rooftopId : null;
    const token = adminsignin.token || '';

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const fetchSlots = async (date = '') => {
        setMessage('');
        try {
            if (!rooftopId) {
                setMessage("Rooftop ID not found.");
                setMessageType("error");
                setSlots([]);
                return;
            }

            let url = `${ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${rooftopId}`;
            if (date) url += `&date=${encodeURIComponent(formatDate(date))}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    setMessage(text || "Failed to fetch slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    setSlots(data);
                }
            } catch {
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
            setMessage("Failed to fetch slots.");
            setMessageType("error");
            setSlots([]);
        }
    };

    const handleSearch = async () => {
        setMessage('');
        if (!selectedDate || !startTime) {
            setMessage("Please select a date and start time.");
            setMessageType("error");
            setSlots([]);
            return;
        }

        const now = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${startTime}`);
        if (selectedDateTime <= now) {
            setMessage("Start time must be in the future.");
            setMessageType("error");
            setSlots([]);
            return;
        }

        try {
            let url = `${ngrok_url}/api/Slots/filterAvailableSlots?rooftopId=${rooftopId}`;
            if (selectedDate) url += `&date=${encodeURIComponent(formatDate(selectedDate))}`;
            if (startTime) url += `&startTime=${encodeURIComponent(startTime)}`;
            if (endTime) url += `&endTime=${encodeURIComponent(endTime)}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    setMessage(text || "Failed to search slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    setSlots(data);
                    setMessage(text || "Slots fetched successfully.");
                    setMessageType("success");
                }
            } catch {
                if (!response.ok) {
                    setMessage(text || "Failed to search slots.");
                    setMessageType("error");
                    setSlots([]);
                } else {
                    setMessage("Invalid response format from server.");
                    setMessageType("error");
                    setSlots([]);
                }
            }
        } catch (error) {
            setMessage("Failed to search slots.");
            setMessageType("error");
            setSlots([]);
        }
    };

    const handleDisableSlot = async (slot) => {
        setMessage('');
        if (!rooftopId || !token) {
            setMessage("Rooftop ID or token missing. Please log in again.");
            setMessageType("error");
            return;
        }

        const confirmDisable = window.confirm("Are you sure you want to disable this slot?");
        if (!confirmDisable) return;

        try {
            const response = await fetch(`${ngrok_url}/api/Slots/Disable_FreeSlots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({
                    RooftopId: rooftopId,
                    Date: slot.date,
                    StartTime: slot.startTime,
                    EndTime: slot.endTime,
                    Disable: true
                }),
            });

            const text = await response.text();

            if (response.ok) {
                setMessage(text || "Slot disabled successfully.");
                setMessageType("success");
                fetchSlots(selectedDate);
            } else {
                setMessage(text || "Failed to disable slot.");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("Error disabling slot.");
            setMessageType("error");
        }
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    return (
        <div className="adminavailv2_scrollable">
            <Admin_Navbar bc="#3E8989" />
            <div className='adminavailv2_container'>
                <div className="adminavailv2_header">
                    <h4>Manage Available Slots</h4>
                </div>

                <div className="adminavailv2_body">
                    <div className="adminavailv2_text">
                        <div className="adminavailv2_filter">
                            <input
                                className='adminavailv2_input'
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <label>From: </label>
                            <input
                                className='adminavailv2_input'
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                            <label>To:</label>
                            <input
                                className='adminavailv2_input'
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                            <div className="adminavailv2_search_icon" onClick={handleSearch}>
                                <img src={search} alt="Search" style={{ pointerEvents: "none" }} />
                            </div>
                        </div>

                        <div className="adminavailv2_table-wrapper">
                            <table className="adminavailv2_table">
                                <thead>
                                    <tr>
                                        <th>Slot Date</th>
                                        <th>Slot Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {message ? (
                                        <tr>
                                            <td colSpan="3" className={`adminavailv2_message ${messageType}`}>
                                                {message}
                                            </td>
                                        </tr>
                                    ) : slots.length > 0 ? (
                                        slots.map((slot) => (
                                            <tr key={slot.slotId}>
                                                <td>{slot.date}</td>
                                                <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                                                <td>
                                                    <button
                                                        className="adminavailv2_disable-btn"
                                                        onClick={() => handleDisableSlot(slot)}
                                                    >
                                                        Disable
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="adminavailv2_image">
                        <img src={img1} alt="background visual" />
                    </div>
                </div>
            </div>
        </div>
    );
}
