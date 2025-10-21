import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGOOSE } from '../config/constants.js';
import logger from './logger.js';

dotenv.config();

// Track connection state for serverless optimization
let isConnected = false;

/**
 * Connect to MongoDB with connection pooling and error handling
 * Optimized for serverless environments (Vercel)
 */
export default async function connectDB() {
  // Reuse existing connection in serverless
  if (isConnected) {
    logger.info('Using existing database connection');
    return mongoose.connection;
  }

  try {
    const options = {
      dbName: 'coffee_shop',
      maxPoolSize: MONGOOSE.POOL_SIZE,
      serverSelectionTimeoutMS: MONGOOSE.SERVER_SELECTION_TIMEOUT,
      socketTimeoutMS: MONGOOSE.SOCKET_TIMEOUT,
      family: MONGOOSE.FAMILY, // Use IPv4, skip trying IPv6
      // Recommended for serverless
      bufferCommands: false, // Disable buffering
    };

    const connection = await mongoose.connect(process.env.MONGO_URI, options);

    isConnected = true;
    logger.info('Database connected successfully');

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
      isConnected = false;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    });

    return connection;
  } catch (error) {
    logger.error('Database connection error:', error);
    isConnected = false;
    throw error;
  }
}

/**
 * Get connection status
 */
export const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  };
};