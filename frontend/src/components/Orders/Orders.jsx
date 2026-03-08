import { useState } from 'react';
import './Orders.css';

function Orders() {
    // mock data for user's joined orders
    const [orders, setOrders] = useState([
        {
            id: 1,
            name: "IPA Case",
            distributor: "West Side Brewery",
            status: "pending",
            cost: 180,
            userQty: 5,
            currentTotalQty: 42,
            targetQty: 50
        },
        {
            id: 2,
            name: "Pinot Noir Case",
            distributor: "Valley Vineyards",
            status: "completed",
            cost: 192,
            userQty: 2,
            currentTotalQty: 12,
            targetQty: 10
        }
    ]);

    const handleLeave = (id) => {
        if (window.confirm("Are you sure you want to leave this group order?")) {
            setOrders(orders.filter(o => o.id !== id));
        }
    };

    return (
        <div className="orders-container" style={{ textAlign: "left" }}>
            <h1 style={{ fontFamily: "var(--brand-serif)", fontSize: "2rem", marginBottom: "20px", color: "#3e2f1c", borderBottom: "2px solid #d4c4a8", paddingBottom: "10px" }}>My Orders</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {orders.map((order) => {
                    const isCompleted = order.currentTotalQty >= order.targetQty || order.status === "completed";
                    const progress = Math.min((order.currentTotalQty / order.targetQty) * 100, 100);

                    return (
                        <div className="order-card" key={order.id} style={{
                            padding: "20px",
                            border: "2px solid #d4c4a8",
                            borderLeft: "4px solid " + (isCompleted ? "#4a7c59" : "#c1694f"),
                            borderRadius: "6px",
                            backgroundColor: "#fffdf7",
                            boxShadow: "0 3px 0 rgba(122, 92, 62, 0.05)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                <div>
                                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#3e2f1c", fontWeight: 700 }}>{order.name}</h3>
                                    <span style={{ fontSize: "0.85rem", color: "#78695a" }}>{order.distributor}</span>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{
                                        padding: "3px 10px",
                                        borderRadius: "3px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        backgroundColor: isCompleted ? "#e8f5e9" : "#fff3e0",
                                        color: isCompleted ? "#4a7c59" : "#c1694f",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        border: "1px solid " + (isCompleted ? "#4a7c59" : "#c1694f")
                                    }}>
                                        {isCompleted ? "Placed" : "Collecting"}
                                    </span>
                                    <div style={{ marginTop: "8px", fontWeight: 700, color: "#3e2f1c" }}>${order.cost}</div>
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div style={{ marginBottom: "15px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#78695a", marginBottom: "6px" }}>
                                    <span>Progress: {order.currentTotalQty} / {order.targetQty} units</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ height: "10px", background: "#f0ead2", borderRadius: "3px", overflow: "hidden", border: "1px solid #d4c4a8" }}>
                                    <div style={{
                                        width: `${progress}%`,
                                        height: "100%",
                                        background: isCompleted ? "#4a7c59" : "#7a5c3e",
                                        transition: "width 0.4s ease"
                                    }} />
                                </div>
                            </div>

                            {!isCompleted && (
                                <button
                                    onClick={() => handleLeave(order.id)}
                                    style={{
                                        background: "none",
                                        border: "2px solid #d4c4a8",
                                        padding: "6px 14px",
                                        borderRadius: "4px",
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        color: "#78695a",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.03em"
                                    }}
                                >
                                    Leave Group
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Orders;
