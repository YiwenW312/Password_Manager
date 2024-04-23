import React, { useState } from 'react'

function EditPasswordModal ({ onClose, onSave, currentPassword }) {
  const [url, setUrl] = useState(currentPassword.url)
  const [password, setPassword] = useState(currentPassword.password)

  const handleSubmit = event => {
    event.preventDefault()
    onSave({ ...currentPassword, url, password })
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <label>
            URL:
            <input
              type='text'
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type='text'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button type='submit'>Save Changes</button>
        </form>
      </div>
    </div>
  )
}

export default EditPasswordModal
