import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateUserId, validateUpdateUser } from "../validators/user.validator.js";
import { validateRequest, asyncHandler } from "../middlewares/errorHandler.js";
import { isAdmin } from "../middlewares/auth.js";

const router = Router();

// All user management routes require admin access
router.use(isAdmin);

// Get all users
router.get("/", asyncHandler(userController.getAllUsers));

// Get user by ID
router.get("/:id", validateUserId, validateRequest, asyncHandler(userController.getUserById));

// Update user by ID
router.patch("/:id", validateUpdateUser, validateRequest, asyncHandler(userController.updateUser));

// Delete user by ID
router.delete("/:id", validateUserId, validateRequest, asyncHandler(userController.deleteUser));

export default router;
