import { useState } from 'react';
import './Orders.css';

/**
 * Enhanced Orders Component
 * Displays group order progress and allows leaving open orders.
 */
function Orders() {
    // Mock data for user's joined orders
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
            <h1 style={{ fontFamily: "var(--brand-serif)", fontSize: "2rem", marginBottom: "20px" }}>My Orders</h1>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {orders.map((order) => {
                    const isCompleted = order.currentTotalQty >= order.targetQty || order.status === "completed";
                    const progress = Math.min((order.currentTotalQty / order.targetQty) * 100, 100);

                    return (
                        <div className="order-card" key={order.id} style={{ 
                            padding: "20px", 
                            border: "1px solid #eee", 
                            borderRadius: "12px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                <div>
                                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>{order.name}</h3>
                                    <span style={{ fontSize: "0.85rem", color: "#888" }}>{order.distributor}</span>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ 
                                        padding: "4px 12px", 
                                        borderRadius: "20px", 
                                        fontSize: "0.75rem", 
                                        fontWeight: 600,
                                        backgroundColor: isCompleted ? "#e6f4ea" : "#fff7e6",
                                        color: isCompleted ? "#1e7e34" : "#b05d22",
                                        textTransform: "uppercase"
                                    }}>
                                        {isCompleted ? "Placed" : "Collecting"}
                                    </span>
                                    <div style={{ marginTop: "8px", fontWeight: 700 }}>${order.cost}</div>
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div style={{ marginBottom: "15px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666", marginBottom: "6px" }}>
                                    <span>Progress: {order.currentTotalQty} / {order.targetQty} units</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                                    <div style={{ 
                                        width: `${progress}%`, 
                                        height: "100%", 
                                        background: isCompleted ? "#1e7e34" : "#1a1a1a",
                                        transition: "width 0.4s ease" 
                                    }} />
                                </div>
                            </div>

                            {!isCompleted && (
                                <button 
                                    onClick={() => handleLeave(order.id)}
                                    style={{ 
                                        background: "none", 
                                        border: "1px solid #eee", 
                                        padding: "6px 12px", 
                                        borderRadius: "6px", 
                                        fontSize: "0.8rem", 
                                        cursor: "pointer",
                                        color: "#888"
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
