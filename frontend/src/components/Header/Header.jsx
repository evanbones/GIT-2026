import React from "react";
import "./Header.css";
import { useAuth } from "../../contexts/useAuth.jsx";

function Header({ account, setAccount }) {
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
    )
  } else {
    links = (
      <div className="links">
        <a href="/map">Map</a>
        <a href="/sign-up">Sign up</a>
        <a href="/sign-in">Sign In</a>
      </div>
    )
  }

  return (
    <header className="navbar">
      <a href="/" className="navbar-brand">GRAEME</a>
      {links}
    </header>
  );
}

export default Header;
