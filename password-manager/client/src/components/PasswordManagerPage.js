import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; 
import '../styles/PasswordManagerPage.css';
import CopyToClipboardButton from './CopyToClipboardButton'; 


function PasswordManagerPage() {
  const { isAuthenticated } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showPasswordIds, setShowPasswordIds] = useState(new Set());
  
  const [passwordLength, setPasswordLength] = useState(12); 
  const [useLetters, setUseLetters] = useState(true); 
  const [useNumbers, setUseNumbers] = useState(true); 
  const [useSymbols, setUseSymbols] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated]);

  const togglePasswordVisibility = (id) => {
    const newSet = new Set(showPasswordIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setShowPasswordIds(newSet);
  };
  // Whenever passwords or searchTerm state updates, update the filteredPasswords state
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = passwords.filter(passwordEntry =>
      passwordEntry.url.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredPasswords(filteredData);
  }, [passwords, searchTerm]);

  const handlePasswordCreation = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `http://localhost:3000/api/passwords/${currentId}` : 'http://localhost:3000/api/passwords';

  
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
      const response = await fetch(`http://localhost:3000/api/passwords/${id}`, {
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
    setCurrentId(passwordEntry._id);
  };

  const fetchPasswords = async () => {
    const token = localStorage.getItem('token'); // Retrieve the auth token from storage

    try {
      const response = await fetch('http://localhost:3000/api/passwords', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred while fetching the passwords');
      }
      setPasswords(data); // Update the passwords state with the fetched passwords
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-content">
      <h2>Password Manager</h2>
      <input
        type="text"
        placeholder="Search passwords"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <form onSubmit={handlePasswordCreation}>
        <input type="text" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        <input type="text" placeholder="Password (leave empty to generate)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        {/* Password generation settings */}
        <div>
          <input type="number" placeholder="Length" value={passwordLength} onChange={(e) => setPasswordLength(e.target.value)} />
          <label><input type="checkbox" checked={useLetters} onChange={() => setUseLetters(!useLetters)} /> Letters</label>
          <label><input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} /> Numbers</label>
          <label><input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} /> Symbols</label>
        </div>
        <button type="submit">{editing ? "Update Password" : "Add Password"}</button>
      </form>
      <ul>
        {filteredPasswords.map((passwordEntry) => (
          <li key={passwordEntry._id}>
            URL: {passwordEntry.url}
            <button onClick={() => togglePasswordVisibility(passwordEntry._id)}>
              {showPasswordIds.has(passwordEntry._id) ? 'Hide' : 'Show'}
            </button>
            {showPasswordIds.has(passwordEntry._id) ? passwordEntry.password : '••••••••'}
            <CopyToClipboardButton text={passwordEntry.password} />
            <button onClick={() => handleEdit(passwordEntry)}>Edit</button>
            <button onClick={() => handleDelete(passwordEntry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default PasswordManagerPage;
