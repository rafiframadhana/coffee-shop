import { HTTP_STATUS } from '../config/constants.js';

// Base API Error class
export class APIError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Error (400)
export class ValidationError extends APIError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.errors = errors;
  }
}

// Authentication Error (401)
export class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

// Authorization Error (403)
export class AuthorizationError extends APIError {
  constructor(message = 'Access forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

// Not Found Error (404)
export class NotFoundError extends APIError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

// Conflict Error (409)
export class ConflictError extends APIError {
  constructor(message = 'Resource conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

// Rate Limit Error (429)
export class RateLimitError extends APIError {
  constructor(message = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}

// Database Error (500)
export class DatabaseError extends APIError {
  constructor(message = 'Database operation failed') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}
