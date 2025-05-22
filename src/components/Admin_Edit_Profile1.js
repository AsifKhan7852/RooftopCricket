import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin_Edit_Profile1.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';

export default function Admin_Edit_Profile1() {
    const navigate = useNavigate();
    const localData = JSON.parse(localStorage.getItem('adminsignin'));
    const admin = localData?.admin || {};

    const [name, setName] = useState(admin.name || '');
    const [email, setEmail] = useState(admin.email || '');
    const [phone, setPhone] = useState(admin.phoneno || '');
    const [cnic, setCnic] = useState(admin.cnic || '');
    const [password, setPassword] = useState('');

    function handleNext(e) {
        e.preventDefault();
        const adminData = {
            Name: name,
            Email: email,
            PhoneNo: phone,
            CNIC: cnic,
            Password: password
        };
        navigate('/admin_edit_profile2', { state: { adminData } });
    }

    return (
        <div className='admin_editprofile1_container'>
            <div className="admin_editprofile1_text_section">
                <img src={arrow} alt="back" onClick={() => navigate(-1)} />
                <h2>Personal Information</h2>
                <form className='admin_editprofile1_form' onSubmit={handleNext}>
                    <label>Name</label><br />
                    <input value={name} onChange={e => setName(e.target.value)} placeholder='Enter your name' size={55} required /><br /><br />
                    <label>Email address</label><br />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter email address' size={55} required /><br /><br />
                    <label>Phone number</label><br />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder='Enter phone number' size={55} required /><br /><br />
                    <label>CNIC</label><br />
                    <input value={cnic} onChange={e => setCnic(e.target.value)} placeholder='Enter CNIC' size={55} required /><br /><br />
                    <label>Password</label><br />
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder='Enter new password (optional)'
                        size={55}
                    /><br /><br />
                    <button type='submit'>Next</button>
                </form>
            </div>
            <div className="admin_editprofile1_image_section">
                <img src={img1} alt="background" />
            </div>
        </div>
    );
}
