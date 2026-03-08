import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { b2bAPI } from '../../utils/api';
import './RetailerDashboard.css';

export default function RetailerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [groupBuys, setGroupBuys] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        Promise.all([
            b2bAPI.getMyOffers(user.id),
            b2bAPI.getGroupBuys(user.id),
        ]).then(([offersData, gbData]) => {
            setOffers(offersData.offers || []);
            setGroupBuys(gbData.group_buys || []);
        }).finally(() => setLoading(false));
    }, [user]);

    const pendingOffers  = offers.filter(o => o.status === 'pending').length;
    const acceptedOffers = offers.filter(o => o.status === 'accepted').length;
    const openGroupBuys  = groupBuys.filter(g => g.status === 'open').length;

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

            <div className="stat-split-card">
                <div className="stat-split-half">
                    <div className="stat-item">
                        <span className="stat-number">{offers.length}</span>
                        <span className="stat-label">Direct Offers</span>
                    </div>
                    <div className="stat-item warn">
                        <span className="stat-number">{pendingOffers}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{acceptedOffers}</span>
                        <span className="stat-label">Accepted</span>
                    </div>
                </div>
                <div className="b2b-divider" />
                <div className="stat-split-half">
                    <div className="stat-item">
                        <span className="stat-number">{groupBuys.length}</span>
                        <span className="stat-label">Group Buys</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{openGroupBuys}</span>
                        <span className="stat-label">Open</span>
                    </div>
                </div>
            </div>

            {loading && <p className="dashboard-loading">Loading…</p>}

            {!loading && (
                <div className="dashboard-section">
                    <div className="b2b-split">
                        <div className="b2b-half">
                            <div className="section-header">
                                <h2>Direct Offers</h2>
                            </div>
                            {offers.length === 0 ? (
                                <div className="empty-state">
                                    <p>No offers yet.</p>
                                    <button className="btn-primary" onClick={() => navigate('/map')}>
                                        Find producers
                                    </button>
                                </div>
                            ) : (
                                <div className="b2b-list">
                                    <div className="b2b-row b2b-row-header">
                                        <span>Item</span>
                                        <span>Qty</span>
                                        <span>Price</span>
                                        <span>Status</span>
                                    </div>
                                    {offers.map(o => (
                                        <div key={o.id} className="b2b-row">
                                            <span>{o.item_name || `Item #${o.item_id}`}</span>
                                            <span>{o.requested_quantity} {o.item_unit}</span>
                                            <span>${parseFloat(o.offered_price).toFixed(2)}</span>
                                            <span className={`offer-status offer-status--${o.status}`}>{o.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="b2b-divider" />

                        <div className="b2b-half">
                            <div className="section-header">
                                <h2>Group Buys</h2>
                            </div>
                            {groupBuys.length === 0 ? (
                                <div className="empty-state">
                                    <p>No group buys yet.</p>
                                </div>
                            ) : (
                                <div className="b2b-list">
                                    <div className="b2b-row b2b-row-header">
                                        <span>Item</span>
                                        <span>Progress</span>
                                        <span>Deadline</span>
                                        <span>Status</span>
                                    </div>
                                    {groupBuys.map(g => {
                                        const pct = g.target_quantity > 0
                                            ? Math.min(100, (g.current_quantity / g.target_quantity) * 100)
                                            : 0;
                                        const deadline = g.deadline
                                            ? new Date(g.deadline).toLocaleDateString()
                                            : '—';
                                        return (
                                            <div key={g.id} className="b2b-row">
                                                <span>{g.item_name || `Item #${g.item_id}`}</span>
                                                <span className="gb-progress">
                                                    <div className="gb-bar">
                                                        <div className="gb-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="gb-qty">{g.current_quantity}/{g.target_quantity} {g.item_unit}</span>
                                                </span>
                                                <span>{deadline}</span>
                                                <span className={`offer-status offer-status--${g.status}`}>{g.status}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
