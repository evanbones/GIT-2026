import { useEffect, useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { inventoryAPI, b2bAPI } from '../../utils/api';
import Inventory from '../Inventory/Inventory';
import NewItem from '../Inventory/NewItem';
import StockRow from '../Inventory/StockRow';
import '../Inventory/Inventory.css';
import './ProducerDashboard.css';

export default function ProducerDashboard() {
    const { user } = useAuth();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalView, setModalView] = useState('inventory');
    const [editingStock, setEditingStock] = useState(null);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        if (!user?.inventory_id) return;
        inventoryAPI.getStocks(user.inventory_id)
            .then(data => setStocks(data.stocks || []))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!user?.id) return;
        b2bAPI.getOffers(user.id)
            .then(data => setOffers(data.offers || []))
            .catch(() => {});
    }, [user]);

    const handleOfferAction = (offerId, status) => {
        b2bAPI.updateOffer(offerId, status)
            .then(() => setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o)))
            .catch(() => {});
    };

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
                <button className="btn-primary" onClick={() => setModal(true)}>
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
                    </div>

                    {stocks.length === 0 ? (
                        <div className="empty-state">
                            <p>No stock yet.</p>
                            <button className="btn-primary" onClick={() => setModal(true)}>
                                Add your first item
                            </button>
                        </div>
                    ) : (
                        <div className="stock-list">
                            {stocks.map(s => (
                                <StockRow
                                    key={s.stock_id}
                                    stock={s}
                                    onEdit={setEditingStock}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {offers.length > 0 && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Incoming Offers</h2>
                    </div>
                    <div className="stock-list">
                        <div className="offer-row offer-row-header">
                            <span>Retailer</span>
                            <span>Item</span>
                            <span>Qty</span>
                            <span>Offered Price</span>
                            <span>Status</span>
                            <span></span>
                        </div>
                        {offers.map(o => (
                            <div key={o.id} className="offer-row">
                                <span>{o.retailer_name || `Retailer #${o.retailer_id}`}</span>
                                <span>{o.item_name || `Item #${o.item_id}`}</span>
                                <span>{o.requested_quantity} {o.item_unit}</span>
                                <span>${parseFloat(o.offered_price).toFixed(2)}</span>
                                <span className={`offer-status offer-status--${o.status}`}>{o.status}</span>
                                <span className="offer-actions">
                                    {o.status === 'pending' && (
                                        <>
                                            <button className="btn-accept" onClick={() => handleOfferAction(o.id, 'accepted')}>Accept</button>
                                            <button className="btn-reject" onClick={() => handleOfferAction(o.id, 'rejected')}>Reject</button>
                                        </>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {editingStock && (
                <div className="modal-overlay" onClick={() => setEditingStock(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setEditingStock(null)}>
                            <X size={18} />
                        </button>
                        <h2>{editingStock.item.name}</h2>
                        <NewItem
                            stockId={editingStock.stock_id}
                            initialValues={{
                                item: editingStock.item,
                                prices: editingStock.item.prices,
                                quantity: editingStock.quantity,
                                batch_number: editingStock.batch_number,
                                expiration_date: editingStock.expiration_date,
                            }}
                            onAdd={(id, updates) => {
                                setStocks(prev => prev.map(s => s.stock_id === id ? { ...s, ...updates } : s));
                                setEditingStock(null);
                            }}
                            onDelete={(id) => {
                                setStocks(prev => prev.filter(s => s.stock_id !== id));
                                setEditingStock(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {modal && (
                <div className="modal-overlay" onClick={() => { setModal(false); setModalView('inventory'); }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => { setModal(false); setModalView('inventory'); }}>
                            <X size={18} />
                        </button>
                        {modalView === 'inventory' && (
                            <Inventory
                                stocks={stocks}
                                onAddItem={() => setModalView('new-item')}
                                onStockChange={(id, updates) =>
                                    setStocks(prev => prev.map(s => s.stock_id === id ? { ...s, ...updates } : s))
                                }
                            />
                        )}
                        {modalView === 'new-item' && (
                            <>
                                <button className="modal-back-btn" onClick={() => setModalView('inventory')}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <h2>New Item</h2>
                                <NewItem
                                    inventoryId={user.inventory_id}
                                    producerId={user.id}
                                    onAdd={(stock) => {
                                        setStocks(prev => [...prev, stock]);
                                        setModalView('inventory');
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
