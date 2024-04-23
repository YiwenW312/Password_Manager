import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <Link to="/password-manager" className="nav-item" onClick={() => setIsMenuOpen(false)}>
              {`${currentUser.username}'s Password Manager`}
            </Link>
            <Link className="nav-item" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <>
            <Link className="nav-item" onClick={() => setShowLoginModal(true)}>Login</Link>
            <Link className="nav-item" onClick={() => setShowRegisterModal(true)}>Register</Link>
          </>
        )}
      </div>
      {showLoginModal && <LoginModal close={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal close={() => setShowRegisterModal(false)} />}
    </nav>
  );
}

export default Navbar;
