import React, { useState } from "react";

const Checkout = ({ product, producer, mode, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [targetQuantity, setTargetQuantity] = useState(50);
  const [step, setStep] = useState("FORM");
  const [confirmed, setConfirmed] = useState(false);

  {/* Hardocoded quantities for now*/ }
  const getUnitPrice = (qty) => {
    if (qty >= 13) return Math.floor(product.basePrice * 0.8);
    if (qty >= 6) return Math.floor(product.basePrice * 0.9);
    return product.basePrice;
  };

  const currentUnitPrice = getUnitPrice(quantity);
  const totalPrice = currentUnitPrice * quantity;

  {/* Success message */ }
  if (step === "SUCCESS") {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ fontFamily: "var(--brand-serif)", color: "#3e2f1c", marginBottom: "15px" }}>Order Confirmed</h2>
          <p style={{ color: "#78695a", lineHeight: "1.6" }}>
            Your request for <strong>{quantity} units</strong> of <strong>{product.name}</strong> has been received.
            {mode === "GROUP" ? " We'll notify you once the group goal is reached." : ""}
          </p>
          <button onClick={onClose} style={primaryBtnStyle}>Return to Map</button>
        </div>
      </div>
    );
  }

  {/* changes window depending on if its a direct purchase or a group order */ }
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "2px solid #d4c4a8", paddingBottom: "15px" }}>
          <h3 style={{ fontFamily: "var(--brand-serif)", margin: 0, fontSize: "1.5rem", color: "#3e2f1c" }}>
            {mode === "DIRECT" ? "Direct Purchase" : "Start Group Order"}
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#7a5c3e", fontSize: "1.1rem" }}>✕</button>
        </div>

        <div style={{ background: "#faf6ef", padding: "15px", borderRadius: "4px", marginBottom: "25px", border: "2px solid #d4c4a8", borderLeft: "4px solid #4a7c59" }}>
          <span style={{ fontSize: "0.8rem", color: "#7a5c3e", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>{producer.name}</span>
          <h4 style={{ margin: "5px 0 0 0", fontSize: "1.1rem", color: "#3e2f1c" }}>{product.name}</h4>
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
            <p style={{ fontSize: "0.75rem", color: "#78695a", marginTop: "8px" }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ margin: 0, flexShrink: 0 }} />
          <label style={{ fontWeight: 700, fontSize: "0.65rem", textAlign: "left", color: "#3e2f1c", textTransform: "uppercase", letterSpacing: "0.03em" }}>I confirm that I meet all applicable legal and platform requirements to place this order.</label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #d4c4a8", paddingTop: "20px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#7a5c3e", textTransform: "uppercase", fontWeight: 700 }}>Estimated Total</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3e2f1c" }}>${totalPrice}</div>
          </div>
          <button
            onClick={() => setStep("SUCCESS")}
            disabled={!confirmed}
            style={{ ...primaryBtnStyle, ...(confirmed ? {} : { opacity: 0.5, cursor: "not-allowed" }) }}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div >
  );
};

const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(62, 47, 28, 0.4)", backdropFilter: "blur(4px)",
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
};
const modalStyle = {
  background: "#fffdf7", padding: "40px", borderRadius: "8px", width: "450px",
  boxShadow: "0 6px 0 rgba(122, 92, 62, 0.1)", border: "2px solid #c4a882"
};
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "0.85rem", color: "#3e2f1c", textTransform: "uppercase", letterSpacing: "0.03em" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "4px", border: "2px solid #d4c4a8", fontSize: "1rem", boxSizing: "border-box", color: "#3e2f1c", backgroundColor: "#fffdf7" };
const primaryBtnStyle = {
  backgroundColor: "#4a7c59", color: "white", padding: "14px 28px",
  borderRadius: "5px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem",
  textTransform: "uppercase", letterSpacing: "0.04em"
};

export default Checkout;
