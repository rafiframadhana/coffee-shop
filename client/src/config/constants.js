// ========================================
// Time Constants
// ========================================
export const AUTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const MESSAGE_DISPLAY_DURATION = 3000; // 3 seconds

// ========================================
// Business Logic Constants
// ========================================
export const MAX_ORDER_QUANTITY = 100;
export const LOCALE = 'id-ID';
export const CURRENCY = 'IDR';

// ========================================
// API Constants
// ========================================
export const API_TIMEOUT = 10000; // 10 seconds

// ========================================
// React Query Keys
// ========================================
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CART: 'cart',
  AUTH: 'auth',
  USERS: 'users',
};

// ========================================
// React Query Stale Times
// ========================================
export const STALE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
};

// ========================================
// React Query Cache Times
// ========================================
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 10 * 60 * 1000, // 10 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
};
