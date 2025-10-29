import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import connectDB from "../src/utils/db.js";
import logger from "../src/utils/logger.js";
import { SESSION } from "../src/config/constants.js";
import { generalLimiter } from "../src/middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "../src/middlewares/errorHandler.js";
import routes from "../src/routes/index.js";
import "./../src/strategies/local-strategy.js";

const app = express();

// Initialize database connection (must complete before session setup)
let isDbConnected = false;
connectDB()
  .then(() => {
    isDbConnected = true;
    logger.info('Database connected successfully');
  })
  .catch((err) => {
    logger.error('Failed to connect to database:', err);
  });

// Security middleware - helmet
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Compression middleware
app.use(compression());

// HTTP request logging with morgan
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Body parsing middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - support both production and development
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "https://coffeeculture-id.netlify.app",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"]
}));

// Session configuration - use MongoDB URI for serverless
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      maxAge: SESSION.MAX_AGE,
      sameSite: SESSION.COOKIE_SAME_SITE,
      secure: SESSION.COOKIE_SECURE,
      httpOnly: SESSION.COOKIE_HTTP_ONLY,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "coffee_shop",
      collectionName: "sessions",
      ttl: SESSION.MAX_AGE / 1000, // Convert to seconds
      touchAfter: 24 * 3600 // Lazy session update (seconds)
    })
  })
);

// Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting (applied globally)
app.use(generalLimiter);

// Handle preflight requests explicitly
app.options('*', cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use(routes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (MUST be last)
app.use(errorHandler);

// For local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
