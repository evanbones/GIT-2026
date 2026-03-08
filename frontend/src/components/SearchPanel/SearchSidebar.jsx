import React from "react";
import { Search } from "lucide-react";
import "./SearchPanel.css";

function SearchSidebar({ searchQuery, setSearchQuery, producers, onSelect }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "#fffdf7",
        padding: "20px",
        zIndex: 5,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--brand-serif)",
          marginTop: 0,
          marginBottom: "15px",
          fontSize: "1.5rem",
          color: "#3e2f1c",
          borderBottom: "2px solid #d4c4a8",
          paddingBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
        }}
      >
        Producers
      </h3>

      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="search-form"
          style={{
            width: "100%",
            maxWidth: "none",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search products or names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{
              flex: 1,
              minWidth: 0,
              width: "auto",
            }}
          />
          <button
            type="submit"
            className="search-button"
            style={{ flexShrink: 0 }}
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {producers.length > 0 ? (
          producers.map((dist) => (
            <div
              key={dist.id}
              onClick={() => onSelect(dist)}
              style={{
                padding: "15px",
                marginBottom: "10px",
                background: "#fffdf7",
                borderRadius: "4px",
                border: "1px solid #d4c4a8",
                borderLeft: "4px solid #4a7c59",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <h4
                style={{
                  margin: "0 0 5px 0",
                  color: "#3e2f1c",
                  fontWeight: 700,
                }}
              >
                {dist.name}
              </h4>
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "#f0ead2",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  color: "#7a5c3e",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                  border: "1px solid #d4c4a8",
                }}
              >
                {dist.type}
              </span>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#78695a",
                  marginTop: "10px",
                }}
              >
                {dist.products.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p
            style={{ color: "#78695a", textAlign: "center", marginTop: "40px" }}
          >
            No producers found.
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchSidebar;
