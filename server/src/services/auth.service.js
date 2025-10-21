import User from '../models/user.js';
import { hashPassword } from '../utils/helpers.js';
import { ConflictError, DatabaseError } from '../utils/errors.js';
import { MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 */
export const registerUser = async (displayName, username, password) => {
  try {
    // Hash password asynchronously
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      displayName,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    logger.info(`User registered: ${savedUser.username}`);

    // Return user without password
    const userResponse = {
      _id: savedUser._id,
      displayName: savedUser.displayName,
      username: savedUser.username,
      role: savedUser.role,
      avatarUrl: savedUser.avatarUrl,
    };

    return userResponse;
  } catch (error) {
    // Handle duplicate username
    if (error.code === 11000 && error.keyPattern?.username) {
      throw new ConflictError(MESSAGES.AUTH_USERNAME_EXISTS);
    }
    logger.error('Error in registerUser:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Format user data for response (remove sensitive fields)
 */
export const formatUserResponse = (user) => {
  return {
    displayName: user.displayName,
    username: user.username,
    role: user.role,
    avatarUrl:
      user.avatarUrl ||
      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user._id}&size=150`,
  };
};
