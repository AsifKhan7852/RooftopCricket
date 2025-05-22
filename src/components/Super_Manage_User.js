import React, { useState, useEffect } from 'react';
import './Super_Manage_User.css';
import search from '../Images/search.png';
import img1 from '../Images/admin_body.png';
import Super_Admin_Navbar from './Super_Admin_Navbar';

const Super_Manage_User = (props) => {
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    try {
      const stored = localStorage.getItem('superadmin');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    } catch (e) {
      console.error('Error parsing superadmin token:', e);
      return null;
    }
  };

  const fetchCustomers = async (status) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/UsersManagement/customers/byRooftop?status=${status}`,
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
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (email) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    const shouldBlock = status === 'Active';
    const action = shouldBlock ? 'block' : 'unblock';

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/UsersManagement/blockUnblockRegisteredUser/${encodeURIComponent(email)}?block=${shouldBlock}`,
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
        throw new Error(`Failed to ${action} user`);
      }

      const result = await response.text();
      alert(result);
      fetchCustomers(status);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(error.message);
    }
  };

  const handleDelete = async (userid) => {
    const token = getToken();
    if (!token) {
      window.location.href = '/super-admin-login';
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(
        `${props.ngrok_url}/api/RegisteredUser/delete/${userid}`,
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
        throw new Error('Failed to delete user');
      }

      const result = await response.text();
      alert(result);
      fetchCustomers(status);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCustomers(status);
    } else {
      window.location.href = '/super_signin';
    }
  }, [status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => { };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.phoneNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="super-manage-user">
      <Super_Admin_Navbar bc="#3E8989"/>
      <div className="s_manageuser_head">
        <h4>Users Management</h4>
      </div>

      <div className="s_manageuser_body">
        <div className="s_manageuser_text">
          <div className="s_manageuser_calender">
            <div className="s_user_search_main">
              <input
                className="s_manageuser_calender_input"
                type="text"
                placeholder="Search by Phone no"
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
              />
              <div className="s_manageuser_search" onClick={handleSearchClick}>
                <img src={search} alt="Search Icon" />
              </div>
            </div>

            <select
              className="s_manageuser_active"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <div className="loading-message">Loading users...</div>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}

          <div className="s_manageuser_table-container fade-in">
            {filteredCustomers.length > 0 ? (
              <table className="s_manageuser_custom-table">
                <thead>
                  <tr>
                    <th>User Email</th>
                    <th>Phone no.</th>
                    <th>Successful Booking</th>
                    <th>Canceled Booking</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.email}</td>
                      <td>{customer.phoneNo}</td>
                      <td>{customer.successfulBookings || 0}</td>
                      <td>{customer.cancelledBookings || 0}</td>
                      <td className="s_manageuser_actions">
                        <button
                          className={`s_manageuser_button ${status === 'Active' ? 'block-btn' : 'unblock-btn'
                            }`}
                          onClick={() => handleBlockUnblock(customer.email)}
                        >
                          {status === 'Active' ? 'Block' : 'Unblock'}
                        </button>
                        <button
                          className="s_manageuser_deletebtn"
                          onClick={() => handleDelete(customer.userid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !loading && (
                <div className="no-users-message fade-in">
                  No {status} users found
                </div>
              )
            )}
          </div>
        </div>
        <div className="s_manageuser_img">
          {/* <img src={img1} alt="Admin Body" /> */}
        </div>
      </div>
    </div>
  );
};

export default Super_Manage_User;
