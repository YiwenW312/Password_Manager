import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const history = useHistory();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/'); 
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link to="/password-manager">Password Manager</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;

