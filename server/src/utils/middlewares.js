import { AuthenticationError, AuthorizationError } from './errors.js';
import { MESSAGES } from '../config/constants.js';
import logger from './logger.js';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  logger.warn(`Unauthorized access attempt to ${req.path} from IP: ${req.ip}`);
  throw new AuthenticationError(MESSAGES.AUTH_NOT_AUTHENTICATED);
};

/**
 * Check if user is authenticated and has admin role
 */
export const isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    logger.warn(`Unauthorized admin access attempt to ${req.path} from IP: ${req.ip}`);
    throw new AuthenticationError(MESSAGES.AUTH_NOT_AUTHENTICATED);
  }

  if (req.user.role !== 'admin') {
    logger.warn(`Forbidden admin access attempt by user ${req.user.username} to ${req.path}`);
    throw new AuthorizationError(MESSAGES.ADMIN_FORBIDDEN);
  }

  return next();
};
