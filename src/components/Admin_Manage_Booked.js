import React, { useState, useEffect } from 'react';
import './Admin_Manage_Booked.css';
import search from '../Images/search.png';
import Admin_Booking_Update from './Admin_Booking_Update';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Manage_Booked(props) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [endpointName] = useState('update');
    const [filters, setFilters] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showReceiptPopup, setShowReceiptPopup] = useState(false);
    const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);

    const getAdminData = () => JSON.parse(localStorage.getItem('adminsignin')) || {};
    const getToken = () => getAdminData()?.token || null;
    const getRooftopId = () => getAdminData()?.rooftops?.[0]?.rooftopId || null;

    const isBookingExpired = (slotDate, endTime) => {
        const now = new Date();
        const bookingEnd = new Date(`${slotDate}T${endTime}`);
        return bookingEnd < now;
    };

    useEffect(() => {
        fetchBookings();
    }, [filters.date]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            const rooftopId = getRooftopId();
            const token = getToken();

            if (!rooftopId) throw new Error('Rooftop ID not found');
            if (!token) throw new Error('Authorization token not found');

            let apiUrl = `${props.ngrok_url}/api/BookedSlots/admin/bookedSlots?rooftopId=${rooftopId}`;
            if (filters.date) apiUrl += `&date=${encodeURIComponent(filters.date)}`;
            if (filters.startTime) apiUrl += `&startTime=${encodeURIComponent(filters.startTime)}`;
            if (filters.endTime) apiUrl += `&endTime=${encodeURIComponent(filters.endTime)}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Failed to fetch bookings: ${response.status}`);
            }

            const data = await response.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const token = getToken();
            if (!token) throw new Error('Authorization token not found');

            const cancelUrl = `${props.ngrok_url}/api/Booking/cancelBooking/${bookingId}`;
            const response = await fetch(cancelUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Failed to cancel booking`);
            }

            alert('Booking canceled successfully!');
            fetchBookings();
        } catch (error) {
            alert(`Failed to cancel booking: ${error.message}`);
        }
    };

    const handleReschedule_UpdateClick = (booking) => {
        setSelectedBooking(booking);
        setShowUpdatePopup(true);
    };

    const handleAllowReschedule = async (bookingId) => {
        if (!window.confirm('Are you sure you want to allow rescheduling for this booking?')) return;
        try {
            const token = getToken();
            if (!token) throw new Error('Authorization token not found');

            const rescheduleUrl = `${props.ngrok_url}/api/Booking/admin/rescheduleBooking/${bookingId}`;
            const response = await fetch(rescheduleUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Failed to allow reschedule`);
            }

            const message = await response.text();
            alert(message || 'Reschedule allowed successfully!');
            fetchBookings();
        } catch (error) {
            alert(`Failed to allow reschedule: ${error.message}`);
        }
    };

    const handleGenerateReceipt = async (booking) => {
        try {
            const token = getToken();
            if (!token) throw new Error('Authorization token not found');

            const receiptUrl = `${props.ngrok_url}/api/Reports/CompleteBooking/${booking.bookingId}`;
            const response = await fetch(receiptUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Failed to generate receipt`);
            }

            setSelectedReceiptBooking(booking);
            setShowReceiptPopup(true);
        } catch (error) {
            alert(`Failed to generate receipt: ${error.message}`);
        }
    };

    const ReceiptPopup = ({ booking, onClose }) => {
        const total = booking.paidAmount + booking.payableAmount;
        
        const handlePrint = () => {
            window.print();
        };

        return (
            <div className="receipt-popup">
                <div className="receipt-content">
                    <h3>Booking Receipt</h3>
                    <div className="receipt-details">
                        <p><strong>Customer Name:</strong> {booking.customerName}</p>
                        <p><strong>Phone Number:</strong> {booking.phoneNo}</p>
                        <p><strong>Date:</strong> {booking.slotDate}</p>
                        <p><strong>Time Slot:</strong> {booking.slots.startTime} - {booking.slots.endTime}</p>
                        <div className="amount-section">
                            <p><strong>Paid Amount:</strong> PKR {booking.paidAmount}</p>
                            <p><strong>Payable Amount:</strong> PKR {booking.payableAmount}</p>
                            <p className="total-amount"><strong>Total Amount:</strong> PKR {total}</p>
                        </div>
                    </div>
                    <div className="receipt-buttons">
                        <button className="print-button" onClick={handlePrint}>Print Receipt</button>
                        <button className="close-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings();
    };

    return (
        <div className='manage-booked-container'>
            <Admin_Navbar bc="#3E8989" />
            <div className="booked-header">   
                <h4>Manage Booked Slots</h4>
            </div>

            <div className="booked-body">
                <div className="booked-filters">
                    <div className="booked-calendar">
                        <input 
                            className='booked-calendar-input' 
                            type="date" 
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
                        <label>From: </label>
                        <input 
                            className='booked-calendar-input' 
                            type="time" 
                            name="startTime"
                            value={filters.startTime}
                            onChange={handleFilterChange}
                        />
                        <label>To:</label>
                        <input 
                            className='booked-calendar-input' 
                            type="time" 
                            name="endTime"
                            value={filters.endTime}
                            onChange={handleFilterChange}
                        />
                        <div className="booked-search" onClick={handleSearch}>
                            <img src={search} alt="" />
                        </div>
                    </div>

                    <div className="booked-table-container">
                        {loading ? (
                            <div>Loading...</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : (
                            <table className="booked-custom-table">
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Customer Phone No</th>
                                        <th>Slot Date</th>
                                        <th>Slot Time</th>
                                        <th>Amount Paid</th>
                                        <th>Amount Payable</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => {
                                        const isExpired = isBookingExpired(booking.slotDate, booking.slots.endTime);
                                        return (
                                            <tr key={booking.bookingId}>
                                                <td>{booking.customerName}</td>
                                                <td>{booking.phoneNo}</td>
                                                <td>{booking.slotDate}</td>
                                                <td>{booking.slots.startTime} - {booking.slots.endTime}</td>
                                                <td>{booking.paidAmount}</td>
                                                <td>{booking.payableAmount}</td>
                                                <td>
                                                    <button 
                                                        className={`booked-button ${isExpired ? 'disabled' : ''}`} 
                                                        disabled={isExpired}
                                                        onClick={() => handleCancelBooking(booking.bookingId)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        className={`booked-button ${isExpired ? 'disabled' : ''}`} 
                                                        disabled={isExpired}
                                                        onClick={() => handleReschedule_UpdateClick(booking)}
                                                    >
                                                        Update
                                                    </button>
                                                    <button 
                                                        className={`booked-button ${isExpired ? 'disabled' : ''}`} 
                                                        disabled={isExpired}
                                                        onClick={() => handleAllowReschedule(booking.bookingId)}
                                                    >
                                                        Allow Reschedule
                                                    </button>
                                                    <button 
                                                        className="booked-button"
                                                        onClick={() => handleGenerateReceipt(booking)}
                                                    >
                                                        Generate Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showUpdatePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <Admin_Booking_Update
                            booking={selectedBooking}
                            onClose={() => setShowUpdatePopup(false)}
                            onUpdateSuccess={fetchBookings}
                            ngrok_url={props.ngrok_url}
                            endpointName={endpointName}
                        />
                    </div>
                </div>
            )}

            {showReceiptPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <ReceiptPopup 
                            booking={selectedReceiptBooking}
                            onClose={() => setShowReceiptPopup(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}