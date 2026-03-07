import { useState } from 'react';
import './Orders.css';

function getOrders() {
    return [
        { name: "graeme", status: "pending", cost: 100, id: 1 },
        { name: "graeme 2", status: "completed", cost: 67, id: 7 }
    ] // grab from postgres
}

function Orders() {
    return (
        <div className="orders-container">
            <h1>Order Status</h1>
            {getOrders().map((order) => (
                <div className="order-card" key={order.id}>
                    <p className="order-name">{order.name}</p>
                    <p className={`order-status ${order.status}`}>{order.status}</p>
                    <p className="order-cost">${order.cost}</p>
                </div>
            ))}
        </div>
    );
}

export default Orders;