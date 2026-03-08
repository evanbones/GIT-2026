import { Pencil } from 'lucide-react';
import './Inventory.css';

export default function StockRow({ stock, onEdit }) {
    const lowestPrice = stock.item.prices.length > 0
        ? Math.min(...stock.item.prices.map(p => p.price_per_unit))
        : null;

    return (
        <div className="inventory-row">
            <span className="row-name">{stock.item.name}</span>
            <span className="row-sku">{stock.item.sku || ''}</span>

            <div className="row-qty">
                <span className={stock.quantity < 10 ? 'low-stock' : ''}>{stock.quantity}</span>
                <span className="row-unit">{stock.item.unit_type}</span>
            </div>

            <span className="row-price">
                {lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : ''}
            </span>

            <span className="row-date-display">
                {stock.expiration_date || ''}
            </span>

            <button className="row-edit-btn" onClick={() => onEdit(stock)} title="Edit">
                <Pencil size={17} />
            </button>
        </div>
    );
}
