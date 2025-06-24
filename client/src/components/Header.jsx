import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img 
            src="./src/assets/images/logo.jpg" 
            alt="ArtAura Logo" 
            height="70" 
            className="me-2"
            onError={(e) => {
              // Fallback if logo image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }}
          />
          <span className="fw-bold fs-4 text-gradient">ArtAura</span>
        </Link>

        {/* Mobile toggle button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/home')}`} to="/home">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/marketplace')}`} to="/marketplace">
                <i className="fas fa-shopping-bag me-1"></i>
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/competitions')}`} to="/competitions">
                <i className="fas fa-trophy me-1"></i>
                Competitions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">
                <i className="fas fa-images me-1"></i>
                Gallery
              </Link>
            </li>
          </ul>

          {/* Right side buttons */}
          <div className="navbar-nav">
            <Link className="nav-link" to="/profile">
              <i className="fas fa-user me-1"></i>
              Profile
            </Link>
            <Link className="btn btn-outline-light me-2" to="/login">
              <i className="fas fa-sign-in-alt me-1"></i>
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              <i className="fas fa-user-plus me-1"></i>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;