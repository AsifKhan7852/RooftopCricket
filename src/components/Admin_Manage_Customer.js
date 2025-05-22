import React, { useEffect, useState } from 'react';
import './Admin_Manage_Customer.css';
import search from '../Images/search.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_Manage_Customer(props) {
    const [customers, setCustomers] = useState([]);
    const [status, setStatus] = useState('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminsignin = JSON.parse(localStorage.getItem('adminsignin')) || {};
    const rooftops = adminsignin.rooftops || [];
    const rooftopId = rooftops.length > 0 ? rooftops[0].rooftopId : null;
    const token = adminsignin.token;

    const fetchCustomers = async (status) => {
        if (!token || !rooftopId) {
            window.location.href = '/admin-login';
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${props.ngrok_url}/api/UsersManagement/customers/byRooftop?status=${status}&rooftopId=${rooftopId}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminsignin');
                    window.location.href = '/admin-login';
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
        if (!token) {
            window.location.href = '/admin-login';
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
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('adminsignin');
                    window.location.href = '/admin-login';
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

    useEffect(() => {
        if (rooftopId && token) {
            fetchCustomers(status);
        } else {
            window.location.href = '/admin-login';
        }
    }, [status, rooftopId, token]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.phoneNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='admin_manage_customers_container'>
        <Admin_Navbar bc="#3E8989" />
            <div className="admin_manage_customers_header fade-in">
                <h4>Customer Management</h4>
            </div>

            <div className="admin_manage_customers_search">
                <input
                    className='admin_manage_customers_input'
                    type="text"
                    placeholder='Search customer by Phone No'
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select
                    className='admin_manage_customers_status'
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </div>

            {loading && (
                <div className="admin_manage_customers_spinner_wrapper">
                    <div className="spinner"></div>
                </div>
            )}
            {error && <div className="admin_manage_customers_error">{error}</div>}

            <div className="admin_manage_customers_table_wrapper">
                <div className="admin_manage_customers_table_container">
                    {filteredCustomers.length > 0 ? (
                        <table className="admin_manage_customers_table slide-up">
                            <thead>
                                <tr>
                                    <th>Customer Email</th>
                                    <th>Phone no.</th>
                                    <th>Successful Booking</th>
                                    <th>Canceled Booking</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={index} className="table-row-hover">
                                        <td>{customer.email}</td>
                                        <td>{customer.phoneNo}</td>
                                        <td>{customer.successfulBookings || 0}</td>
                                        <td>{customer.cancelledBookings || 0}</td>
                                        <td className="admin_manage_customers_actions">
                                            <button
                                                className={`admin_manage_customers_button ${status === 'Active' ? 'block-btn' : 'unblock-btn'}`}
                                                onClick={() => handleBlockUnblock(customer.email)}
                                            >
                                                {status === 'Active' ? 'Block' : 'Unblock'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !loading && <div className="admin_manage_customers_noresults">No customers found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
