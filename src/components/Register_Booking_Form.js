import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Register_Booking_Form.css';

export default function Register_Booking_Form() {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize cart from location state or session storage
    const [cart, setCart] = useState(() => {
        const savedCart = sessionStorage.getItem('bookingCart');
        return savedCart ? JSON.parse(savedCart) : (location.state?.cart || []);
    });

    const storeUser = JSON.parse(localStorage.getItem("User")) || "Unknown";

    // Save cart to session storage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('bookingCart', JSON.stringify(cart));
    }, [cart]);

    const handleBook = () => {
        if (cart.length === 0) {
            alert("Please add at least one slot to the cart before proceeding.");
            return;
        }
        sessionStorage.removeItem('bookingCart'); // Clear after successful booking
        navigate('/register_terms', { state: { cart } });
    };

    const handleRemove = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    return (
        <div className='register_bookform'>
            <div className="register_bookform_head">
                <h4>Booking Form</h4>
            </div>
            <div className="selected_slot_heading">
                <h4>Selected Slots:</h4>
            </div>

            <div className="register_bookform_body">
                <div className="register_bookform_text">
                    <div className="register_bookform_table-container">
                        <table className="register_bookform_custom-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length > 0 ? cart.map((slot, index) => (
                                    <tr key={index}>
                                        <td>{slot.slotDate}</td>
                                        <td>{`${slot.startTime} - ${slot.endTime}`}</td>
                                        <td>{storeUser.Name}</td>
                                        <td>{storeUser.PhoneNo}</td>
                                        <td>
                                            <button className="register_bookform_button" onClick={() => handleRemove(index)}>Remove</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5">No slots selected</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="register_bookform_btn">
                        <button onClick={handleBook}>Book Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}