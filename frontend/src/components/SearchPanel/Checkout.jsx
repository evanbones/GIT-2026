import { useState } from "react";
import { b2bAPI, inventoryAPI } from "../../utils/api";

const getUnitPrice = (tiers, qty) => {
  const sorted = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  let price = sorted[0]?.price_per_unit ?? 0;
  for (const tier of sorted) {
    if (qty >= tier.min_quantity) price = tier.price_per_unit;
    else break;
  }
  return Number(price);
};

const Checkout = ({ stock, producer, mode, groupBuy, user, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [targetQuantity, setTargetQuantity] = useState(50);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState("FORM"); // FORM | SUBMITTING | SUCCESS | ERROR
  const [errorMsg, setErrorMsg] = useState(null);

  const tiers = stock?.item?.prices ?? [];
  const unitPrice = getUnitPrice(tiers, quantity);
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const remaining = groupBuy ? groupBuy.target_quantity - groupBuy.current_quantity : Infinity;
  const validationError = (() => {
    if (quantity < 1) return "Quantity must be at least 1.";
    if (quantity > (stock?.quantity ?? Infinity)) return `Only ${stock?.quantity} ${stock?.item?.unit_type} available in stock.`;
    if (mode === "JOIN" && quantity > remaining) return `Only ${remaining} ${groupBuy.item_unit} remaining to fill this group buy.`;
    if (mode === "GROUP" && targetQuantity > (stock?.quantity ?? Infinity)) return `Target cannot exceed available stock (${stock?.quantity} ${stock?.item?.unit_type}).`;
    if (mode === "GROUP" && targetQuantity < 1) return "Target quantity must be at least 1.";
    return null;
  })();

  const handleConfirm = async () => {
    setStep("SUBMITTING");
    setErrorMsg(null);
    try {
      if (mode === "DIRECT") {
        await b2bAPI.createOffer({
          retailer_id: user?.id,
          producer_id: producer?.id,
          item_id: stock?.item?.id,
          offered_price: unitPrice,
          requested_quantity: quantity,
          status: "pending",
        });
      } else if (mode === "JOIN") {
        await b2bAPI.joinGroupBuy(groupBuy.id, {
          retailer_id: user?.id,
          pledged_quantity: quantity,
        });
      } else {
        await b2bAPI.createGroupBuy({
          initiator_retailer_id: user?.id,
          item_id: stock?.item?.id,
          target_quantity: targetQuantity,
          deadline,
          status: "open",
        });
      }
      await inventoryAPI.updateStock(stock.stock_id, { quantity_delta: -quantity });
      onSuccess?.(mode);
      setStep("SUCCESS");
    } catch (err) {
      setErrorMsg(err.message);
      setStep("ERROR");
    }
  };

  if (step === "SUCCESS") {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ fontFamily: "var(--brand-serif)", color: "#3e2f1c", marginBottom: "15px" }}>
            {mode === "DIRECT" ? "Offer Submitted" : mode === "JOIN" ? "Joined Group Buy" : "Group Buy Started"}
          </h2>
          <p style={{ color: "#78695a", lineHeight: "1.6" }}>
            {mode === "DIRECT" && <>Your offer for <strong>{quantity} {stock?.item?.unit_type}</strong> of <strong>{stock?.item?.name}</strong> from <strong>{producer?.name}</strong> has been received.</>}
            {mode === "JOIN" && <>You've pledged <strong>{quantity} {stock?.item?.unit_type}</strong> of <strong>{stock?.item?.name}</strong> to the group buy.</>}
            {mode === "GROUP" && <>Your group buy for <strong>{stock?.item?.name}</strong> is open. Other retailers can now join to hit the target quantity.</>}
          </p>
          <button onClick={onClose} style={primaryBtnStyle}>Return to Map</button>
        </div>
      </div>
    );
  }

  if (step === "ERROR") {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ fontFamily: "var(--brand-serif)", color: "#c1694f", marginBottom: "15px" }}>Something went wrong</h2>
          <p style={{ color: "#78695a", lineHeight: "1.6" }}>{errorMsg}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setStep("FORM")} style={{ ...primaryBtnStyle, background: "#7a5c3e" }}>Go Back</button>
            <button onClick={onClose} style={primaryBtnStyle}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "2px solid #d4c4a8", paddingBottom: "15px" }}>
          <h3 style={{ fontFamily: "var(--brand-serif)", margin: 0, fontSize: "1.5rem", color: "#3e2f1c" }}>
            {mode === "DIRECT" ? "Direct Purchase" : mode === "JOIN" ? "Join Group Buy" : "Start Group Order"}
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#7a5c3e", fontSize: "1.1rem" }}>✕</button>
        </div>

        {/* Item info */}
        <div style={{ background: "#faf6ef", padding: "15px", borderRadius: "4px", marginBottom: "25px", border: "2px solid #d4c4a8", borderLeft: "4px solid #4a7c59" }}>
          <span style={{ fontSize: "0.8rem", color: "#7a5c3e", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>{producer?.name}</span>
          <h4 style={{ margin: "5px 0 2px", fontSize: "1.1rem", color: "#3e2f1c" }}>{stock?.item?.name}</h4>
          <span style={{ fontSize: "0.8rem", color: "#78695a" }}>{stock?.quantity} {stock?.item?.unit_type} available</span>
        </div>

        {/* Price tiers summary */}
        {tiers.length > 0 && (
          <div style={{ marginBottom: "20px", fontSize: "0.82rem", color: "#7a5c3e" }}>
            {[...tiers].sort((a, b) => a.min_quantity - b.min_quantity).map((t, i) => (
              <span key={i} style={{ marginRight: "12px" }}>
                {t.min_quantity}{t.max_quantity ? `–${t.max_quantity}` : "+"}: <strong style={{ color: "#3e2f1c" }}>${Number(t.price_per_unit).toFixed(2)}</strong>
              </span>
            ))}
          </div>
        )}

        {mode === "JOIN" && groupBuy && (
          <div style={{ marginBottom: "20px", padding: "12px", background: "#edf7f0", border: "1px solid #a8d5b5", borderRadius: "5px", fontSize: "0.85rem", color: "#2d6a4f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span><strong>{groupBuy.current_quantity}</strong> / {groupBuy.target_quantity} {groupBuy.item_unit} pledged</span>
              <span>Closes {new Date(groupBuy.deadline).toLocaleDateString()}</span>
            </div>
            <div style={{ height: "6px", background: "#c8e6c9", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#4a7c59", borderRadius: "999px", width: `${Math.min(100, (groupBuy.current_quantity / groupBuy.target_quantity) * 100)}%` }} />
            </div>
          </div>
        )}

        {mode === "GROUP" && (
          <div style={{ marginBottom: "25px", display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Target Quantity</label>
              <div style={unitWrapStyle}>
                <input
                  type="number" min="1" max={stock?.quantity}
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Math.min(parseInt(e.target.value) || 1, stock?.quantity ?? Infinity))}
                  style={{ ...inputStyle, paddingRight: "3.5rem" }}
                />
                <span style={unitLabelStyle}>{stock?.item?.unit_type}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>{mode === "JOIN" ? "Your Pledge" : "Your Quantity"}</label>
          <div style={unitWrapStyle}>
            <input
              type="number" min="1"
              max={mode === "JOIN"
                ? Math.min(stock?.quantity ?? Infinity, groupBuy ? groupBuy.target_quantity - groupBuy.current_quantity : Infinity)
                : stock?.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ ...inputStyle, paddingRight: "3.5rem" }}
            />
            <span style={unitLabelStyle}>{stock?.item?.unit_type}</span>
          </div>
          {mode !== "JOIN" && (
            <p style={{ fontSize: "0.75rem", color: "#78695a", marginTop: "6px" }}>
              Unit price at this quantity: <strong>${unitPrice.toFixed(2)}</strong>
            </p>
          )}
        </div>

        {validationError && (
          <p style={{ fontSize: "0.8rem", color: "#c1694f", marginBottom: "12px", fontWeight: 600 }}>{validationError}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ margin: 0, flexShrink: 0 }} />
          <label style={{ fontWeight: 700, fontSize: "0.65rem", textAlign: "left", color: "#3e2f1c", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            I confirm that I meet all applicable legal and platform requirements to place this order.
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #d4c4a8", paddingTop: "20px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "#7a5c3e", textTransform: "uppercase", fontWeight: 700 }}>Estimated Total</span>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3e2f1c" }}>${totalPrice}</div>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || !!validationError || step === "SUBMITTING"}
            style={{ ...primaryBtnStyle, opacity: (!confirmed || !!validationError) ? 0.5 : 1, cursor: (!confirmed || !!validationError) ? "not-allowed" : "pointer" }}
          >
            {step === "SUBMITTING" ? "Submitting…" : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

const unitWrapStyle = { position: "relative", display: "flex", alignItems: "center" };
const unitLabelStyle = { position: "absolute", right: "12px", fontSize: "0.85rem", color: "#7a5c3e", fontWeight: 600, pointerEvents: "none" };
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(62, 47, 28, 0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalStyle = { background: "#fffdf7", padding: "40px", borderRadius: "8px", width: "450px", boxShadow: "0 6px 0 rgba(122, 92, 62, 0.1)", border: "2px solid #c4a882" };
const labelStyle = { display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "0.85rem", color: "#3e2f1c", textTransform: "uppercase", letterSpacing: "0.03em" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "4px", border: "2px solid #d4c4a8", fontSize: "1rem", boxSizing: "border-box", color: "#3e2f1c", backgroundColor: "#fffdf7" };
const primaryBtnStyle = { backgroundColor: "#4a7c59", color: "white", padding: "14px 28px", borderRadius: "5px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.04em" };

export default Checkout;
