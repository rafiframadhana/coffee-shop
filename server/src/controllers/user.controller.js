import User from '../models/user.js';
import { sendSuccess, sendNotFound } from '../utils/response.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    sendSuccess(res, users);
  } catch (error) {
    logger.error('Error in getAllUsers:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    sendSuccess(res, user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in getUserById:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Update user by ID (admin only)
 */
export const updateUser = async (req, res) => {
  try {
    // Only allow updating specific fields
    const allowedFields = ['displayName', 'username', 'avatarUrl'];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: filteredData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    logger.info(`User updated: ${req.params.id}`);
    sendSuccess(res, updatedUser, MESSAGES.USER_UPDATED);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in updateUser:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Delete user by ID (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id).select('-password');

    if (!deletedUser) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    logger.info(`User deleted: ${req.params.id}`);
    sendSuccess(res, deletedUser, MESSAGES.USER_DELETED);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in deleteUser:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};
