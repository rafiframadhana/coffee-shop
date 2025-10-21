import mongoose from "mongoose";

const coffeeSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  src: {
    type: String,
    required: true,
  },
  contain: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt
});

// Note: item index is automatically created by unique: true
// Index for price-based sorting/filtering
coffeeSchema.index({ price: 1 });

const Coffee = mongoose.model("Coffee", coffeeSchema);

export default Coffee;
