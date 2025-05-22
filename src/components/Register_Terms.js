import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Register_Terms.css';
import img1 from '../Images/SuperAdminBody.jpg';

export default function Register_Terms(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart = [] } = location.state || {};

    const storedUser = JSON.parse(localStorage.getItem("User")) || {};
    const rooftopId = localStorage.getItem("RooftopId") || "0";
    const registeredUserEmail = storedUser.Email || null;
    const rooftopPrice = parseFloat(localStorage.getItem("RooftopPrice")) || 0;

    console.log("Received Cart Data:", cart);
    console.log("RooftopId:", rooftopId);
    console.log("RegisteredUserEmail:", registeredUserEmail);
    console.log("RooftopPrice:", rooftopPrice);

    const handleProceedToPayment = async () => {
        if (!registeredUserEmail) {
            alert("You need to be a registered user to make a payment. Please login first.");
            navigate('/user_signin', { state: { from: location.pathname, cart } });
            return;
        }

        if (cart.length === 0) {
            alert("Please select at least one slot before proceeding.");
            return;
        }

        const amountPKR = rooftopPrice * cart.length * 0.25;
        console.log("Calculated amountPKR:", amountPKR);

        const bookingData = {
            RooftopId: parseInt(rooftopId),
            RegisteredUserEmail: registeredUserEmail,
            Slots: cart.map(slot => ({
                Date: slot.slotDate,
                StartTime: slot.startTime,
                EndTime: slot.endTime
            }))
        };

        try {
            const paymentResponse = await fetch(
                `${props.ngrok_url}/api/Payment/create-checkout-session`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amountPKR: amountPKR,
                        successUrl: `${window.location.origin}/register_booking_success`,
                        cancelUrl: `${window.location.origin}/register_booking_cancel`,
                        booking: bookingData
                    })
                }
            );

            const paymentData = await paymentResponse.json();
            console.log("Payment API Response:", paymentData);

            if (paymentResponse.ok && paymentData.url) {
                window.location.href = paymentData.url;
            } else {
                alert("Failed to initiate payment.");
            }
        } catch (error) {
            console.error("Payment API error:", error);
            alert("Payment API call failed.");
        }
    };

    return (
        <div className='register_terms'>
            <div className="register_term_head">
          
                <h4>Terms & Conditions</h4>
            </div>
            <div className="register_term_subhead">
                <strong>For a Cricket Rooftop booking system, the terms and conditions might include the following points:</strong>
            </div>

            <div className="register_term_body">
                <div className="register_term_text">
                    <div className="register_term_text1">
                        <h4>1. BOOKING POLICY</h4>
                        <p>Reservation should be made in advance.</p>
                        <p>Full payment or deposit required upon booking.</p>
                    </div>
                    <div className="register_term_text1">
                        <h4>2. CANCELLATION & REFUND</h4>
                        <p>Cancellations must be made at least 24-48 hours prior to the booking time for a refund.</p>
                        <p>Late cancellations may not be eligible for a refund.</p>
                    </div>
                    <div className="register_term_text1">
                        <h4>3. USER RESPONSIBILITIES</h4>
                        <p>Users are responsible for their behavior on the rooftop.</p>
                        <p>Any damage to the facilities may result in a fine.</p>
                    </div>
                    <div className="register_term_text1">
                        <h4>4. HEALTH & SAFETY</h4>
                        <p>Players must follow all safety guidelines and use proper equipment.</p>
                        <p>The venue is not liable for personal injuries or accidents.</p>
                    </div>
                    <div className="register_term_text1">
                        <h4>5. WEATHER POLICY</h4>
                        <p>In case of adverse weather, the management may reschedule the booking or offer a refund.</p>
                    </div>
                    <div className="register_term_text1">
                        <h4>6. TIME LIMITS</h4>
                        <p>Users must vacate the premises promptly after their booked time slot.</p>
                    </div>
                </div>
                <div className="register_term_img">
                    <img src={img1} alt="" />
                </div>
            </div>

            <div className="register_term_btn">
                <button onClick={handleProceedToPayment}>Proceed to payment</button>
                <button onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
}