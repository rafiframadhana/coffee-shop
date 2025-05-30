import { Router } from "express";
import coffeeRoutes from './coffee.js';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import cartRoutes from './cart.js';

const router = Router();

router.use("/api/coffee", coffeeRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);
router.use("/api/cart", cartRoutes);

export default router;
