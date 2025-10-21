import * as cartService from '../services/cart.service.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  const result = await cartService.getUserCart(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: result,
  });
};

/**
 * Update cart items
 */
export const updateCart = async (req, res) => {
  const { items } = req.body;
  const updatedCart = await cartService.updateCart(req.user._id, items);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: updatedCart,
  });
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res) => {
  const result = await cartService.clearCart(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART_CLEARED,
    data: result,
  });
};

/**
 * Delete single cart item
 */
export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  const result = await cartService.removeCartItem(req.user._id, productId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART_ITEM_REMOVED,
    data: result,
  });
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const result = await cartService.updateCartItemQuantity(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART_QUANTITY_UPDATED,
    data: result,
  });
};
