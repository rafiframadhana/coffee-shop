import { Router } from "express";
import User from "../models/user.js";
import { hashPassword } from "../utils/helpers.js";
import passport from "passport";

const router = Router();

// User Registration
router.post("/register", async (req, res) => {
  const { displayName, username, password } = req.body;
  try {
    const hashedPassword = hashPassword(password);
    const newUser = new User({
      displayName,
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).send(savedUser);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.username) {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Authentication Failed" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login Failed" });
      }

      return res.status(200).json({
        message: "Login Successful",
        user: {
          displayName: user.displayName,
          username: user.username,
          role: user.role,
          avatarUrl:
            user.avatarUrl ||
            "https://api.dicebear.com/9.x/pixel-art/svg?seed=" +
              user._id +
              "&size=150",
        },
      });
    });
  })(req, res, next);
});

// User Logout
router.post("/logout", (req, res, next) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
});

//Check User
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    return res.status(200).json({
      user: {
        displayName: user.displayName,
        username: user.username,
        role: user.role,
        avatarUrl:
          user.avatarUrl ||
          `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user._id}&size=150`,
      },
    });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});

export default router;
