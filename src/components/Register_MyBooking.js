import React, { useEffect, useState } from 'react';
import './Register_MyBooking.css';
import Register_Booking_Update from './Register_Booking_Update';
import Register_Navbar from './Register_Navbar';

export default function Register_MyBooking(props) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [endpointName, setendpointName] = useState();

    const storedUser = JSON.parse(localStorage.getItem("User")) || {};
    const token = storedUser.Token || "";
    const email = storedUser.Email || "";

    const fetchBookings = async () => {
        if (!email) {
            setError("User email not found.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const apiUrl = `${props.ngrok_url}/api/BookedSlots/getCustomerBookings/${email}`;
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Bookings:", data);
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [token, email]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const cancelUrl = `${props.ngrok_url}/api/Booking/cancelBooking/${bookingId}`;
            const response = await fetch(cancelUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to cancel booking: ${response.statusText}`);
            }

            alert("Booking canceled successfully!");
            fetchBookings();
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("Failed to cancel booking. Please try again.");
        }
    };

    const handleReschedule_UpdateClick = (booking) => {
        setSelectedBooking(booking);
        setShowUpdatePopup(true);
    };

    return (
        <div className='mybooking'>
     <Register_Navbar bc="#3E8989"/>
            <div className="head">
                <h4>Your Booked Slots</h4>
            </div>

            <div className="table-container">
                {loading ? (
                    <p>Loading bookings...</p>
                ) : error ? (
                    <p className="error-message">Error: {error}</p>
                ) : bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Rooftop Name</th>
                                <th>Slot Date</th>
                                <th>Slot Time</th>
                                <th>Paid Amount</th>
                                <th>Payable Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.rooftopName}</td>
                                    <td>{booking.slotDate}</td>
                                    <td>{`${booking.slots.startTime} - ${booking.slots.endTime}`}</td>
                                    <td>{booking.amountPaid}</td>
                                    <td>{booking.amountPayable}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="cancel-btn"
                                            disabled={!booking.canModify}
                                            onClick={() => handleCancelBooking(booking.bookingId)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="update-btn"
                                            disabled={!booking.canModify}
                                            onClick={() => {
                                                setendpointName("update");
                                                handleReschedule_UpdateClick(booking);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="reschedule-btn"
                                            disabled={booking.status !== "Rescheduled"}
                                            onClick={() => {
                                                setendpointName("reschedule");
                                                handleReschedule_UpdateClick(booking);
                                            }}
                                        >
                                            Re-Schedule
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showUpdatePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Register_Booking_Update
                            booking={selectedBooking}
                            onClose={() => setShowUpdatePopup(false)}
                            onUpdateSuccess={fetchBookings}
                            ngrok_url={props.ngrok_url}
                            endpointName={endpointName}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
