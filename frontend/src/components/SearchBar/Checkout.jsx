import React, { useState } from "react";

const Checkout = ({ product, distributor, mode, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [targetQuantity, setTargetQuantity] = useState(50);
  const [step, setStep] = useState("FORM");

  {/* Hardocoded quantities for now*/}
  const getUnitPrice = (qty) => {
    if (qty >= 13) return Math.floor(product.basePrice * 0.8);
    if (qty >= 6) return Math.floor(product.basePrice * 0.9);
    return product.basePrice;
  };

  const currentUnitPrice = getUnitPrice(quantity);
  const totalPrice = currentUnitPrice * quantity;

  {/* Success message */}
  if (step === "SUCCESS") {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ fontFamily: "var(--brand-serif)", color: "#1a1a1a", marginBottom: "15px" }}>Order Confirmed</h2>
          <p style={{ color: "#666", lineHeight: "1.6" }}>
            Your request for <strong>{quantity} units</strong> of <strong>{product.name}</strong> has been received. 
            {mode === "GROUP" ? " We'll notify you once the group goal is reached." : ""}
          </p>
          <button onClick={onClose} style={primaryBtnStyle}>Return to Map</button>
        </div>
      </div>
    );
  }

  {/* changes window depending on if its a direct purchase or a group order */}
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontFamily: "var(--brand-serif)", margin: 0, fontSize: "1.5rem" }}>
            {mode === "DIRECT" ? "Direct Purchase" : "Start Group Order"}
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ background: "#f9f8f4", padding: "15px", borderRadius: "8px", marginBottom: "25px", border: "1px solid #eee" }}>
          <span style={{ fontSize: "0.8rem", color: "#999", textTransform: "uppercase" }}>{distributor.name}</span>
          <h4 style={{ margin: "5px 0 0 0", fontSize: "1.1rem" }}>{product.name}</h4>
        </div>

        {mode === "GROUP" && (
          <div style={{ marginBottom: "25px" }}>
            <label style={labelStyle}>Collective Target Quantity</label>
            <input 
              type="number" 
              value={targetQuantity} 
              onChange={(e) => setTargetQuantity(parseInt(e.target.value))} 
              style={inputStyle}
            />
            <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "8px" }}>
              Set the total units needed across all buyers to unlock the max discount tier (${Math.floor(product.basePrice * 0.8)}).
            </p>
          </div>
        )}

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>Your Quantity</label>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} 
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#999" }}>Estimated Total</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a" }}>${totalPrice}</div>
          </div>
          <button 
            onClick={() => setStep("SUCCESS")}
            style={primaryBtnStyle}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};
const modalStyle = {
  background: "white", padding: "40px", borderRadius: "16px", width: "450px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
};
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "0.85rem", color: "#1a1a1a" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", boxSizing: "border-box" };
const primaryBtnStyle = { 
  backgroundColor: "#1a1a1a", color: "white", padding: "14px 28px", 
  borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem" 
};

export default Checkout;
