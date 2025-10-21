import User from '../models/user.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Get all users
 */
export const getAllUsers = async () => {
  try {
    const users = await User.find().select('-password').lean();
    return users;
  } catch (error) {
    logger.error('Error in getAllUsers service:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in getUserById service:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Update user by ID
 */
export const updateUser = async (id, updateData) => {
  try {
    // Only allow updating specific fields
    const allowedFields = ['displayName', 'username', 'avatarUrl'];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    logger.info(`User updated: ${id}`);
    return updatedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in updateUser service:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Delete user by ID
 */
export const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id).select('-password');

    if (!deletedUser) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    logger.info(`User deleted: ${id}`);
    return deletedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in deleteUser service:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};
