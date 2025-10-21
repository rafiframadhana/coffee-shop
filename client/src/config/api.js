import api from './axios';

// ========================================
// Coffee/Products API
// ========================================
export const coffeeApi = {
  getAll: () => api.get('/api/coffee'),

  getById: (id) => api.get(`/api/coffee/${id}`),

  create: (data) => api.post('/api/coffee', data),

  update: (id, data) => api.patch(`/api/coffee/${id}`, data),

  delete: (id) => api.delete(`/api/coffee/${id}`),
};

// ========================================
// Cart API
// ========================================
export const cartApi = {
  get: () => api.get('/api/cart'),

  update: (items) => api.post('/api/cart', { items }),

  updateQuantity: (productId, quantity) =>
    api.patch(`/api/cart/item/${productId}`, { quantity }),

  deleteItem: (productId) => api.delete(`/api/cart/item/${productId}`),

  clear: () => api.delete('/api/cart'),
};

// ========================================
// Auth API
// ========================================
export const authApi = {
  check: () => api.get('/api/auth/check'),

  login: (credentials) => api.post('/api/auth/login', credentials),

  register: (userData) => api.post('/api/auth/register', userData),

  logout: () => api.post('/api/auth/logout'),
};

// ========================================
// User Management API
// ========================================
export const userApi = {
  getAll: () => api.get('/api/user'),

  getById: (id) => api.get(`/api/user/${id}`),

  update: (id, data) => api.patch(`/api/user/${id}`, data),

  delete: (id) => api.delete(`/api/user/${id}`),
};
