import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar.jsx";

function Header({ account, setAccount }) {
  let links;
  if (account) {
    // Add account-specific links here
  }

  return (
    <header className="navbar">

      <a href="/map">Map</a>
      <a href="/dashboard">Dashboard</a>
    </header>
  );
}

export default Header;
