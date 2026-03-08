import React from "react";
import "./Header.css";

function Header({ account, setAccount }) {
  let links;

  if (account) {
    links = (
      <div className="links">
        <a href="/map">Browse</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/sign-out">Sign Out</a>
      </div>
    )
  } else {
    links = (
      <div className="links">
        <a href="/map">Browse</a>
        <a href="/sign-in">Sign In</a>
        <a href="/sign-up">Sign up</a>
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
