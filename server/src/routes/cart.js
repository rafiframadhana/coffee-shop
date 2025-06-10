import { Router } from "express";
import Cart from "./../models/cart.js";
import { isAuthenticated } from "../utils/middlewares.js";

const router = Router();

// GET all user's cart item/items
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    const totalPrice = cart.items.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      return acc + price * quantity;
    }, 0);

    res.json({ items: cart.items, totalPrice });
  } catch (err) {
    res.status(500).json({ error: "Failed to load cart" });
  }
});

// Update cart (*quantity)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity = 1, action = 'add' } = req.body;

    let updateOperation;
    
    if (action === 'add') {
      // Use $inc to atomically increment quantity
      updateOperation = {
        $inc: { "items.$[elem].quantity": quantity },
        $setOnInsert: { user: req.user._id }
      };
      
      const result = await Cart.findOneAndUpdate(
        { 
          user: req.user._id, 
          "items.productId": productId 
        },
        updateOperation,
        { 
          arrayFilters: [{ "elem.productId": productId }],
          new: true 
        }
      );

      // If item doesn't exist, add it
      if (!result) {
        await Cart.findOneAndUpdate(
          { user: req.user._id },
          { 
            $push: { items: { productId, quantity } },
            $setOnInsert: { user: req.user._id }
          },
          { upsert: true }
        );
      }
    }

    // Only populate when needed (e.g., when fetching full cart)
    const updatedCart = await Cart.findOne({ user: req.user._id });
    res.json(updatedCart);
    
  } catch (err) {
    res.status(500).json({ error: "Failed to save cart" });
  }
});

// Delete all user's cart item/items
router.delete("/", isAuthenticated, async (req, res) => {
  try {
    await Cart.deleteOne({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// Delete cart item by id
router.delete("/item/:productId", isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

//Update cart Item by id
router.patch("/item/:productId", isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
});

export default router;
