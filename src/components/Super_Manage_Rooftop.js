import React, { useState, useEffect } from 'react';
import './Super_Manage_Rooftop.css';
import arrow from '../Images/arrow.png';
import img1 from '../Images/admin_body.png';
import search from '../Images/search.png';
import Super_Admin_Navbar from './Super_Admin_Navbar';

export default function Super_Manage_Rooftop(props) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'Active',
        rooftopName: '',
        city: ''
    });

    const getAuthToken = () => {
        try {
            const stored = localStorage.getItem('superadmin');
            if (!stored) return '';
            const parsed = JSON.parse(stored);
            return parsed.token || '';
        } catch (e) {
            return '';
        }
    };

    useEffect(() => {
        fetchRooftops();
    }, [filters.status, filters.city]);

    const fetchRooftops = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();

            if (!token) {
                window.location.href = '/super-admin-login';
                return;
            }

            const params = new URLSearchParams();
            params.append('status', filters.status);
            if (filters.rooftopName) params.append('rooftopName', filters.rooftopName);
            if (filters.city) params.append('city', filters.city);

            const response = await fetch(
                `${props.ngrok_url}/api/Rooftop/fetchRooftopWithFilters?${params.toString()}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            const formattedData = data.map(item => ({
                id: item.rooftopId,
                rooftop_name: item.rooftopName,
                city: item.location,
                onwner_name: item.name || "Owner",
                owner_contact: item.phoneNo || "N/A",
                email: item.adminEmail || "N/A"
            }));

            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching rooftops:", error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUnblock = async (email) => {
        const action = filters.status === 'Active' ? 'Block' : 'Unblock';
        const confirmAction = window.confirm(`Are you sure you want to ${action} this admin?`);
        if (!confirmAction) return;

        try {
            const token = getAuthToken();
            if (!token) {
                window.location.href = '/super-admin-login';
                return;
            }

            const shouldBlock = filters.status === 'Active';
            const response = await fetch(
                `${props.ngrok_url}/api/UsersManagement/blockUnblockAdmin/${email}?block=${shouldBlock}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to update status');
            await response.text();
            fetchRooftops();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (email) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
        if (!confirmDelete) return;

        try {
            const token = getAuthToken();
            if (!token) {
                window.location.href = '/super-admin-login';
                return;
            }

            const response = await fetch(
                `${props.ngrok_url}/api/UsersManagement/deleteAdmin/${email}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to delete admin');
            await response.text();
            fetchRooftops();
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchClick = () => {
        fetchRooftops();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchRooftops();
        }
    };

    return (
        <div className='s_mange_rooftop'>
        <Super_Admin_Navbar bc="#3E8989"/>
            <div className="s_managerooft_head">
                <h4>Rooftop Management</h4>
            </div>

            <div className="s_manageroof_body">
                <div className="s_manageroof_text">
                    <div className="s_manageroof_calender">
                        <div className="search_main">
                            <input 
                                className='s_manageroof_calender_input' 
                                type="text" 
                                placeholder='Search Rooftop by Name'
                                name="rooftopName"
                                value={filters.rooftopName}
                                onChange={handleFilterChange}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="s_manageroof_search" onClick={handleSearchClick}>
                                <img src={search} alt="search" />
                            </div>
                        </div>

                        <select 
                            name="status" 
                            className='s_manageroof_active'
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Blocked">Blocked</option>
                        </select>

                        <select 
                            name="city" 
                            className='s_manageroof_active'
                            value={filters.city}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Cities</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                        </select>
                    </div>

                    <div className="s_manageroof_table-container">
                        <table className="s_manageroof_custom-table">
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
                                {rows.length > 0 ? (
                                    rows.map((row) => (
                                        <tr key={row.id} className="fade-in-row">
                                            <td>{row.rooftop_name}</td>
                                            <td>{row.city}</td>
                                            <td>{row.onwner_name}</td>
                                            <td>{row.owner_contact}</td>
                                            <td className="s_manageroof_actions">
                                                <button 
                                                    className="s_manageroof_button"
                                                    onClick={() => handleBlockUnblock(row.email)}
                                                >
                                                    {filters.status === 'Active' ? 'Block' : 'Unblock'}
                                                </button>
                                                <button 
                                                    className="s_manageroof_deletebtn"
                                                    onClick={() => handleDelete(row.email)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            {loading ? 'Loading...' : 'No rooftops found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="s_manageroof_img">
                    {/* <img src={img1} alt="background decoration" /> */}
                </div>
            </div>
        </div>
    );
}
