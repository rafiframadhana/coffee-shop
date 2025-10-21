import { body } from 'express-validator';
import { VALIDATION, PASSWORD } from '../config/constants.js';

/**
 * Password strength validator
 */
const passwordValidator = () => {
  return body('password')
    .isLength({ min: PASSWORD.MIN_LENGTH, max: PASSWORD.MAX_LENGTH })
    .withMessage(`Password must be between ${PASSWORD.MIN_LENGTH} and ${PASSWORD.MAX_LENGTH} characters`)
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number');
};

/**
 * Validation for user registration
 */
export const validateRegister = [
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required')
    .isLength({ max: VALIDATION.DISPLAY_NAME_MAX_LENGTH })
    .withMessage(`Display name must not exceed ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Display name can only contain letters, numbers, and spaces'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({
      min: VALIDATION.USERNAME_MIN_LENGTH,
      max: VALIDATION.USERNAME_MAX_LENGTH
    })
    .withMessage(`Username must be between ${VALIDATION.USERNAME_MIN_LENGTH} and ${VALIDATION.USERNAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),

  passwordValidator(),
];

/**
 * Validation for user login
 */
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .toLowerCase(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];
