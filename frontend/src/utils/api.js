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

export const authAPI = {
    checkAuth: () => apiCall('/auth/user'),

    login: () => {
        window.location.href = `${API_BASE}/auth/login`;
    },

    logout: () => apiCall('/auth/logout', { method: 'POST' }),
};
