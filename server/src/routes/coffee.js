import express from "express";
import * as coffeeController from "../controllers/coffee.controller.js";
import { validateCreateCoffee, validateUpdateCoffee, validateCoffeeId } from "../validators/coffee.validator.js";
import { validateRequest, asyncHandler } from "../middlewares/errorHandler.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", asyncHandler(coffeeController.getAllCoffee));
router.get("/:id", validateCoffeeId, validateRequest, asyncHandler(coffeeController.getCoffeeById));

// Admin-only routes
router.post("/", isAdmin, validateCreateCoffee, validateRequest, asyncHandler(coffeeController.createCoffee));
router.patch("/:id", isAdmin, validateUpdateCoffee, validateRequest, asyncHandler(coffeeController.updateCoffee));
router.delete("/:id", isAdmin, validateCoffeeId, validateRequest, asyncHandler(coffeeController.deleteCoffee));

export default router;
