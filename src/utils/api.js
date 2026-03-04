const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('gw_token');

const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('gw_token');
            localStorage.removeItem('gw_user');
            window.location.reload();
        }
        throw new Error(data.error || 'Request failed');
    }

    return data;
};

// Auth
export const authAPI = {
    register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => apiFetch('/auth/me'),
};

// Expenses
export const expenseAPI = {
    getAll: () => apiFetch('/expenses'),
    create: (body) => apiFetch('/expenses', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiFetch(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/expenses/${id}`, { method: 'DELETE' }),
};

// Wishlist
export const wishlistAPI = {
    getAll: () => apiFetch('/wishlist'),
    create: (body) => apiFetch('/wishlist', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiFetch(`/wishlist/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/wishlist/${id}`, { method: 'DELETE' }),
};

// Budget
export const budgetAPI = {
    get: () => apiFetch('/budget'),
    update: (body) => apiFetch('/budget', { method: 'PUT', body: JSON.stringify(body) }),
};

// Category Budgets
export const categoryBudgetAPI = {
    getAll: () => apiFetch('/category-budgets'),
    create: (body) => apiFetch('/category-budgets', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiFetch(`/category-budgets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiFetch(`/category-budgets/${id}`, { method: 'DELETE' }),
};
