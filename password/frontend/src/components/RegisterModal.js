import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import '../styles/RegisterModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const RegisterModal = ({ close }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        username,
        password
      });

      // Handle response directly for successful registration
      localStorage.setItem('token', response.data.token);
      await login(username, password);
      close();
      navigate('/password-manager');
    } catch (error) {
      console.error('Registration failed:', error);
      // Check for HTML response on error
      const responseData = error.response ? error.response.data : '';
      if (typeof responseData === 'string' && responseData.startsWith('<!DOCTYPE')) {
        alert('Database is not ready, try again later.');
        setError('Database is not ready, try again later.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong during registration';
        setError(errorMessage);
      }
    }
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={close}>
          &times;
        </span>
        <h2>Register</h2>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleRegister}>
          <label htmlFor='username'>Username:</label>
          <input
            id='username'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className='input-group'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              id='confirm-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='password-toggle'
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button type='submit' className='register-button'>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
