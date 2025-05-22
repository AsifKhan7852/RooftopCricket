import React, { useState, useEffect } from 'react';
import './Super_Manage_Faq.css';
import img1 from '../Images/SuperAdminBody.jpg';

export default function Super_Manage_Faq(props) {
    const [faqs, setFaqs] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedAnswer, setEditedAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchFaqs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${props.ngrok_url}/api/Content/fetchfaqs`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await response.json();
            
            const transformedFaqs = data.map(faq => ({
                id: faq.id,
                question: faq.title.toUpperCase(),
                answer: faq.description.split('\n').filter(line => line.trim())
            }));
            
            setFaqs(transformedFaqs);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleAddNew = () => {
        setShowAddForm(true);
    };

    const handleSaveNew = async () => {
        if (newQuestion.trim() && newAnswer.trim()) {
            setIsLoading(true);
            try {
                const response = await fetch(`${props.ngrok_url}/api/Content/createfaqs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({
                        title: newQuestion,
                        description: newAnswer
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create FAQ');
                }

                await fetchFaqs();
                setNewQuestion('');
                setNewAnswer('');
                setShowAddForm(false);
            } catch (error) {
                console.error('Error creating FAQ:', error);
                alert('Failed to save FAQ. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancelAdd = () => {
        setNewQuestion('');
        setNewAnswer('');
        setShowAddForm(false);
    };

    const handleEdit = (faq) => {
        setEditingId(faq.id);
        setEditedQuestion(faq.question);
        setEditedAnswer(faq.answer.join('\n'));
    };

    const handleSaveEdit = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${props.ngrok_url}/api/Content/updatefaqs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    title: editedQuestion,
                    description: editedAnswer
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update FAQ');
            }

            await fetchFaqs();
            setEditingId(null);
        } catch (error) {
            console.error('Error updating FAQ:', error);
            alert('Failed to update FAQ. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            setIsLoading(true);
            try {
                const response = await fetch(`${props.ngrok_url}/api/Content/deleteFaq/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete FAQ');
                }

                await fetchFaqs();
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                alert('Failed to delete FAQ. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='super-manage-faq'>
            <div className="super-manage-faq-header">
                <h4>FAQ Management</h4>
            </div>

            <div className="super-manage-faq-body">
                <div className="super-faq-main">
                    <div className="super-faq-header">
                        <div className="super-faq-heading">
                            Main Heading Text:
                        </div>
                        <div className="super-faq-heading-text">
                            <h4>For Cricket Rooftop booking system,</h4>
                            <h4>the FAQs might include the following points:</h4>
                        </div>
                    </div>

                    <div className="super-faq-body">
                        <div className="super-faq-heading">
                            FAQs:
                        </div>
                        <div className="super-faq-border">
                            {isLoading ? (
                                <div className="spinner-container">
                                    <div className="spinner"></div>
                                    <p>Loading FAQs...</p>
                                </div>
                            ) : (
                                faqs.map((faq, index) => (
                                    <div className="super-faq-body-text fade-in" key={faq.id}>
                                        {editingId === faq.id ? (
                                            <>
                                                <div className="super-faq-question">
                                                    <input
                                                        type="text"
                                                        value={editedQuestion}
                                                        onChange={(e) => setEditedQuestion(e.target.value)}
                                                        className="super-faq-input"
                                                    />
                                                </div>
                                                <div className="super-faq-body-text1">
                                                    <textarea
                                                        value={editedAnswer}
                                                        onChange={(e) => setEditedAnswer(e.target.value)}
                                                        className="super-faq-textarea"
                                                    />
                                                </div>
                                                <div className="super-faq-buttons">
                                                    <button onClick={() => handleSaveEdit(faq.id)} className="super-faq-button save">Save</button>
                                                    <button onClick={handleCancelEdit} className="super-faq-button cancel">Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="super-faq-question">
                                                    {index + 1}. {faq.question}
                                                </div>
                                                <div className="super-faq-body-text1">
                                                    {faq.answer.map((line, i) => (
                                                        <h4 key={i} className="super-faq-answer-line">{line}</h4>
                                                    ))}
                                                </div>
                                                <div className="super-faq-buttons">
                                                    <button onClick={() => handleEdit(faq)} className="super-faq-button edit">Edit</button>
                                                    <button onClick={() => handleDelete(faq.id)} className="super-faq-button delete">Delete</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}

                            {showAddForm && !isLoading && (
                                <div className="super-faq-body-text fade-in">
                                    <div className="super-faq-question">
                                        <input
                                            type="text"
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder="Enter new question"
                                            className="super-faq-input"
                                        />
                                    </div>
                                    <div className="super-faq-body-text1">
                                        <textarea
                                            value={newAnswer}
                                            onChange={(e) => setNewAnswer(e.target.value)}
                                            placeholder="Enter answer (separate points with new lines)"
                                            className="super-faq-textarea"
                                        />
                                    </div>
                                    <div className="super-faq-buttons">
                                        <button onClick={handleSaveNew} className="super-faq-button save">Save</button>
                                        <button onClick={handleCancelAdd} className="super-faq-button cancel">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="super-manage-faq-img">
                    <img src={img1} alt="" />
                </div>
            </div>
            <div className="super-faq-btn">
                <button onClick={handleAddNew} className="super-faq-button add">Add New</button>
            </div>
        </div>
    );
}