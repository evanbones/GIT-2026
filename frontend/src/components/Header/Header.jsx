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
        <a href="/map">Browse</a>
        <a href="/dashboard">Dashboard</a>
        <button onClick={signOut} className="link-btn">
          {user?.picture && <img src={user.picture} alt="" className="nav-avatar" />}
          Sign Out
        </button>
      </div>
    );
  } else {
    links = (
      <div className="links">
        <Link to="/map">Map</Link>
        <Link to="/login">Login</Link>
        <Link to="/sign-up">Sign Up</Link>
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
