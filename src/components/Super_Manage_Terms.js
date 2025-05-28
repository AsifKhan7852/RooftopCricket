import React, { useState, useEffect } from 'react';
import './Super_Manage_Terms.css';
import mainImage from '../Images/SuperAdminBody.jpg';

export default function ManageTerms(props) {
  const [terms, setTerms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedHeading, setEditedHeading] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHeading, setNewHeading] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔃 Fetch Terms & Conditions from API
  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${props.ngrok_url}/api/Content/fetchTermsAndConditions`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        const formatted = data.map(item => ({
          id: item.id,
          heading: item.title,
          content: item.description.split('\n')
        }));
        setTerms(formatted);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTerms();
  }, [props.ngrok_url]);

  const handleEdit = (term) => {
    setEditingId(term.id);
    setEditedHeading(term.heading);
    setEditedContent(term.content.join('\n'));
  };

  // ✏️ Update API
  const handleUpdate = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${props.ngrok_url}/api/Content/updateTermsAndConditions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          Title: editedHeading,
          Description: editedContent
        })
      });
      const text = await response.text();
      console.log('Update response:', text);
      const updatedTerms = terms.map(term =>
        term.id === id ? { ...term, heading: editedHeading, content: editedContent.split('\n') } : term
      );
      setTerms(updatedTerms);
      setEditingId(null);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ❌ Delete API
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`${props.ngrok_url}/api/Content/deleteTermsAndConditions/${id}`, {
          method: 'DELETE',
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const text = await response.text();
        console.log('Delete response:', text);
        setTerms(terms.filter(term => term.id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
  };

  // ➕ Add API
  const handleSaveNew = async () => {
    if (newHeading.trim() && newContent.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(`${props.ngrok_url}/api/Content/createpolicy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            Title: newHeading,
            Description: newContent
          })
        });
        const resText = await response.text();
        console.log('Add response:', resText);

        const newTerm = {
          id: Date.now(), // Placeholder, ideally backend should return actual ID
          heading: newHeading.toUpperCase(),
          content: newContent.split('\n')
        };
        setTerms([...terms, newTerm]);
        setNewHeading('');
        setNewContent('');
        setShowAddForm(false);
      } catch (err) {
        console.error('Add error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelAdd = () => {
    setNewHeading('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className='manage_terms_container'>
      <div className="manage_terms_header">
        <h4>Terms & Conditions Management</h4>
      </div>

      <div className="manage_terms_body">
        <div className="manage_terms_content">
          <div className="terms_section_header">
            <div className="section_title">Main Heading Text:</div>
            <div className="section_text">
              <h4>For Cricket Rooftop booking system,</h4>
              <h4>the Terms & Conditions include:</h4>
            </div>
          </div>

          <div className="terms_section_body">
            <div className="section_title">Manage Terms & Conditions:</div>
            <div className="terms_list_container">
              {isLoading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <p>Loading Terms...</p>
                </div>
              ) : (
                <>
                  {terms.map((term, index) => (
                    <div className="term_item fade-in" key={term.id}>
                      {editingId === term.id ? (
                        <>
                          <div className="term_input_group">
                            <input
                              type="text"
                              value={editedHeading}
                              onChange={(e) => setEditedHeading(e.target.value)}
                              className="term_input"
                            />
                          </div>
                          <div className="term_content_group">
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="term_textarea"
                            />
                          </div>
                          <div className="action_buttons">
                            <button onClick={() => handleUpdate(term.id)} className="action_button update">Update</button>
                            <button onClick={() => setEditingId(null)} className="action_button cancel">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="term_title">{index + 1}. {term.heading}</div>
                          <div className="term_content">
                            {term.content.map((line, i) => (
                              <h4 key={i}>{line}</h4>
                            ))}
                          </div>
                          <div className="action_buttons">
                            <button onClick={() => handleEdit(term)} className="action_button edit">Edit</button>
                            <button onClick={() => handleDelete(term.id)} className="action_button delete">Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  {showAddForm && !isLoading && (
                    <div className="add_term_form fade-in">
                      <div className="form_input_group">
                        <input
                          type="text"
                          value={newHeading}
                          onChange={(e) => setNewHeading(e.target.value)}
                          placeholder="Enter new heading"
                          className="term_input"
                        />
                      </div>
                      <div className="form_content_group">
                        <textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Enter content (separate points with new lines)"
                          className="term_textarea"
                        />
                      </div>
                      <div className="action_buttons">
                        <button onClick={handleSaveNew} className="action_button save">Save</button>
                        <button onClick={handleCancelAdd} className="action_button cancel">Cancel</button>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {!isLoading && (
                <div className="add_term_button_container">
                  <button onClick={handleAddNew} className="action_button add">Add New</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}