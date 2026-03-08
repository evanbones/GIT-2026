import React from "react";
import { Search } from "lucide-react";
import "./SearchPanel.css";

/**
 * SearchSidebar Component
 * Integrates the search input with a scrollable list of results.
 */
function SearchSidebar({ searchQuery, setSearchQuery, distributors, onSelect }) {
  return (
    <div style={{ 
      width: "350px", 
      display: "flex", 
      flexDirection: "column",
      background: "white",
      borderRight: "1px solid #e0e0e0",
      padding: "20px",
      zIndex: 5
    }}>
      <h3 style={{ 
        fontFamily: "var(--brand-serif)", 
        marginTop: 0, 
        marginBottom: "15px",
        fontSize: "1.5rem" 
      }}>
        Distributors
      </h3>
      
      {/* Search Bar Input */}
      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <form onSubmit={(e) => e.preventDefault()} className="search-form" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Search products or names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: "100%" }}
          />
          <div className="search-button">
            <Search size={18} />
          </div>
        </form>
      </div>

      {/* Results List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {distributors.length > 0 ? (
          distributors.map((dist) => (
            <div 
              key={dist.id}
              onClick={() => onSelect(dist)}
              style={{
                padding: "15px",
                marginBottom: "10px",
                background: "#fdfdfd",
                borderRadius: "8px",
                border: "1px solid #eee",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", color: "#1a1a1a", fontWeight: 600 }}>{dist.name}</h4>
              <span style={{ 
                fontSize: "0.75rem", 
                background: "#f0f0f0", 
                padding: "3px 8px", 
                borderRadius: "12px",
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.03em"
              }}>
                {dist.type}
              </span>
              <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "10px" }}>
                {dist.products.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", textAlign: "center", marginTop: "40px" }}>No distributors found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchSidebar;
