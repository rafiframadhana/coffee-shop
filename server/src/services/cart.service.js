import Cart from '../models/cart.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Get user's cart with populated products and calculated total
 * Uses MongoDB aggregation for better performance
 */
export const getUserCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.productId').lean();

    if (!cart) {
      return { items: [], totalPrice: 0 };
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      return acc + price * quantity;
    }, 0);

    return { items: cart.items, totalPrice };
  } catch (error) {
    logger.error('Error in getUserCart:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Update entire cart (upsert operation)
 */
export const updateCart = async (userId, items) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { user: userId, items },
      { upsert: true, new: true, runValidators: true }
    ).populate('items.productId');

    logger.info(`Cart updated for user: ${userId}`);
    return updatedCart;
  } catch (error) {
    logger.error('Error in updateCart:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Clear user's cart
 */
export const clearCart = async (userId) => {
  try {
    await Cart.deleteOne({ user: userId });
    logger.info(`Cart cleared for user: ${userId}`);
    return { message: MESSAGES.CART_CLEARED };
  } catch (error) {
    logger.error('Error in clearCart:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Remove specific item from cart
 * Uses atomic operation for better performance
 */
export const removeCartItem = async (userId, productId) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    );

    if (!cart) {
      throw new NotFoundError(MESSAGES.CART_NOT_FOUND);
    }

    logger.info(`Item ${productId} removed from cart for user: ${userId}`);
    return { message: MESSAGES.CART_ITEM_REMOVED, cart };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in removeCartItem:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Update item quantity in cart
 * Uses atomic operation for better performance
 */
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      {
        user: userId,
        'items.productId': productId
      },
      {
        $set: { 'items.$.quantity': quantity }
      },
      { new: true, runValidators: true }
    );

    if (!cart) {
      throw new NotFoundError(MESSAGES.CART_NOT_FOUND);
    }

    logger.info(`Quantity updated for item ${productId} in cart for user: ${userId}`);
    return { message: MESSAGES.CART_QUANTITY_UPDATED, cart };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in updateCartItemQuantity:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};
