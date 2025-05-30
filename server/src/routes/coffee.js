import express from "express";
import Coffee from "../models/coffee.js";

const router = express.Router();

// Get all coffee products
router.get("/", async (req, res) => {
  try {
    const coffee = await Coffee.find();
    if (!coffee || coffee.length === 0) {
      return res.status(404).json({ message: "No coffees found" });
    }
    res.status(200).json(coffee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single coffee product by Id
router.get("/:id", async (req, res) => {
  try {
    const product = await Coffee.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Coffee not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new coffee product
router.post("/", async (req, res) => {
  try {
    const newCoffee = new Coffee(req.body);
    const savedCoffee = await newCoffee.save();
    res.status(201).json(savedCoffee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a coffee product detail by id
router.patch("/:id", async (req, res) => {
  try {
    const updatedCoffee = await Coffee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedCoffee) return res.sendStatus(404);

    res.status(200).send(updatedCoffee);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete a coffee product by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCoffee = await Coffee.findByIdAndDelete(req.params.id);

    if (!deletedCoffee) return res.sendStatus(404);

    res.status(200).send(deletedCoffee);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
