import mongoose from "mongoose";

const coffeeSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    unique: true,
  },
  src: {
    type: String,
    required: true,
  },
  contain: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Coffee = mongoose.model("Coffee", coffeeSchema);

export default Coffee;
