import { validationResult } from 'express-validator';
import { APIError, ValidationError } from '../utils/errors.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Validation middleware - checks express-validator results
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw new ValidationError(MESSAGES.VALIDATION_ERROR, formattedErrors);
  }
  next();
};

/**
 * Global error handler middleware
 * Must be registered LAST in middleware stack
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Default to 500 server error
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || MESSAGES.SERVER_ERROR;
  let errors = err.errors || null;

  // Handle specific error types
  if (err.name === 'ValidationError' && err.errors) {
    // Mongoose validation error
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = MESSAGES.VALIDATION_ERROR;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    // JWT expired
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    message = MESSAGES.SERVER_ERROR;
    errors = null;
  }

  // Send error response
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new APIError(
    `Cannot ${req.method} ${req.url}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
