// Application Constants

export const BCRYPT = {
  SALT_ROUNDS: 10,
};

export const SESSION = {
  MAX_AGE: 1000 * 60 * 60 * 24 * 7, // 7 days
  COOKIE_SAME_SITE: 'none',
  COOKIE_SECURE: true,
  COOKIE_HTTP_ONLY: true,
};

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH_MAX_REQUESTS: 5,
};

export const CACHE = {
  TTL: 300, // 5 minutes in seconds
  CHECK_PERIOD: 60, // Check for expired keys every 60 seconds
};

export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
};

export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  DISPLAY_NAME_MAX_LENGTH: 50,
  COFFEE_ITEM_MAX_LENGTH: 100,
  COFFEE_DESCRIPTION_MAX_LENGTH: 500,
  COFFEE_MIN_PRICE: 0,
  COFFEE_MAX_PRICE: 1000000,
  CART_MIN_QUANTITY: 1,
  CART_MAX_QUANTITY: 100,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  // Auth
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_LOGOUT_SUCCESS: 'Logout successful',
  AUTH_NOT_AUTHENTICATED: 'Not authenticated',
  AUTH_INVALID_CREDENTIALS: 'Invalid username or password',
  AUTH_USER_NOT_FOUND: 'User not found',
  AUTH_REGISTRATION_SUCCESS: 'Registration successful',
  AUTH_USERNAME_EXISTS: 'Username already exists',

  // Admin
  ADMIN_FORBIDDEN: 'Forbidden: Admin access required',

  // Coffee
  COFFEE_NOT_FOUND: 'Coffee product not found',
  COFFEE_NO_PRODUCTS: 'No coffee products found',
  COFFEE_CREATED: 'Coffee product created successfully',
  COFFEE_UPDATED: 'Coffee product updated successfully',
  COFFEE_DELETED: 'Coffee product deleted successfully',

  // Cart
  CART_NOT_FOUND: 'Cart not found',
  CART_ITEM_NOT_FOUND: 'Item not found in cart',
  CART_CLEARED: 'Cart cleared successfully',
  CART_ITEM_REMOVED: 'Item removed from cart',
  CART_QUANTITY_UPDATED: 'Quantity updated successfully',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',

  // Validation
  VALIDATION_ERROR: 'Validation error',

  // General
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error occurred',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const MONGOOSE = {
  POOL_SIZE: 10,
  SERVER_SELECTION_TIMEOUT: 5000,
  SOCKET_TIMEOUT: 45000,
  FAMILY: 4,
};
