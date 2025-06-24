import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="./src/assets/images/logo-white.jpg" 
                alt="ArtAura Logo" 
                height="35" 
                className="me-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <h5 className="mb-0 text-gradient">ArtAura</h5>
            </div>
            <p className="text-muted">
              Connecting artists and art lovers worldwide. Discover, buy, sell, and compete 
              with amazing artworks from talented artists around the globe.
            </p>
            {/* Social Media Links */}
            <div className="social-links">
              <a href="#" className="text-light me-3" aria-label="Facebook">
                <i className="fab fa-facebook-f fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Twitter">
                <i className="fab fa-twitter fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Instagram">
                <i className="fab fa-instagram fs-5"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in fs-5"></i>
              </a>
              <a href="#" className="text-light" aria-label="YouTube">
                <i className="fab fa-youtube fs-5"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/home" className="text-muted text-decoration-none">
                  <i className="fas fa-home me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/marketplace" className="text-muted text-decoration-none">
                  <i className="fas fa-shopping-bag me-2"></i>Marketplace
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/competitions" className="text-muted text-decoration-none">
                  <i className="fas fa-trophy me-2"></i>Competitions
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="text-muted text-decoration-none">
                  <i className="fas fa-images me-2"></i>Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* For Artists */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">For Artists</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-upload me-2"></i>Upload Art
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-chart-line me-2"></i>Artist Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-graduation-cap me-2"></i>Resources
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-handshake me-2"></i>Commission
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-question-circle me-2"></i>Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-envelope me-2"></i>Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-shield-alt me-2"></i>Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-file-contract me-2"></i>Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-2 col-md-12 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Newsletter</h6>
            <p className="text-muted small">
              Stay updated with the latest competitions and featured artworks.
            </p>
            <form className="newsletter-form">
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email"
                  aria-label="Email for newsletter"
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted small mb-0">
              © 2024 ArtAura. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="payment-icons">
              <i className="fab fa-cc-visa text-muted me-2 fs-5"></i>
              <i className="fab fa-cc-mastercard text-muted me-2 fs-5"></i>
              <i className="fab fa-cc-paypal text-muted me-2 fs-5"></i>
              <i className="fab fa-cc-stripe text-muted fs-5"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;