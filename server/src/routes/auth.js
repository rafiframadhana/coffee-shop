import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import { validateRequest, asyncHandler } from "../middlewares/errorHandler.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// User Registration
router.post("/register", validateRegister, validateRequest, asyncHandler(authController.register));

// User Login
router.post("/login", validateLogin, validateRequest, authController.login);

// User Logout
router.post("/logout", authController.logout);

// Check Authentication Status
router.get("/check", authController.checkAuth);

export default router;
