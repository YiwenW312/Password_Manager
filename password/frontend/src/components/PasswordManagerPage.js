import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../AuthContext'
import '../styles/PasswordManagerPage.css'
import CopyToClipboardButton from './CopyToClipboardButton'
import SharePasswordModal from './SharePasswordModal'
import EditPasswordModal from './EditPasswordModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function PasswordManagerPage () {
  // Retrieve the current user and authentication status from the AuthContext
  const { currentUser } = useAuth()
  // State variables to store the passwords and the filtered passwords
  const [passwords, setPasswords] = useState([])
  // State variable to store the filtered passwords
  const [filteredPasswords, setFilteredPasswords] = useState([])
  // State variable to store the search term
  const [searchTerm, setSearchTerm] = useState('')
  // State variables to store the new password and URL
  const [newPassword, setNewPassword] = useState('')
  const [newUrl, setNewUrl] = useState('')
  // State variables to store the editing status and the current password ID
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [showPasswordIds, setShowPasswordIds] = useState(new Set())
  // Password generation settings
  const [passwordLength, setPasswordLength] = useState(12)
  const [useLetters, setUseLetters] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(false)
  // State variable to control the visibility of the SharePasswordModal component
  const [showShareModal, setShowShareModal] = useState(false)
  // State variable to store the loading status
  const [isLoading, setIsLoading] = useState(true)
  // share requests
