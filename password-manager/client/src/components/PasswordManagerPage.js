import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have an Auth context

function PasswordManagerPage() {
  const { isAuthenticated } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated]);

  const handlePasswordCreation = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `http://localhost:5000/api/passwords/${currentId}` : 'http://localhost:5000/api/passwords';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url: newUrl, password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred while saving the password');
      }

      fetchPasswords();
      setEditing(false);
      setNewPassword('');
      setNewUrl('');
      setCurrentId(null);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/passwords/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete the password');
      }

      fetchPasswords();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleEdit = (passwordEntry) => {
    setEditing(true);
    setNewUrl(passwordEntry.url);
    setNewPassword(passwordEntry.password);
    setCurrentId(passwordEntry._id); // Assuming each password has a unique _id
  };

  return (
    <div>
      <h2>Password Manager</h2>
      <form onSubmit={handlePasswordCreation}>
        <input type="text" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button type="submit">{editing ? 'Update Password' : 'Add Password'}</button>
        {editing && <button onClick={() => { setEditing(false); setNewPassword(''); setNewUrl(''); }}>Cancel Edit</button>}
      </form>

      <ul>
        {passwords.map((passwordEntry) => (
          <li key={passwordEntry._id}>
            URL: {passwordEntry.url}, Password: {passwordEntry.password}
            <button onClick={() => handleEdit(passwordEntry)}>Edit</button>
            <button onClick={() => handleDelete(passwordEntry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordManagerPage;


