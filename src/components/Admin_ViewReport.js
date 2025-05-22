import React, { useState, useEffect } from 'react';
import './Admin_ViewReport.css';
import search from '../Images/search.png';
import Admin_Navbar from './Admin_Navbar';

export default function Admin_ViewReport(props) {
    const [metrics, setMetrics] = useState({ totalBookings: 0, average: 0, totalRevenue: 0 });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [reportType, setReportType] = useState('Daily');

    const fetchDailyReport = async (date) => {
        try {
            const adminsignin = JSON.parse(localStorage.getItem('adminsignin'));
            const rooftopId = adminsignin?.rooftops?.[0]?.rooftopId || 1;
            const response = await fetch(
                `${props.ngrok_url}/api/Reports/GetDailyReport?rooftopId=${rooftopId}&date=${date}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );
            const data = await response.json();
            if (data.length > 0) {
                const report = data[0];
                setMetrics({
                    totalBookings: report.totalBookings,
                    average: report.dailyAverage,
                    totalRevenue: report.totalRevenue
                });
            } else {
                setMetrics({ totalBookings: 0, average: 0, totalRevenue: 0 });
            }
        } catch (error) {
            console.error('Error fetching daily report:', error);
            setMetrics({ totalBookings: 0, average: 0, totalRevenue: 0 });
        }
    };

    const fetchMonthlyReport = async (month) => {
        try {
            const adminsignin = JSON.parse(localStorage.getItem('adminsignin'));
            const rooftopId = adminsignin?.rooftops?.[0]?.rooftopId || 1;
            const response = await fetch(
                `${props.ngrok_url}/api/Reports/GetMonthlyReport?rooftopId=${rooftopId}&month=${month}`,
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );
            const data = await response.json();
            if (data.length > 0) {
                const report = data[0];
                setMetrics({
                    totalBookings: report.totalBookings,
                    average: report.monthlyAverage,
                    totalRevenue: report.totalRevenue
                });
            } else {
                setMetrics({ totalBookings: 0, average: 0, totalRevenue: 0 });
            }
        } catch (error) {
            console.error('Error fetching monthly report:', error);
            setMetrics({ totalBookings: 0, average: 0, totalRevenue: 0 });
        }
    };

    const handleReportTypeChange = (type) => {
        setReportType(type);
        setSelectedDate('');
        setIsDropdownOpen(false);
        setMetrics({ totalBookings: 0, average: 0, totalRevenue: 0 });
    };

    const handleDateSearch = () => {
        if (selectedDate) {
            if (reportType === 'Daily') {
                fetchDailyReport(selectedDate);
            } else if (reportType === 'Monthly') {
                fetchMonthlyReport(selectedDate);
            }
        }
    };

    return (
        <div className='adminvr-container'>
            <Admin_Navbar bc="#3E8989" />
            
            <div className='adminvr-header'>
                <h1 className='adminvr-title'>Reports Dashboard</h1>
            </div>

            <div className='adminvr-controls'>
                <div className='adminvr-filter-group'>
                    <div className='adminvr-dropdown'>
                        <button 
                            className='adminvr-dropdown-toggle'
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {reportType}
                            <span className='adminvr-dropdown-arrow'>▼</span>
                        </button>
                        {isDropdownOpen && (
                            <div className='adminvr-dropdown-menu'>
                                <button 
                                    className='adminvr-dropdown-item'
                                    onClick={() => handleReportTypeChange('Daily')}
                                >
                                    Daily
                                </button>
                                <button 
                                    className='adminvr-dropdown-item'
                                    onClick={() => handleReportTypeChange('Monthly')}
                                >
                                    Monthly
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className='adminvr-date-picker'>
                        {reportType === 'Daily' ? (
                            <input
                                type='date'
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className='adminvr-date-input'
                            />
                        ) : (
                            <input
                                type='month'
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className='adminvr-month-input'
                            />
                        )}
                        <button 
                            className='adminvr-search-btn'
                            onClick={handleDateSearch}
                        >
                            <img src={search} alt='Search' className='adminvr-search-icon' />
                
                        </button>
                    </div>
                </div>
            </div>

            <div className='adminvr-metrics'>
                <div className='adminvr-metric-card'>
                    <span className='adminvr-metric-label'>Total Bookings</span>
                    <span className='adminvr-metric-value'>{metrics.totalBookings}</span>
                </div>
                
                <div className='adminvr-metric-card'>
                    <span className='adminvr-metric-label'>Average Booking</span>
                    <span className='adminvr-metric-value'>{metrics.average}</span>
                </div>
                
                <div className='adminvr-metric-card'>
                    <span className='adminvr-metric-label'>Total Revenue</span>
                    <span className='adminvr-metric-value'>${metrics.totalRevenue}</span>
                </div>
            </div>
        </div>
    );
}