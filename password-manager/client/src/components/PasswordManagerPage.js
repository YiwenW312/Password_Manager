import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/PasswordManagerPage.css';
import CopyToClipboardButton from './CopyToClipboardButton';
import SharePasswordModal from './SharePasswordModal';
import EditPasswordModal from './EditPasswordModal';


function PasswordManagerPage() {
  // Retrieve the current user and authentication status from the AuthContext
  const { currentUser, isAuthenticated } = useAuth();
  // State variables to store the passwords and the filtered passwords
  const [passwords, setPasswords] = useState([]);
  // State variable to store the filtered passwords
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  // State variable to store the search term
  const [searchTerm, setSearchTerm] = useState('');
  // State variables to store the new password and URL
  const [newPassword, setNewPassword] = useState('');
  const [newUrl, setNewUrl] = useState('');
  // State variables to store the editing status and the current password ID
  const [editing, setEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [showPasswordIds, setShowPasswordIds] = useState(new Set());
  // Password generation settings
  const [passwordLength, setPasswordLength] = useState(12);
  const [useLetters, setUseLetters] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  // State variable to store the shared passwords
  const [sharedPasswords, setSharedPasswords] = useState([]);
  // State variable to control the visibility of the SharePasswordModal component
  const [showShareModal, setShowShareModal] = useState(false);
  // State variable to store the loading status
  const [isLoading, setIsLoading] = useState(true);

  // Filter the passwords based on the search term
  useEffect(() => {
    setFilteredPasswords(passwords.filter(p =>
      p.url.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, passwords]);

  // Function to generate a secure password or use the provided password
  const handlePasswordCreation = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const endpoint = editing ? `http://localhost:3000/api/passwords/${currentId}` : 'http://localhost:3000/api/passwords/newPasswords';
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

  // Function to handle the deletion of a password
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

  // Function to submit the edited password
  const submitEdit = async ({ _id, url, password }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/passwords/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      // Refresh the password list
      fetchPasswords();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };


  // handle edit
  const handleEdit = (passwordEntry) => {
    setCurrentPassword(passwordEntry);
    setShowEditModal(true);
  };

  // Function to fetch the passwords from the server
  const fetchPasswords = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!currentUser || !currentUser._id) {
      console.error('Current user ID is not available.');
      return;
    }
    setIsLoading(true);  // Start loading
    try {
      const endpoint = `http://localhost:3000/api/passwords/user/${currentUser._id}`;
      console.log('Fetching from:', endpoint); 
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred while fetching the passwords');
      }
      setPasswords(data);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAuthenticated]);


  // Function to handle save changes
  const handleSaveChanges = async (updatedPassword) => {
    setShowEditModal(false);
    await submitEdit(updatedPassword);
  };

  // Function to handle the change in the search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  // Function to toggle the visibility of a password
  const togglePasswordVisibility = (id) => {
    setShowPasswordIds(prevIds => {
      const newShowPasswordIds = new Set(prevIds);
      if (newShowPasswordIds.has(id)) {
        newShowPasswordIds.delete(id);
      } else {
        newShowPasswordIds.add(id);
      }
      return newShowPasswordIds;
    });
  };

  // Function to handle show shared passwords
  const fetchSharedPasswords = useCallback(async () => {
    const endpoint = 'http://localhost:3000/api/passwords/shared';
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred while fetching shared passwords');
      }
      setSharedPasswords(data);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  }, [currentUser.token]);


  // Function to handle sharing a password (opens the SharePasswordModal component)
  const handleShare = (passwordEntry) => {
    setShowShareModal(true);
  };

  // Fetch the passwords when the component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated, fetchPasswords]);

  // Function to handle the fetching of shared passwords
  useEffect(() => {
    if (isAuthenticated) {
      fetchSharedPasswords();
    }
  }, [isAuthenticated, fetchSharedPasswords]);

  return (
    <div className="main-content">
      {isLoading ? (
        <p>Loading passwords...</p>
      ) : (
        <>
          <h2>Password Manager</h2>

          {/* Search functionality */}
          <input
            type="text"
            placeholder="Search passwords"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Save password group */}
          <form onSubmit={handlePasswordCreation}>
            <input type="text" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} required />
            <input type="text" placeholder="Password (leave empty to generate)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <div>
              <label>
                <input type="checkbox" checked={useLetters} onChange={() => setUseLetters(!useLetters)} /> Letters
              </label>
              <label>
                <input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} /> Numbers
              </label>
              <label>
                <input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} /> Symbols
              </label>
              <input type="number" placeholder="Length" value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))} />
            </div>
            <button type="submit">{newPassword ? "Update Password" : "Add Password"}</button>
          </form>

          {/* List of passwords */}
          <ul>
            {filteredPasswords.map((passwordEntry) => (
              <li key={passwordEntry._id}>
                URL: {passwordEntry.url}x
                <button onClick={() => togglePasswordVisibility(passwordEntry._id)}>
                  {showPasswordIds.has(passwordEntry._id) ? 'Hide' : 'Show'}
                </button>
                {showPasswordIds.has(passwordEntry._id) && <span>{passwordEntry.password}</span>}
                <CopyToClipboardButton text={passwordEntry.password} />
                <button onClick={() => handleEdit(passwordEntry)}>Edit</button>
                <button onClick={() => handleDelete(passwordEntry._id)}>Delete</button>
                <button onClick={() => handleShare(passwordEntry)}>Share</button>
              </li>
            ))}
          </ul>
          {showEditModal && (
            <EditPasswordModal
              currentPassword={currentPassword}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveChanges}
            />
          )}
          {/* Share password modal or component */}
          {showShareModal && <SharePasswordModal close={() => setShowShareModal(false)} />}

          {/*show shared passwords */}
          <h3>Shared Passwords:</h3>
          <ul>
            {sharedPasswords.map(sharedPasswordEntry => (
              <li key={sharedPasswordEntry._id}>
                URL: {sharedPasswordEntry.url}
                Password: {sharedPasswordEntry.password}
                Shared by: {sharedPasswordEntry.sharedBy}
              </li>
            ))}
          </ul>
        </>
      )}
        </div>
  );
}

export default PasswordManagerPage;
