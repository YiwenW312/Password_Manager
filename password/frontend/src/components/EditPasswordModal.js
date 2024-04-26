import React, { useState } from 'react'
import '../styles/EditPasswordModal.css'

function EditPasswordModal ({ onClose, onSave, currentPassword }) {
  const [url, setUrl] = useState(currentPassword.url)
  const [password, setPassword] = useState(currentPassword.password)

  const handleSubmit = event => {
    event.preventDefault()
    onSave({ ...currentPassword, url, password })
  }

  return (
    <div className='edit-password-modal'>
      <div className='edit-modal-content'>
        <span className='edit-close' onClick={onClose}>
          &times;
        </span>
        <h2>Share Password</h2>
        <form onSubmit={handleSubmit}>
          <div className='edit-input-group'>
            <label>
              URL:
              <input
                type='text'
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
            </label>
          </div>
          <div className='edit-input-group'>
            <label>
              Password:
              <input
                type='text'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type='submit' className='edit-submit-button'>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPasswordModal
