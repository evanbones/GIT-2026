import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar.jsx";

function Header() {
  return (
    <header className="navbar">
      <div className="container">
        <div className="search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
