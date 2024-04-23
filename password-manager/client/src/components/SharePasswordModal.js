import React, { useState } from 'react';
import '../styles/SharePasswordModal.css';


const SharePasswordModal = ({ close, passwordId }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/share-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toUsername: username,
          passwordId: passwordId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to share password.');
      }

      alert('Password shared successfully.');
      close();
    } catch (error) {
      console.error('Sharing failed:', error);
      setError(error.message);
    }
  };

  return (
    <div className="share-password-modal">
      <div className="modal-content">
        <span className="close" onClick={close}>&times;</span>
        <h2>Share Password</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleShare}>
          <input
            type="text"
            placeholder="Enter username to share with"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SharePasswordModal;
