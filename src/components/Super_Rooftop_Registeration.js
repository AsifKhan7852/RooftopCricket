import React, { useEffect, useState } from 'react';
import './Super_Rooftop_Registeration.css';
import search from '../Images/search.png';
import img1 from '../Images/admin_body.png';
import { Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader'; // 🔄 Spinner import
import Super_Admin_Navbar from './Super_Admin_Navbar';

export default function Super_Rooftop_Registeration(props) {
  const [rooftops, setRooftops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const superadminData = localStorage.getItem('superadmin');
  const token = superadminData ? JSON.parse(superadminData).token : null;

  const fetchRooftops = async (rooftopName = '', city = '') => {
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({ status: 'Pending' });
    if (rooftopName) queryParams.append('rooftopName', rooftopName);
    if (city) queryParams.append('city', city);

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/Rooftop/fetchRooftopWithFilters?${queryParams.toString()}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('superadmin');
          window.location.href = '/super-admin-login';
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setRooftops(data);
    } catch (error) {
      console.error('Failed to fetch rooftops:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (email) => {
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    if (!window.confirm('Are you sure you want to accept this rooftop?')) return;

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/SuperAdmin/RegisterRooftopAdmin/${encodeURIComponent(email)}`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('superadmin');
          window.location.href = '/super-admin-login';
        }
        throw new Error('Failed to accept rooftop');
      }

      const result = await response.text();
      alert(result);
      fetchRooftops(searchTerm, city);
    } catch (error) {
      console.error('Error accepting rooftop:', error);
      alert(error.message);
    }
  };

  const handleReject = async (email) => {
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    if (!window.confirm('Are you sure you want to reject this rooftop?')) return;

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/UsersManagement/deleteAdmin/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('superadmin');
          window.location.href = '/super-admin-login';
        }
        throw new Error('Failed to reject rooftop');
      }

      const result = await response.text();
      alert(result);
      fetchRooftops(searchTerm, city);
    } catch (error) {
      console.error('Error rejecting rooftop:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRooftops();
    } else {
      window.location.href = '/super-admin-login';
    }
  }, [token]);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchButton = () => {
    fetchRooftops(searchTerm, city);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    fetchRooftops(searchTerm, selectedCity);
  };

  return (
    <div className='super_rooftop_reg_container'>
     <Super_Admin_Navbar bc="#3E8989"/>
      <div className="super_rooftop_reg_header">
        <h4>Rooftop Management</h4>
      </div>

      <div className="super_rooftop_reg_content">
        <div className="super_rooftop_reg_main">
          <div className="super_rooftop_reg_filters">
            <div className="super_rooftop_reg_search_container">
              <input
                className='super_rooftop_reg_search_input'
                type="text"
                placeholder='Search Rooftop by Name'
                value={searchTerm}
                onChange={handleSearchInput}
              />
              <div className="super_rooftop_reg_search_btn" onClick={handleSearchButton}>
                <img src={search} alt="Search Icon" />
              </div>
            </div>

            <select
              className='super_rooftop_reg_city_select'
              value={city}
              onChange={handleCityChange}
            >
              <option value="">All Cities</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>

          {/* ✅ Spinner shown while loading */}
          {loading && (
            <div className="super_rooftop_reg_loading_spinner">
              <ClipLoader color="#3d7e7e" loading={loading} size={40} />
              <div className="super_rooftop_reg_loading">Loading rooftops...</div>
            </div>
          )}

          {error && <div className="super_rooftop_reg_error">{error}</div>}

          <div className="super_rooftop_reg_table_wrapper">
            {rooftops.length > 0 ? (
              <table className="super_rooftop_reg_table">
                <thead>
                  <tr>
                    <th>Rooftop Name</th>
                    <th>City</th>
                    <th>Owner Name</th>
                    <th>Owner Contact No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooftops.map((rooftop, index) => (
                    <tr key={index}>
                      <td>{rooftop.rooftopName}</td>
                      <td>{rooftop.location}</td>
                      <td>{rooftop.name}</td>
                      <td>{rooftop.phoneNo}</td>
                      <td className="actions">
                        <Link
                          to={`/viewdetails/${rooftop.rooftopId}`}
                          state={{ rooftop: rooftop }}
                          className="super_rooftop_reg_view_btn"
                        >
                          View Details
                        </Link>
                        <button
                          className="super_rooftop_reg_accept_btn"
                          onClick={() => handleAccept(rooftop.adminEmail)}
                        >
                          Accept
                        </button>
                        <button
                          className='super_rooftop_reg_reject_btn'
                          onClick={() => handleReject(rooftop.adminEmail)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !loading && <div className="super_rooftop_reg_empty">No rooftops found</div>
            )}
          </div>
        </div>
        <div className="super_rooftop_reg_image">
          {/* <img src={img1} alt="Admin Body" /> */}
        </div>
      </div>
    </div>
  );
}
