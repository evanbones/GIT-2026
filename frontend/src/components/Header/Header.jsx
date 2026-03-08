import React from "react";
import { Link } from "react-router-dom"; 
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar.jsx";

function Header({ account, setAccount }) {
  const handleSignOut = (e) => {
    e.preventDefault();
    setAccount(false);
  };

  let links;

  if (account) {
    links = (
      <div className="links">
        <Link to="/map">Map</Link>
        <Link to="/dashboard">Dashboard</Link>
        <a href="/" onClick={handleSignOut}>Sign Out</a>
      </div>
    );
  } else {
    links = (
      <div className="links">
        <Link to="/map">Map</Link>
        <Link to="/sign-in">Sign In</Link>
        <Link to="/sign-up">Sign Up</Link>
      </div>
    );
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand-container">
        <img 
          src="/logo.png" 
          alt="Town Square Logo" 
          className="navbar-logo" 
        />
      </Link>
      {links}
    </header>
  );
}

export default Header;