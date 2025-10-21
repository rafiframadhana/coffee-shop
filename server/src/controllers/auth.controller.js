import passport from 'passport';
import * as authService from '../services/auth.service.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
  const { displayName, username, password } = req.body;
  const newUser = await authService.registerUser(displayName, username, password);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.AUTH_REGISTRATION_SUCCESS,
    data: newUser,
  });
};

/**
 * Login user with Passport local strategy
 */
export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error('Login error:', err);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: err.message,
      });
    }

    if (!user) {
      logger.warn(`Failed login attempt for username: ${req.body.username}`);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: info?.message || MESSAGES.AUTH_INVALID_CREDENTIALS,
      });
    }

    req.login(user, (err) => {
      if (err) {
        logger.error('Session creation error:', err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Login failed',
        });
      }

      logger.info(`User logged in: ${user.username}`);
      const userResponse = authService.formatUserResponse(user);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.AUTH_LOGIN_SUCCESS,
        data: { user: userResponse },
      });
    });
  })(req, res, next);
};

/**
 * Logout user
 */
export const logout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH_NOT_AUTHENTICATED,
    });
  }

  const username = req.user.username;

  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return next(err);
    }

    logger.info(`User logged out: ${username}`);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.AUTH_LOGOUT_SUCCESS,
      data: null,
    });
  });
};

/**
 * Check authentication status
 */
export const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    const userResponse = authService.formatUserResponse(req.user);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Success',
      data: { user: userResponse },
    });
  } else {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH_NOT_AUTHENTICATED,
    });
  }
};
