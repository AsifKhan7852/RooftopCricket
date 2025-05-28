import React, { useState } from "react";
import "./Admin_Booking_Update.css";

export default function Admin_Booking_Update({ booking, onClose, onUpdateSuccess, ngrok_url, endpointName }) {
    const [formData, setFormData] = useState({
        date: booking.slotDate || "",
        startTime: booking.startTime || "",
        endTime: booking.endTime || "",
    });

    const [loading, setLoading] = useState(false); // 🔄 Loading state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const storedUser = JSON.parse(localStorage.getItem("adminsignin")) || {};
            const token = storedUser.token || "";

            const updateUrl = `${ngrok_url}/api/Booking/${endpointName}Booking`;

            const formDataToSend = new FormData();
            formDataToSend.append("BookingId", booking.bookingId);
            formDataToSend.append("Date", formData.date);
            formDataToSend.append("StartTime", formData.startTime);
            formDataToSend.append("EndTime", formData.endTime);

            const response = await fetch(updateUrl, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: formDataToSend,
            });

            const responseData = await response.text();

            if (!response.ok) {
                alert(`❌ ${responseData}`);
                return;
            }

            alert(`✅ ${responseData}`);
            onUpdateSuccess();
            onClose();
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
            console.error(`${endpointName} failed:`, error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>Update Booking</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Start Time:</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Time:</label>
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <div className="button-spinner"></div> : "Update Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
}
