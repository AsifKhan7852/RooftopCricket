import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin_Booking_Form.css';
import img1 from '../Images/admin_body.png';

export default function Admin_Booking_Form(props) {
  const navigate = useNavigate();
  const adminsignin = JSON.parse(localStorage.getItem('adminsignin')) || {};

  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('admin_cart')) || [];
    setCart(storedCart);
  }, []);

  const handleBook = async () => {
    setMessage('');

    if (cart.length === 0) {
      setMessage("Please add at least one slot to the cart before proceeding.");
      setMessageType("error");
      return;
    }

    if (!name.trim() || !phoneNo.trim() || !email.trim()) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    const token = adminsignin?.token;
    const rooftopId = adminsignin?.rooftops?.[0]?.rooftopId;

    if (!token || !rooftopId) {
      setMessage("Admin authentication info is missing.");
      setMessageType("error");
      return;
    }

    const payload = {
      RooftopId: rooftopId,
      Slots: cart.map(slot => ({
        Date: slot.slotDate,
        StartTime: slot.startTime,
        EndTime: slot.endTime
      })),
      GuestName: name,
      GuestPhone: phoneNo,
      GuestEmail: email
    };

    try {
      setIsBooking(true);
      const response = await fetch(`${props.ngrok_url}/api/Booking/adminBookSlots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.text();

      if (response.ok) {
        alert(result || "Booking successful!");
        setMessage('');
        setMessageType('');
        localStorage.removeItem('admin_cart');
        setCart([]);
        setTimeout(() => {
          navigate('/admin_home_page', { state: { name, phoneNo, email } });
        }, 2000);
      } else {
        setMessage(result || "Failed to book slots.");
        setMessageType("error");
      }
    } catch (error) {
      console.error('Booking API error:', error);
      setMessage("Failed to book slots. Please try again.");
      setMessageType("error");
    } finally {
      setIsBooking(false);
    }
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('admin_cart', JSON.stringify(updatedCart));
  };

  const handleBack = () => {
    navigate('/admin_book_slot');
  };

  return (
    <div className='admin-bookform'>
      <div className="admin-bookform-head">
        <h4>Booking Form</h4>
      </div>

      <div className="admin-selected-slot-heading-container">
        <div className="admin-selected-slot-heading">
          <h4>Selected Slots:</h4>
        </div>
        <div className="admin-input-fields">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone No"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-bookform-body">
        <div className="admin-bookform-text">
          <div className="admin-bookform-table-container">
            <table className="admin-bookform-custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {message && (
                  <tr>
                    <td colSpan="3" className={`admin-bookform-message ${messageType}`}>
                      {message}
                    </td>
                  </tr>
                )}
                {cart.length > 0 ? cart.map((slot, index) => (
                  <tr key={index}>
                    <td>{slot.slotDate}</td>
                    <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                    <td>
                      <button className="admin-bookform-button" onClick={() => handleRemove(index)}>Remove</button>
                    </td>
                  </tr>
                )) : (
                  !message && (
                    <tr>
                      <td colSpan="3">No slots selected</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="admin-bookform-btn-container">
              <button 
                className="admin-bookform-btn" 
                onClick={handleBook} 
                disabled={isBooking}
              >
                {isBooking ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
