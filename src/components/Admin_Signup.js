import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Admin_Signup.css';
import img1 from '../Images/admin_body.png';
import arrow from '../Images/arrow.png';
import { Eye, EyeOff } from 'lucide-react';

export default function Admin_Signup() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const prevAdminData = state?.adminData || {};

  const [name, setName] = useState(prevAdminData.Name || '');
  const [email, setEmail] = useState(prevAdminData.Email || '');
  const [phone, setPhone] = useState(prevAdminData.PhoneNo || '');
  const [cnic, setCnic] = useState(prevAdminData.CNIC || '');
  const [password, setPassword] = useState(prevAdminData.Password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  function handleNext(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Accept any domain
    if (!emailRegex.test(email)) {
      setError("Email must be a valid format (e.g. yourname@example.com)");
      return;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 11 digits");
      return;
    }

    const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(cnic)) {
      setError("CNIC must be exactly 13 digits");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least 8 characters including one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');
    const adminData = { Name: name, Email: email, PhoneNo: phone, CNIC: cnic, Password: password };
    navigate('/admin_signup1', { state: { adminData } });
  }

  return (
    <div className='admin-signup-wrapper'>
      <div className="admin-signup-form-section">
        <img src={arrow} alt="back" onClick={() => navigate(-1)} />
        <h2>Personal Information</h2>
        {error && <p className="admin-signup-error">{error}</p>}
        <form className='admin-signup-form' onSubmit={handleNext}>
          <label>Name</label><br />
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder='Enter your name' 
            size={55} 
            required 
          /><br /><br />
          
          <label>Email address</label><br />
          <input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder='Enter your email' 
            size={55} 
            required 
          /><br /><br />
          
          <label>Phone number</label><br />
          <input 
            type="tel"
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder='Enter phone number (11 digits)' 
            size={55} 
            maxLength={11}
            required 
          /><br /><br />
          
          <label>CNIC</label><br />
          <input 
            type="tel"
            value={cnic} 
            onChange={e => setCnic(e.target.value)} 
            placeholder='Enter CNIC (13 digits)' 
            size={55} 
            maxLength={13}
            required 
          /><br /><br />
          
          <label>Password</label><br />
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder='Enter strong password' 
              size={55} 
              required 
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div><br />

          <label>Confirm Password</label><br />
          <div className="password-input-wrapper">
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder='Re-enter your password' 
              size={55} 
              required 
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div><br />
          
          <button type='submit'>Next</button>
        </form>
        <div className='admin-signup-divider'>
          <hr /><h4>or</h4><hr />
        </div>
        <div className="admin-signin-redirect">
          <p>Have an account?</p>
          <Link to="/admin_signup3">Sign in</Link>
        </div>
        <br />
        <br />
      </div>
      <div className="admin-signup-image-section">
        <img src={img1} alt="bg" />
      </div>
    </div>
  );
}
