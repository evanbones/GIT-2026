import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar.jsx";

function Header({ account, setAccount }) {
  let links;

  if (account) {
    links = (
      <div className="links">
        <a href="/map">Map</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/sign-out">Sign Out</a>
      </div>
    )
  } else {
    links = (
      <div className="links">
        <a href="/map">Map</a>
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
