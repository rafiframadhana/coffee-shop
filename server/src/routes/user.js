import { Router } from "express";
import User from "../models/user.js";
import { isAdmin } from "../utils/middlewares.js";

const router = Router();

// For admin page only

// Get all users
router.get("/", isAdmin, async (req, res) => {  
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(404).send(err);
  }
});

//Get user by id
router.get("/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Update user detail by id
router.patch("/:id", isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) return res.sendStatus(404);

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete user by id
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.sendStatus(404);

    res.status(200).send(deletedUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
