import StockRow from './StockRow';
import './Inventory.css';

export default function Inventory({ stocks = [], onAddItem, onStockChange }) {
    return (
        <div className="inventory-wrapper">
            <h2>Inventory</h2>
            <div className="inventory-header">
                <p>Add Item:</p>
                <button onClick={onAddItem}>+</button>
            </div>
            <div className="inventory-list">
                {stocks.length === 0 && (
                    <p className="inventory-empty">No items yet. Add your first item above.</p>
                )}
                {stocks.map(s => (
                    <StockRow key={s.stock_id} stock={s} onChange={onStockChange} />
                ))}
            </div>
        </div>
    );
}
