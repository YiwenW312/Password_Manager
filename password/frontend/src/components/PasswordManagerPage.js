import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../AuthContext'
import '../styles/PasswordManagerPage.css'
import CopyToClipboardButton from './CopyToClipboardButton'
import SharePasswordModal from './SharePasswordModal'
import EditPasswordModal from './EditPasswordModal'
import axios from 'axios'


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
  // share requests
  const [pendingShareRequests, setPendingShareRequests] = useState([])

  // Function to fetch or filter the passwords from the server
  const fetchPasswords = useCallback(async () => {
    const token = localStorage.getItem('token')
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    try {
      const endpoint = `${API_BASE_URL}/api/passwords/user/${currentUser.userId}`
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status !== 200)
        throw new Error(`HTTP error! Status: ${response.status}`)

      const data = response.data
      setPasswords(data)
      setFilteredPasswords(data)
      if (data.length === 0) {
        alert('No passwords found for this user.')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      console.error('Error fetching passwords:', errorMessage)
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

  // Function to generate a secure password or use the provided password
  const handlePasswordCreation = async e => {
    e.preventDefault()
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    const endpoint = `${API_BASE_URL}/api/passwords/newPasswords`

    const bodyContent = {
      url: newUrl,
      password: newPassword,
      useNumbers,
      useSymbols,
      length: passwordLength
    }

    try {
      const response = await axios.post(endpoint, bodyContent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = response.data
      if (response.status !== 200) {
        throw new Error(
          data.message || 'Error occurred while saving the password'
        )
      }

      setNewUrl('')
      setNewPassword('')
      setPasswordLength(12)
      setUseNumbers(true)
      setUseSymbols(false)
      fetchPasswords()

      // Optionally navigate or show a success message
      alert('Password successfully created')
    } catch (error) {
      console.error('Error:', error)
      alert(error.response?.data?.message || error.message)
    }
  }

  // Function to handle the deletion of a password
  const handleDelete = async id => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/passwords/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const data = response.data

      if (response.status !== 200) {
        throw new Error(data.message || 'Error occurred during delete');
      }

      alert('Password deleted successfully')
      fetchPasswords()
    } catch (error) {
      alert(error.response?.data?.message || error.message)
    }
  }

  // handle edit
  const handleEdit = passwordEntry => {
    setShowEditModal(true)
    setCurrentPassword(passwordEntry)
  }

  // Function to handle save changes
  const handleSaveChanges = async updatedPassword => {
    setShowEditModal(false)
    await submitEdit(updatedPassword)
  }

  // Function to submit the edited password
  const submitEdit = async ({ _id, url, password }) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    const token = localStorage.getItem('token')
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/passwords/${_id}`,
        { url, password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = response.data

      if (response.status !== 200) {
        throw new Error(data.message || 'Error occurred during edit');
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
      alert(error.response?.data?.message || error.message)
    }
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

  // Function to fetch pending request
  const fetchPendingShareRequests = useCallback(async () => {
    const token = localStorage.getItem('token')
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/share-requests/${currentUser.userId}/pending`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = response.data
      if (Array.isArray(data)) {
        setPendingShareRequests(data)
      } else {
        console.error('Expected data to be an array, but received:', data)
        setPendingShareRequests([])
      }
    } catch (error) {
      console.error('Error fetching pending share requests:', error)
      setPendingShareRequests([])
    }
  }, [currentUser.userId])

  useEffect(() => {
    fetchPendingShareRequests()
  }, [fetchPendingShareRequests])

  const handleAcceptShareRequest = async id => {
    const token = localStorage.getItem('token')
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    try {
      await axios.post(
        `${API_BASE_URL}/api/share-requests/${id}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchPendingShareRequests()
      fetchPasswords()
    } catch (error) {
      console.error('Error accepting share request:', error)
    }
  }

  const handleRejectShareRequest = async id => {
    const token = localStorage.getItem('token')
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
    try {
      await axios.post(
        `${API_BASE_URL}/api/share-requests/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      fetchPendingShareRequests()
    } catch (error) {
      console.error('Error rejecting share request:', error)
    }
  }

  return (
    <div className='password-manager-page'>
      <h2>Password Manager</h2>
      {/*serch bar*/}
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

      {/*share button*/}
      <button onClick={() => setShowShareModal(true)}>
        Share Password to Others
      </button>

      {/*password list*/}
      <ul className='password-list'>
        {filteredPasswords.map(passwordEntry => (
          <li key={passwordEntry._id}>
            <div className='password-info'>
              <strong>URL:</strong> {passwordEntry.url}
              <strong>Password:</strong>{' '}
              {showPasswordIds.has(passwordEntry._id)
                ? passwordEntry.password
                : '••••••'}
              <strong>Last Updated:</strong>{' '}
              {new Date(passwordEntry.updatedAt).toLocaleString()}
              {passwordEntry.type === 'shared' && (
                <p>Password owner: {passwordEntry.userId.username}</p>
              )}
            </div>
            <div className='password-actions'>
              {passwordEntry.type === 'own' ? (
                <>
                  <button
                    onClick={() => togglePasswordVisibility(passwordEntry._id)}
                  >
                    {showPasswordIds.has(passwordEntry._id) ? 'Hide' : 'Show'}
                  </button>
                  <CopyToClipboardButton text={passwordEntry.password} />
                  <button onClick={() => handleEdit(passwordEntry)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(passwordEntry._id)}>
                    Delete
                  </button>
                </>
              ) : (
                <p>Shared by: {passwordEntry.userId.username}</p>
              )}
            </div>
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
      {showShareModal && (
        <SharePasswordModal
          close={() => setShowShareModal(false)}
          passwordEntry={currentPassword}
          currentUser={currentUser}
        />
      )}
      {/*pending request*/}
      <h3>Pending Share Requests:</h3>
      <p>If you accept the request, you will see each other's passwords.</p>
      <ul>
        {Array.isArray(pendingShareRequests) &&
          pendingShareRequests.map(request => (
            <li key={request.id}>
              <p>
                {request.fromUser.username} want to share passwords with you!
              </p>
              <button onClick={() => handleAcceptShareRequest(request.id)}>
                Accept
              </button>
              <button onClick={() => handleRejectShareRequest(request.id)}>
                Reject
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default PasswordManagerPage
