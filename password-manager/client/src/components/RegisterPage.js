// src/components/RegisterPage.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the Auth context

function RegisterPage() {
  const history = useHistory();
  const auth = useAuth(); // Use the custom hook for authentication logic
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Call the register endpoint of your backend API
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during registration');
      }

      // Use the login function from your AuthProvider
      // Assume that your backend automatically logs the user in upon registration
      auth.login(data.token);

      // Redirect to the login page or directly to password manager if auto-login is enabled
      history.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
