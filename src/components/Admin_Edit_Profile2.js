import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Admin_Edit_Profile2.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';

export default function Admin_Edit_Profile2() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { adminData } = state || {};
    const localData = JSON.parse(localStorage.getItem('adminsignin'));
    const rooftop = localData?.rooftops?.[0] || {};

    const [company, setCompany] = useState(rooftop.rooftopName || '');
    const [address, setAddress] = useState(rooftop.address || '');
    const [locationInput, setLocationInput] = useState(rooftop.location || '');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleNext = (e) => {
        e.preventDefault();
        const rooftopData = {
            RooftopName: company,
            Address: address,
            Location: locationInput,
        };
        navigate('/admin_edit_profile3', { state: { adminData, rooftopData, images } });
    };

    return (
        <div className='editprofile2-container'>
            <div className="editprofile2-text-section">
                <img src={arrow} alt="back" onClick={() => navigate(-1)} />
                <h2>Rooftop Information</h2>
                <form className='editprofile2-form' onSubmit={handleNext}>
                    <label>Company Name</label><br />
                    <input
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder='Enter company name'
                        size={55}
                        required
                    /><br /><br />

                    <label>Rooftop images</label><br />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="editprofile2-file-input"
                    /><br /><br />

                    <label>City</label><br />
                    <input
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder='Enter address'
                        size={55}
                        required
                    /><br /><br />

                    <label>Address</label><br />
                    <input
                        value={locationInput}
                        onChange={e => setLocationInput(e.target.value)}
                        placeholder='Enter location'
                        size={55}
                        required
                    /><br /><br />

                    <button type='submit'>Next</button>
                </form>
            </div>
            <div className="editprofile2-image-section">
                <img src={img1} alt="bg" />
            </div>
        </div>
    );
}
