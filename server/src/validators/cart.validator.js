import { body, param } from 'express-validator';
import { VALIDATION } from '../config/constants.js';

/**
 * Validation for updating cart (POST /cart)
 */
export const validateUpdateCart = [
  body('items')
    .isArray({ min: 0 }).withMessage('Items must be an array'),

  body('items.*.productId')
    .isMongoId().withMessage('Invalid product ID in cart items'),

  body('items.*.quantity')
    .isInt({ min: VALIDATION.CART_MIN_QUANTITY, max: VALIDATION.CART_MAX_QUANTITY })
    .withMessage(`Quantity must be between ${VALIDATION.CART_MIN_QUANTITY} and ${VALIDATION.CART_MAX_QUANTITY}`)
    .toInt(),
];

/**
 * Validation for updating cart item quantity (PATCH /cart/item/:productId)
 */
export const validateUpdateQuantity = [
  param('productId')
    .isMongoId().withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: VALIDATION.CART_MIN_QUANTITY, max: VALIDATION.CART_MAX_QUANTITY })
    .withMessage(`Quantity must be between ${VALIDATION.CART_MIN_QUANTITY} and ${VALIDATION.CART_MAX_QUANTITY}`)
    .toInt(),
];

/**
 * Validation for deleting cart item (DELETE /cart/item/:productId)
 */
export const validateDeleteCartItem = [
  param('productId')
    .isMongoId().withMessage('Invalid product ID'),
];
