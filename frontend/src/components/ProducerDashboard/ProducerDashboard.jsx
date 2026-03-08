import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { inventoryAPI } from '../../utils/api';
import './ProducerDashboard.css';

export default function ProducerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.inventory_id) return;
        inventoryAPI.getStocks(user.inventory_id)
            .then(data => setStocks(data.stocks || []))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [user]);

    const totalItems = stocks.length;
    const lowStock = stocks.filter(s => s.quantity < 10);
    const expiringItems = stocks.filter(s => {
        if (!s.expiration_date) return false;
        const daysUntil = (new Date(s.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
        return daysUntil <= 30;
    });

    return (
        <div className="producer-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.company_name}</h1>
                    <p className="dashboard-subtitle">{user?.primary_address}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/inventory')}>
                    + Add Stock
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-number">{totalItems}</span>
                    <span className="stat-label">Stock Lines</span>
                </div>
                <div className="stat-card warn">
                    <span className="stat-number">{lowStock.length}</span>
                    <span className="stat-label">Low Stock (&lt;10)</span>
                </div>
                <div className="stat-card warn">
                    <span className="stat-number">{expiringItems.length}</span>
                    <span className="stat-label">Expiring (30d)</span>
                </div>
            </div>

            {loading && <p className="dashboard-loading">Loading inventory...</p>}
            {error && <p className="dashboard-error">{error}</p>}

            {!loading && !error && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Current Stock</h2>
                        <button className="btn-link" onClick={() => navigate('/inventory')}>
                            Manage all →
                        </button>
                    </div>

                    {stocks.length === 0 ? (
                        <div className="empty-state">
                            <p>No stock yet.</p>
                            <button className="btn-primary" onClick={() => navigate('/inventory')}>
                                Add your first item
                            </button>
                        </div>
                    ) : (
                        <div className="stock-list">
                            {stocks.map(s => (
                                <div key={s.stock_id} className="stock-card">
                                    <div className="stock-card-main">
                                        <span className="stock-name">{s.item.name}</span>
                                        <span className="stock-sku">{s.item.sku}</span>
                                    </div>
                                    <div className="stock-card-meta">
                                        <span className={`stock-qty ${s.quantity < 10 ? 'low' : ''}`}>
                                            {s.quantity} {s.item.unit_type}
                                        </span>
                                        {s.expiration_date && (
                                            <span className="stock-expiry">Exp: {s.expiration_date}</span>
                                        )}
                                        <span className="stock-price">
                                            {s.item.prices.length > 0
                                                ? `from $${Math.min(...s.item.prices.map(p => p.price_per_unit))} / ${s.item.unit_type}`
                                                : 'No pricing set'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
