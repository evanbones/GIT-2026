import React, { useState } from "react";

const ProductItem = ({ product, onOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  {/* hardcoded pricing tiers for now*/}
  const tiers = [
    { qty: "1-5", price: product.basePrice },
    { qty: "6-12", price: Math.floor(product.basePrice * 0.9) },
    { qty: "13+", price: Math.floor(product.basePrice * 0.8) },
  ];

  return (
    <div style={{ 
      border: "1px solid #eee", 
      borderRadius: "8px", 
      marginBottom: "12px",
      overflow: "hidden",
      backgroundColor: "white"
    }}>
      <div 
        style={{ 
          padding: "14px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          cursor: "pointer",
          background: isExpanded ? "#fafafa" : "white"
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{product.name}</h5>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>Starting at ${product.basePrice}</span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "#ccc" }}>{isExpanded ? "▲" : "▼"}</span>
      </div>

      {isExpanded && (
        <div style={{ padding: "14px", borderTop: "1px solid #eee" }}>
          <table style={{ width: "100%", fontSize: "0.85rem", marginBottom: "15px" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#aaa" }}>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t, i) => (
                <tr key={i}>
                  <td style={{ padding: "4px 0" }}>{t.qty} units</td>
                  <td style={{ padding: "4px 0", fontWeight: 600 }}>${t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => onOrder(product, "DIRECT")}
              style={{ 
                flex: 1, padding: "10px", borderRadius: "6px", border: "none", 
                backgroundColor: "#1a1a1a", color: "white", cursor: "pointer",
                fontSize: "0.85rem", fontWeight: 500
              }}
            >
              Direct
            </button>
            <button 
              onClick={() => onOrder(product, "GROUP")}
              style={{ 
                flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #1a1a1a", 
                backgroundColor: "transparent", color: "#1a1a1a", cursor: "pointer",
                fontSize: "0.85rem", fontWeight: 500
              }}
            >
              Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function DistributorDetail({ distributor, onClose, onOrder }) {
  return (
    <div style={{ 
      width: "400px", 
      display: "flex", 
      flexDirection: "column",
      background: "white",
      padding: "25px",
      borderRight: "1px solid #e0e0e0",
      zIndex: 4,
      boxShadow: "10px 0 15px rgba(0,0,0,0.02)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontFamily: "var(--brand-serif)", margin: 0, fontSize: "1.8rem" }}>{distributor.name}</h2>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
      </div>

      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "5px" }}>{distributor.type}</p>
      <p style={{ color: "#999", fontSize: "0.85rem", marginBottom: "25px" }}>📍 {distributor.address}</p>

      <h4 style={{ fontSize: "0.9rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "15px" }}>Available Products</h4>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {distributor.fullProducts.map((prod, idx) => (
          <ProductItem 
            key={idx} 
            product={prod} 
            onOrder={(p, mode) => onOrder(p, distributor, mode)} 
          />
        ))}
      </div>
    </div>
  );
}

export default DistributorDetail;
