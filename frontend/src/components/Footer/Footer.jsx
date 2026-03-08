import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/town-square-icon.png" alt="Town Square Logo" className="footer-logo" />
          <p>Rooted in community. Sourced locally.</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Explore</h4>
            <Link to="/map">Map</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <Link to="/">About Us</Link>
            <Link to="/">Contact</Link>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Town Square. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
