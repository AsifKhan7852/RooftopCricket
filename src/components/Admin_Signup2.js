import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Admin_Signup2.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';

export default function Admin_Signup2() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { adminData, rooftopData: prevRooftopData = {}, images: prevImages = [] } = state || {};

    const [company, setCompany] = useState(prevRooftopData.RooftopName || '');
    const [address, setAddress] = useState(prevRooftopData.Address || '');
    const [locationInput, setLocationInput] = useState(prevRooftopData.Location || '');
    const [images, setImages] = useState(prevImages);

    function handleImageChange(e) {
        setImages(Array.from(e.target.files));
    }

    function handleNext(e) {
        e.preventDefault();
        const rooftopData = { RooftopName: company, Address: address, Location: locationInput };
        navigate('/admin_signup2', { state: { adminData, rooftopData, images } });
    }

    return (
        <div className='admin-signup2-wrapper'>
            <div className="admin-signup2-form-section">
                <img
                    src={arrow}
                    alt="back"
                    onClick={() => navigate('/admin_signup', { state: { adminData } })}
                />
                <h2>Rooftop Information</h2>

                <form className='admin-signup2-form' onSubmit={handleNext}>
                    <label>Company Name</label><br />
                    <input value={company} onChange={e => setCompany(e.target.value)} placeholder='Enter company name' size={55} required /><br /><br />
                    <label>Rooftop images</label><br />
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageChange} 
                        className="admin-signup2-file-input"
                        required 
                    /><br /><br />
                    <label>City</label><br />
                    <input value={locationInput} onChange={e => setLocationInput(e.target.value)} placeholder='Enter city' size={55} required /><br /><br />
                    <label>Address</label><br />
                    <input value={address} onChange={e => setAddress(e.target.value)} placeholder='Enter address' size={55} required /><br /><br />
                    <button type='submit'>Next</button>
                </form>
                <div className='admin-signup2-divider'>
                    <hr /><h4>or</h4><hr />
                </div>
                <div className="admin-signup2-signin-redirect">
                    <p>Have an account?</p>
                    <Link to="/admin_signup3">Sign in</Link>
                </div>
            </div>
            <div className="admin-signup2-image-section">
                <img src={img1} alt="bg" />
            </div>
        </div>
    );
}
