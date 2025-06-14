import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../src/utils/db.js";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./../src/strategies/local-strategy.js";

import routes from "../src/routes/index.js";

const app = express();
connectDB();

app.use(cookieParser());

app.use(cors({
  origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"]
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: "coffee_shop",
      collectionName: "sessions",
      ttl: 60 * 60 * 24 * 7
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

// For local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
