import React, { useState } from 'react';
import { submitContact } from '../../lib/api/contact';

/**
 * Example contact form component
 */
const ContactFormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    action: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: submitError } = await submitContact(formData);

    if (submitError) {
      setError(submitError);
    } else {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        action: 'general',
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Contact Form Example</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div>
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div>
          <label>
            Action:
            <select
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="general">General Inquiry</option>
              <option value="project">Project Inquiry</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Message:
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows="5"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}

      {success && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#efe', color: '#3c3', borderRadius: '4px' }}>
          Thank you! Your message has been submitted successfully.
        </div>
      )}
    </div>
  );
};

export default ContactFormExample;

