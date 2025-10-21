import { body, param } from 'express-validator';
import { VALIDATION, USER_ROLES } from '../config/constants.js';

/**
 * Validation for user ID parameter
 */
export const validateUserId = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
];

/**
 * Validation for updating user
 * Note: Excludes sensitive fields like password and role
 */
export const validateUpdateUser = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('displayName')
    .optional()
    .trim()
    .isLength({ max: VALIDATION.DISPLAY_NAME_MAX_LENGTH })
    .withMessage(`Display name must not exceed ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Display name can only contain letters, numbers, and spaces'),

  body('username')
    .optional()
    .trim()
    .isLength({
      min: VALIDATION.USERNAME_MIN_LENGTH,
      max: VALIDATION.USERNAME_MAX_LENGTH
    })
    .withMessage(`Username must be between ${VALIDATION.USERNAME_MIN_LENGTH} and ${VALIDATION.USERNAME_MAX_LENGTH} characters`)
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),

  body('avatarUrl')
    .optional()
    .trim()
    .isURL().withMessage('Avatar URL must be a valid URL'),

  // Prevent modification of sensitive fields
  body('password')
    .not().exists().withMessage('Cannot update password through this endpoint'),

  body('role')
    .not().exists().withMessage('Cannot update role through this endpoint'),
];
