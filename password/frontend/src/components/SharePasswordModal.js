import React, { useState } from 'react';
import '../styles/SharePasswordModal.css';
import axios from 'axios'


const SharePasswordModal = ({ close, currentUser }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please login again.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axios.post('/api/share-requests/', {
        fromUserId: currentUser.userId,
        toUsername: username,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = response.data;
      if (response.status !== 200) {
        throw new Error(
          data.message || 'Error occurred while saving the password'
        )
      }
      alert('Share request sent successfully.');
      handleModalClose();
    } catch (error) {
      console.error('Send failed:', error);
      setError(error.response?.data?.message || error.message || 'Unable to send share request.');
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setUsername('');
    setError('');
    setIsSubmitting(false);
    close();
  };

  return (
    <div className='share-password-modal'>
      <div className='modal-content'>
        <span className='close' onClick={handleModalClose}>
          &times;
        </span>
        <h2>Share Password</h2>
        {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleShare}>
          <input
            type='text'
            placeholder='Enter username to share with'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Sharing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SharePasswordModal;

