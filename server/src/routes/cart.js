import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { validateUpdateCart, validateUpdateQuantity, validateDeleteCartItem } from "../validators/cart.validator.js";
import { validateRequest, asyncHandler } from "../middlewares/errorHandler.js";
import { isAuthenticated } from "../utils/middlewares.js";

const router = Router();

// All cart routes require authentication
router.use(isAuthenticated);

// GET user's cart
router.get("/", asyncHandler(cartController.getCart));

// Update cart (POST)
router.post("/", validateUpdateCart, validateRequest, asyncHandler(cartController.updateCart));

// Delete all cart items
router.delete("/", asyncHandler(cartController.clearCart));

// Delete specific cart item
router.delete("/item/:productId", validateDeleteCartItem, validateRequest, asyncHandler(cartController.deleteCartItem));

// Update cart item quantity
router.patch("/item/:productId", validateUpdateQuantity, validateRequest, asyncHandler(cartController.updateCartItemQuantity));

export default router;
