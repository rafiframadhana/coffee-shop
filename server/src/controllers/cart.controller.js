import * as cartService from '../services/cart.service.js';
import { sendSuccess } from '../utils/response.js';
import { MESSAGES } from '../config/constants.js';

/**
 * Get user's cart
 */
export const getCart = async (req, res) => {
  const result = await cartService.getUserCart(req.user._id);
  sendSuccess(res, result);
};

/**
 * Update cart items
 */
export const updateCart = async (req, res) => {
  const { items } = req.body;
  const updatedCart = await cartService.updateCart(req.user._id, items);
  sendSuccess(res, updatedCart);
};

/**
 * Clear entire cart
 */
export const clearCart = async (req, res) => {
  const result = await cartService.clearCart(req.user._id);
  sendSuccess(res, result, MESSAGES.CART_CLEARED);
};

/**
 * Delete single cart item
 */
export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  const result = await cartService.removeCartItem(req.user._id, productId);
  sendSuccess(res, result, MESSAGES.CART_ITEM_REMOVED);
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const result = await cartService.updateCartItemQuantity(req.user._id, productId, quantity);
  sendSuccess(res, result, MESSAGES.CART_QUANTITY_UPDATED);
};
