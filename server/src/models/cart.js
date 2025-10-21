import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coffee",
    required: true,
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1,
    min: 1 
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, {
  timestamps: true, // Add createdAt and updatedAt
});

// Note: user index is automatically created by unique: true

export const Cart = mongoose.model("Cart", cartSchema);

export default Cart;