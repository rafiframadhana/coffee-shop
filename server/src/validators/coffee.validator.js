import { body, param } from 'express-validator';
import { VALIDATION } from '../config/constants.js';

/**
 * Validation for creating a coffee product
 */
export const validateCreateCoffee = [
  body('item')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ max: VALIDATION.COFFEE_ITEM_MAX_LENGTH })
    .withMessage(`Item name must not exceed ${VALIDATION.COFFEE_ITEM_MAX_LENGTH} characters`),

  body('src')
    .trim()
    .notEmpty().withMessage('Image URL is required')
    .isURL().withMessage('Image must be a valid URL'),

  body('contain')
    .trim()
    .notEmpty().withMessage('Container type is required')
    .isLength({ max: 50 }).withMessage('Container type must not exceed 50 characters'),

  body('price')
    .isFloat({ min: VALIDATION.COFFEE_MIN_PRICE, max: VALIDATION.COFFEE_MAX_PRICE })
    .withMessage(`Price must be between ${VALIDATION.COFFEE_MIN_PRICE} and ${VALIDATION.COFFEE_MAX_PRICE}`)
    .toFloat(),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: VALIDATION.COFFEE_DESCRIPTION_MAX_LENGTH })
    .withMessage(`Description must not exceed ${VALIDATION.COFFEE_DESCRIPTION_MAX_LENGTH} characters`),
];

/**
 * Validation for updating a coffee product
 */
export const validateUpdateCoffee = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),

  body('item')
    .optional()
    .trim()
    .isLength({ max: VALIDATION.COFFEE_ITEM_MAX_LENGTH })
    .withMessage(`Item name must not exceed ${VALIDATION.COFFEE_ITEM_MAX_LENGTH} characters`),

  body('src')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL'),

  body('contain')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Container type must not exceed 50 characters'),

  body('price')
    .optional()
    .isFloat({ min: VALIDATION.COFFEE_MIN_PRICE, max: VALIDATION.COFFEE_MAX_PRICE })
    .withMessage(`Price must be between ${VALIDATION.COFFEE_MIN_PRICE} and ${VALIDATION.COFFEE_MAX_PRICE}`)
    .toFloat(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: VALIDATION.COFFEE_DESCRIPTION_MAX_LENGTH })
    .withMessage(`Description must not exceed ${VALIDATION.COFFEE_DESCRIPTION_MAX_LENGTH} characters`),
];

/**
 * Validation for MongoDB ObjectId parameter
 */
export const validateCoffeeId = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),
];
