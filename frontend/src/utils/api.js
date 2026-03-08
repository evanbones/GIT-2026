export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function apiCall(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
}

export const api = {
    get: (endpoint, options = {}) => apiCall(endpoint, { method: 'GET', ...options }),
    post: (endpoint, data, options = {}) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
    put: (endpoint, data, options = {}) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
    delete: (endpoint, options = {}) => apiCall(endpoint, { method: 'DELETE', ...options }),
};

export const authAPI = {
    checkAuth: () => apiCall('/auth/user'),
    login: () => { window.location.href = `${API_BASE}/auth/login`; },
    logout: () => apiCall('/auth/logout', { method: 'POST' }),
    onboard: (data) => apiCall('/auth/onboard', { method: 'POST', body: JSON.stringify(data) }),
};

export const inventoryAPI = {
    getInventory: (id) => apiCall(`/inventory/${id}`),
    getStocks: (inventoryId) => apiCall(`/inventory/${inventoryId}/stocks`),
    getItems: (inventoryId) => apiCall(`/inventory/${inventoryId}/items`),
    createStock: (data) => apiCall('/inventory/stocks', { method: 'POST', body: JSON.stringify(data) }),
    updateStock: (stockId, data) => apiCall(`/inventory/stocks/${stockId}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStock: (stockId) => apiCall(`/inventory/stocks/${stockId}`, { method: 'DELETE' }),
};

export const ordersAPI = {
    getAll: (retailerId) => apiCall(`/orders${retailerId ? `?retailer_id=${retailerId}` : ''}`),
    getOne: (id) => apiCall(`/orders/${id}`),
    create: (data) => apiCall('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status) => apiCall(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

export const b2bAPI = {
    createOffer: (data) => apiCall('/b2b/offers', { method: 'POST', body: JSON.stringify(data) }),
    createGroupBuy: (data) => apiCall('/b2b/group-buys', { method: 'POST', body: JSON.stringify(data) }),
    getOffers: (producerId) => apiCall(`/b2b/offers${producerId ? `?producer_id=${producerId}` : ''}`),
    getMyOffers: (retailerId) => apiCall(`/b2b/offers${retailerId ? `?retailer_id=${retailerId}` : ''}`),
    updateOffer: (id, status) => apiCall(`/b2b/offers/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getGroupBuys: (retailerId) => apiCall(`/b2b/group-buys${retailerId ? `?retailer_id=${retailerId}` : ''}`),
    getGroupBuysForProducer: (producerId) => apiCall(`/b2b/group-buys?producer_id=${producerId}`),
    updateGroupBuy: (id, status) => apiCall(`/b2b/group-buys/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getOpenGroupBuysForItem: (itemId) => apiCall(`/b2b/group-buys?item_id=${itemId}&status=open`),
    joinGroupBuy: (gbId, data) => apiCall(`/b2b/group-buys/${gbId}/join`, { method: 'POST', body: JSON.stringify(data) }),
};

export const usersAPI = {
    getAll: (userType = null) => apiCall(`/users${userType ? `?user_type=${userType}` : ''}`),
    getOne: (id) => apiCall(`/users/${id}`),
};