const [pendingShareRequests, setPendingShareRequests] = useState([]);
const [acceptedShareRequests, setAcceptedShareRequests] = useState([]);

  /**
   * All Fetch functions are defined here
   * fetchPasswords: Fetches the passwords from the server
   * fetchSharedPasswords: Fetches the shared passwords from the server
   * userEffect: Fetches the passwords and shared passwords when the component mounts
   * userEffect: Filters the passwords based on the search term
   * handleSearchChange: Handles the change in the search term
   */
  // Function to fetch or filter the passwords from the server
  const fetchPasswords = useCallback(async () => {
    const token = localStorage.getItem('token')

    setIsLoading(true)
    try {
      const endpoint = `http://localhost:3000/api/passwords/user/${currentUser.userId}`
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`)
      const data = await response.json()
      setPasswords(data)
      setFilteredPasswords(data)
    } catch (error) {
      console.error('Error fetching passwords:', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  // Fetch the passwords when the component mounts
  useEffect(() => {
    fetchPasswords()
  }, [fetchPasswords])

  // Filter the passwords based on the search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredPasswords(
        passwords.filter(p =>
          p.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredPasswords(passwords)
    }
  }, [searchTerm, passwords])

  // Function to handle the change in the search term
  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  /**
   * All functions to handle password creation, deletion, editing, and sharing
   * handlePasswordCreation: Generates a secure password or uses the provided password
   * handleDelete: Deletes a password
   * handleEdit: Handles the editing of a password
   * handleSaveChanges: Handles saving the changes to a password
   * submitEdit: Submits the edited password
   *
   */
  // Function to generate a secure password or use the provided password
  const handlePasswordCreation = async e => {
    e.preventDefault()
    const method = 'POST'
    const endpoint = 'http://localhost:3000/api/passwords/newPasswords'
    const bodyContent = {
      url: newUrl,
      password: newPassword,
      useNumbers,
      useSymbols,
      length: passwordLength
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyContent)
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data.message || 'Error occurred while saving the password'
        )
      }

      // Resetting fields on successful creation or navigate to a different page or update the state
      setNewUrl('')
      setNewPassword('')
      setPasswordLength(12)
      setUseNumbers(true)
      setUseSymbols(false)

      fetchPasswords()
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  // Function to handle the deletion of a password
  const handleDelete = async id => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/passwords/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete the password')
      }
      alert('Password deleted successfully')
      fetchPasswords()
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  // handle edit
  const handleEdit = passwordEntry => {
    setCurrentPassword(passwordEntry)
    setShowEditModal(true)
  }

  // Function to handle save changes
  const handleSaveChanges = async updatedPassword => {
    setShowEditModal(false)
    await submitEdit(updatedPassword)
  }

  // Function to submit the edited password
  const submitEdit = async ({ _id, url, password }) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(
        `http://localhost:3000/api/passwords/${_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ url, password })
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password')
      }

      // Update the state with the new password list
      setPasswords(prevPasswords => {
        return prevPasswords.map(p => {
          if (p._id === _id) {
            return { ...p, url, password }
          }
          return p
        })
      })
      alert('Update successfully')
    } catch (error) {
      console.error('Error:', error)
      alert(error.message)
    }
  }

  // Function to handle sharing a password (opens the SharePasswordModal component)
  const handleShare = passwordEntry => {
    setCurrentPassword(passwordEntry)
    setShowShareModal(true)
  }

  // Function to toggle the visibility of a password
  const togglePasswordVisibility = id => {
    setShowPasswordIds(prevIds => {
      const newShowPasswordIds = new Set(prevIds)
      if (newShowPasswordIds.has(id)) {
        newShowPasswordIds.delete(id)
      } else {
        newShowPasswordIds.add(id)
      }
      return newShowPasswordIds
    })
  }

  const fetchPendingShareRequests = async () => {
    const response = await fetch(`http://localhost:3000/api/passwords/shared/${currentUser.userId}?status=pending`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    if (response.ok) {
      setPendingShareRequests(data); 
    } else {
      console.error(data.message || 'Failed to fetch pending share requests');
    }
  };

  const fetchAcceptedShareRequests = async () => {
    const response = await fetch(`http://localhost:3000/api/passwords/shared/${currentUser.userId}?status=accepted`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    if (response.ok) {
      setAcceptedShareRequests(data);  
    } else {
      console.error(data.message || 'Failed to fetch accepted share requests');
    }
  };
  
  useEffect(() => {
    fetchAcceptedShareRequests();
    fetchPendingShareRequests();
  }, [currentUser.userId]);

  const acceptShareRequest = async id => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/share-requests/${id}/accept`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept share request')
      }
      alert('Share request accepted')
      fetchAcceptedShareRequests()
    } catch (error) {
      console.error('Error accepting share request:', error)
    }
  }

  // Reject share request
  const rejectShareRequest = async id => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/share-requests/${id}/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject share request')
      }
      alert('Share request rejected')
      fetchPendingShareRequests()
    } catch (error) {
      console.error('Error rejecting share request:', error)
    }
  }

  return (
    <div className='password-manager-page'>
      <h2>Password Manager</h2>
      {/* Search functionality */}
      <input
        type='text'
        placeholder='Search passwords'
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button
        onClick={() =>
          setFilteredPasswords(
            passwords.filter(p =>
              p.url.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        }
      >
        Search
      </button>

      {/* Add password */}
      <form onSubmit={handlePasswordCreation}>
        <input
          type='text'
          placeholder='URL'
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Password (leave empty to generate)'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <div>
          <label>
            <input
              type='checkbox'
              checked={useLetters}
              onChange={() => setUseLetters(!useLetters)}
            />{' '}
            Letters
          </label>
          <label>
            <input
              type='checkbox'
              checked={useNumbers}
              onChange={() => setUseNumbers(!useNumbers)}
            />{' '}
            Numbers
          </label>
          <label>
            <input
              type='checkbox'
              checked={useSymbols}
              onChange={() => setUseSymbols(!useSymbols)}
            />{' '}
            Symbols
          </label>
          <input
            type='number'
            placeholder='Length'
            value={passwordLength}
            min={4}
            max={50}
            onChange={e => setPasswordLength(parseInt(e.target.value, 10))}
          />
        </div>
        <button type='submit'>Add Password</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* List of passwords */}
          <ul className='password-list'>
            {filteredPasswords.map(passwordEntry => (
              <li key={passwordEntry._id}>
                <div>
                  <strong>URL:</strong> {passwordEntry.url}
                  <strong>Password:</strong> {passwordEntry.password}
                  <button
                    onClick={() => togglePasswordVisibility(passwordEntry._id)}
                    className='password-toggle'
                  >
                    <FontAwesomeIcon
                      icon={
                        showPasswordIds.has(passwordEntry._id)
                          ? faEyeSlash
                          : faEye
                      }
                      className='fa-icon'
                    />
                  </button>
                </div>
                <div className='password-actions'>
                  <CopyToClipboardButton text={passwordEntry.password} />
                  <button onClick={() => handleEdit(passwordEntry)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(passwordEntry._id)}>
                    Delete
                  </button>
                  <button onClick={() => handleShare(passwordEntry)}>
                    Share
                  </button>
                  {showPasswordIds.has(passwordEntry._id) && (
                    <span>{passwordEntry.password}</span>
                  )}
                </div>
                <div>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(passwordEntry.updatedAt).toLocaleDateString()}{' '}
                  {new Date(passwordEntry.updatedAt).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>

          {/* Edit password modal */}
          {showEditModal && (
            <EditPasswordModal
              currentPassword={currentPassword}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveChanges}
            />
          )}

          {/* Share password modal or component */}
          {showShareModal && (
            <SharePasswordModal close={() => setShowShareModal(false)}
            passwordEntry={currentPassword}
            fromUser={currentUser}
            />
          )}

          {/*show shared passwords */}
          <h3>Passwords Shared by Others:</h3>
          <ul>
            {acceptedShareRequests.map(request => (
              <li key={request.id}>
                URL: {request.url}
                Password: {request.password}
                Shared by: {request.sharedBy}
              </li>
            ))}
          </ul>
        </>
      )}

      {/*show shared passwords requests*/}
        <div>
          <h3>Pending Share Requests:</h3>
          <ul>
            {pendingShareRequests.map(request => (
              <li key={request.id}>
                <p>
                  URL: {request.url} - Shared by: {request.owner}
                </p>
                <button onClick={() => acceptShareRequest(request.id)}>
                  Accept
                </button>
                <button onClick={() => rejectShareRequest(request.id)}>
                  Reject
                </button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default PasswordManagerPage
