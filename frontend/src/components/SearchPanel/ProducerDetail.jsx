import React, { useState } from "react";
import { X } from "lucide-react";

const ProductItem = ({ stock, onOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tiers = [...(stock.item.prices ?? [])].sort((a, b) => a.min_quantity - b.min_quantity);
  const basePrice = tiers[0]?.price_per_unit ?? 0;

  return (
    <div style={{ border: "2px solid #d4c4a8", borderRadius: "6px", marginBottom: "12px", overflow: "hidden", backgroundColor: "#fffdf7" }}>
      <div
        style={{ padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isExpanded ? "#faf6ef" : "#fffdf7", borderLeft: isExpanded ? "4px solid #4a7c59" : "4px solid transparent" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#3e2f1c" }}>{stock.item.name}</h5>
          <span style={{ fontSize: "0.85rem", color: "#78695a" }}>
            from ${Number(basePrice).toFixed(2)} / {stock.item.unit_type} · {stock.quantity} in stock
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "#c4a882", fontWeight: 700 }}>{isExpanded ? "▲" : "▼"}</span>
      </div>

      {isExpanded && (
        <div style={{ padding: "14px", borderTop: "2px solid #d4c4a8" }}>
          {tiers.length > 0 && (
            <table style={{ width: "100%", fontSize: "0.85rem", marginBottom: "15px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#7a5c3e", borderBottom: "1px solid #d4c4a8" }}>
                  <th style={{ paddingBottom: "6px" }}>Min qty</th>
                  <th style={{ paddingBottom: "6px" }}>Max qty</th>
                  <th style={{ paddingBottom: "6px" }}>Price / {stock.item.unit_type}</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t, i) => (
                  <tr key={i}>
                    <td style={{ padding: "6px 0", color: "#3e2f1c" }}>{t.min_quantity}</td>
                    <td style={{ padding: "6px 0", color: "#3e2f1c" }}>{t.max_quantity ?? "+"}</td>
                    <td style={{ padding: "6px 0", fontWeight: 700, color: "#3e2f1c" }}>${Number(t.price_per_unit).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => onOrder(stock, "DIRECT")} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#4a7c59", color: "white", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Direct
            </button>
            <button onClick={() => onOrder(stock, "GROUP")} style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "2px solid #4a7c59", backgroundColor: "transparent", color: "#4a7c59", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function ProducerDetail({ producer, stocks = [], onClose, onOrder }) {
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", background: "#fffdf7", padding: "25px", borderRight: "2px solid #c4a882", zIndex: 4, boxShadow: "4px 0 0 #d4c4a8" }}>
      <div style={{ display: "flex", justifyContent: "center", position: "relative", marginBottom: "20px", borderBottom: "2px solid #d4c4a8", paddingBottom: "15px", minHeight: "32px" }}>
        <h2 style={{ fontFamily: "var(--brand-serif)", margin: "0 35px", fontSize: "1.8rem", color: "#3e2f1c", textAlign: "center", lineHeight: "1.2" }}>
          {producer.name}
        </h2>
        <button
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          style={{ position: "absolute", top: "-4px", right: "0", border: "none", background: isCloseHovered ? "#f0e6d3" : "transparent", cursor: "pointer", color: isCloseHovered ? "#3e2f1c" : "#7a5c3e", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <p style={{ color: "#7a5c3e", fontSize: "0.9rem", marginBottom: "5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>{producer.type}</p>
        <p style={{ color: "#78695a", fontSize: "0.85rem", margin: 0 }}>📍 {producer.address}</p>
      </div>

      <h4 style={{ fontSize: "0.85rem", color: "#7a5c3e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "15px", fontWeight: 700, borderBottom: "1px solid #d4c4a8", paddingBottom: "8px" }}>
        Available Products
      </h4>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
        {stocks.length === 0 && (
          <p style={{ color: "#78695a", fontSize: "0.9rem", textAlign: "center", marginTop: "1rem" }}>No products listed.</p>
        )}
        {stocks.map((stock) => (
          <ProductItem
            key={stock.stock_id}
            stock={stock}
            onOrder={(s, mode) => onOrder(s, producer, mode)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProducerDetail;
