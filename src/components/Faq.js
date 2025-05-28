import React, { useState, useEffect } from 'react';
import './Faq.css';
import plus from '../Images/faq_plus.png';
import fimg from '../Images/SuperAdminBody.jpg';

export default function Faq({ ngrok_url }) {
    const [visibleAnswers, setVisibleAnswers] = useState({});
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleAnswer = (index) => {
        setVisibleAnswers((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${ngrok_url}/api/Content/fetchfaqs`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch FAQs');
                }

                const data = await response.json();
                setFaqData(data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, [ngrok_url]);

    return (
        <div className='user_faq'>
            <p className='user_faq_p'>Frequently Asked Questions</p>

            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="fbody fade-in">
                    <div className="ftext">
                        {faqData.map((faq, index) => (
                            <div key={faq.id} className="faq-block">
                                <div className="faq-question" onClick={() => toggleAnswer(index)}>
                                    <p>Q: {faq.title}</p>
                                    <img
                                        src={plus}
                                        alt="Toggle Answer"
                                        className="plus-icon"
                                        style={{
                                            transform: visibleAnswers[index] ? 'rotate(45deg)' : 'rotate(0deg)',
                                        }}
                                    />
                                </div>
                                <div className="fhr"><hr /></div>
                                {visibleAnswers[index] && (
                                    <div className="faq-answer">
                                        <p>A: {faq.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="fimage">
                        <img src={fimg} alt="FAQ Illustration" />
                    </div>
                </div>
            )}
        </div>
    );
}
