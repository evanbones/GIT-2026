import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../contexts/useAuth.jsx";

function Header() {
  const { isAuthenticated, signOut, user } = useAuth();
  let links;

  if (isAuthenticated) {
    links = (
      <div className="links">
        <Link to="/map" className="nav-link">Browse</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <button onClick={signOut} className="link-btn">
          {user?.picture && <img src={user.picture} alt="User Avatar" className="nav-avatar" />}
          Sign Out
        </button>
      </div>
    );
  } else {
    links = (
      <div className="links">
        <Link to="/map" className="nav-link">Map</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/sign-up" className="nav-link nav-link-primary">Sign Up</Link>
      </div>
    );
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand-container">
        <img
          src="/town-square-icon.png"
          alt="Town Square Icon"
          className="navbar-logo"
        />
      </Link>
      {links}
    </header>
  );
}

export default Header;
