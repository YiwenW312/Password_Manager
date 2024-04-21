import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/LoginPage.css';

function LoginPage() {
  const history = useNavigate();
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Call the login endpoint of your backend API
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Use the login function from your AuthProvider
      auth.login(data.token);

      // Redirect to the password manager page or another protected route
      history.push('/password-manager');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="main-content">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={togglePasswordVisibility}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
