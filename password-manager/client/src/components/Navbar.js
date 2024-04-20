import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <button className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        &#9776;
      </button>
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
        {isAuthenticated ? (
          <>
            <Link to="/password-manager" className="nav-item" onClick={() => setIsMenuOpen(false)}>Password Manager</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-item" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

