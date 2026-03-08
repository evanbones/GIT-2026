import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import NewItem from './NewItem';
import './Inventory.css';
export default function Inventory() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([
        { name: "item", quantity: 1, price: 3, description: "i am an item" }]);
    const [showModal, setShowModal] = useState(false);

    const handleAddInv = () => {
        setShowModal(true);
    }

    const handleNewItem = (item) => {
        setInventory([...inventory, item]); // should be a db call to validate
        setShowModal(false);
    }

    return (
        <div className="inventory-wrapper">
            <h2>Inventory</h2>
            <div className="inventory-header">
                <p>Add Item:</p>
                <button onClick={handleAddInv}>+</button>
            </div>
            <div className="inventory-list">
                {inventory.map((item, index) => (
                    <div className="inventory-card" key={index}>
                        <p className="item-name">{item.name}</p>
                        <div className="item-stats">
                            <span>Qty: {item.quantity}</span>
                            <span>${item.price}</span>
                        </div>
                        <p className="item-description">{item.description}</p>
                    </div>
                ))}
            </div>

            <button className="continue-btn" onClick={() => navigate("/dashboard")}>Continue</button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>New Item</h2>
                        <NewItem onAdd={handleNewItem} />
                    </div>
                </div>
            )}
        </div>
    )
}
