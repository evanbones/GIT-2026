import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { ordersAPI } from '../../utils/api';
import './RetailerDashboard.css';

const STATUS_COLORS = {
    pending: { bg: '#fff3e0', text: '#c1694f', border: '#c1694f' },
    shipped: { bg: '#e8f5e9', text: '#4a7c59', border: '#4a7c59' },
    completed: { bg: '#e8f5e9', text: '#4a7c59', border: '#4a7c59' },
    cancelled: { bg: '#fdecea', text: '#b00020', border: '#b00020' },
};

export default function RetailerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        ordersAPI.getAll()
            .then(data => setOrders(data.orders || []))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const pending = orders.filter(o => o.status === 'pending');
    const completed = orders.filter(o => o.status === 'completed');

    return (
        <div className="retailer-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.company_name}</h1>
                    <p className="dashboard-subtitle">{user?.store_address}</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/map')}>
                    Browse Producers
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-number">{orders.length}</span>
                    <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-card warn">
                    <span className="stat-number">{pending.length}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{completed.length}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            {loading && <p className="dashboard-loading">Loading orders...</p>}
            {error && <p className="dashboard-error">{error}</p>}

            {!loading && !error && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Orders</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <p>No orders yet.</p>
                            <button className="btn-primary" onClick={() => navigate('/map')}>
                                Find producers to order from
                            </button>
                        </div>
                    ) : (
                        <div className="order-list">
                            {orders.map(o => {
                                const colors = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                                return (
                                    <div key={o.id} className="order-card" style={{ borderLeftColor: colors.border }}>
                                        <div className="order-card-main">
                                            <span className="order-id">Order #{o.id}</span>
                                            <span className="order-total">${o.total_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="order-card-meta">
                                            <span
                                                className="order-status"
                                                style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                                            >
                                                {o.status}
                                            </span>
                                            <span className="order-date">{o.order_date ? new Date(o.order_date).toLocaleDateString() : ''}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
