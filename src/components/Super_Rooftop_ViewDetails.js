import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Super_Rooftop_ViewDetails.css';
import img1 from '../Images/SuperAdminBody.jpg';

export default function Super_Rooftop_ViewDetails(props) {
    const location = useLocation();
    const rooftop = location.state?.rooftop;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!rooftop) {
        return <div>No rooftop data available.</div>;
    }

    return (
        <div className={`s_mange_viewdetail ${isVisible ? 'fade-in' : ''}`}>
            <div className="s_manage_viewdetail_head">
                <h4>PERSONAL Details</h4>
            </div>

            <div className="s_manage_viewdetail_body">
                <div className="s_viewdetails_main">
                    <div className="personal_detail slide-up">
                        <div className="detail1">
                            <h5>Name:</h5>
                            <p>{rooftop.name}</p>
                        </div>
                        <div className="detail2">
                            <h5>Email:</h5>
                            <p>{rooftop.adminEmail}</p>
                        </div>
                        <div className="detail3">
                            <h5>Phone Number:</h5>
                            <p>{rooftop.phoneNo}</p>
                        </div>
                        <div className="detail4">
                            <h5>CNIC Number:</h5>
                            <p>{rooftop.cnic || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="rooftop_detail_head">
                        <h2>ROOFTOP DETAILS</h2>
                    </div>
                    <div className="rooftop_detail slide-up">
                        <div className="detail5">
                            <h5>Company Name:</h5>
                            <p>{rooftop.rooftopName}</p>
                        </div>
                        <div className="detail6">
                            <h5>Location:</h5>
                            <p>{rooftop.address || 'N/A'}</p>
                        </div>
                        <div className="detail7">
                            <h5>City:</h5>
                            <p>{rooftop.city || rooftop.location}</p>
                        </div>
                        <div className="detail8">
                            <h5>Time Schedule:</h5>
                            <p>{rooftop.startTime} - {rooftop.endTime || 'N/A'}</p>
                        </div>
                        <div className="detail9">
                            <h5>Number of Pitches:</h5>
                            <p>{rooftop.numberOfPitches || 'N/A'}</p>
                        </div>
                        <div className="detail10">
                            <h5>Price Per Hour:</h5>
                            <p>{rooftop.pricePerHour ? `Rs. ${rooftop.pricePerHour}` : 'N/A'}</p>
                        </div>
                        <div className="view_detail_img">
                            <h5>Rooftop Pictures:</h5>
                            <div className="view_detail_img1">
                                {rooftop.images && rooftop.images.length > 0 ? (
                                    rooftop.images.map((pic, index) => (
                                        <img
                                            key={index}
                                            src={`${props.ngrok_url}${pic}`}
                                            alt={`Rooftop ${index}`}
                                            className="img-animate"
                                        />
                                    ))
                                ) : (
                                    <p>No pictures available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="s_manage_viewdetails_img">
                    <img src={img1} alt="Super Admin Body" />
                </div>
            </div>
        </div>
    );
}
