import React, { useState } from "react";
import { Search } from "lucide-react";
import "./SearchPanel.css";

/**
 * SearchPanel Component
 * A standalone search bar component used in the Header and Sidebar.
 */
function SearchPanel() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" aria-label="Search">
          <Search size={20} />
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
