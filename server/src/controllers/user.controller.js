import * as userService from '../services/user.service.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: users,
  });
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: user,
  });
};

/**
 * Update user by ID (admin only)
 */
export const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.USER_UPDATED,
    data: updatedUser,
  });
};

/**
 * Delete user by ID (admin only)
 */
export const deleteUser = async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.USER_DELETED,
    data: deletedUser,
  });
};
