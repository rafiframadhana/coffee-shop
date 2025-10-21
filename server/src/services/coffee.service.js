import Coffee from '../models/coffee.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { MESSAGES } from '../config/constants.js';
import { cacheGet, cacheSet, cacheDelPattern } from '../utils/cache.js';
import logger from '../utils/logger.js';

const CACHE_KEY_ALL = 'coffee:all';
const CACHE_KEY_PREFIX = 'coffee:';

/**
 * Get all coffee products (with caching)
 */
export const getAllCoffee = async () => {
  try {
    // Check cache first
    const cached = cacheGet(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    // Query database with lean() for better performance
    const coffee = await Coffee.find().lean();

    if (!coffee || coffee.length === 0) {
      throw new NotFoundError(MESSAGES.COFFEE_NO_PRODUCTS);
    }

    // Cache the results
    cacheSet(CACHE_KEY_ALL, coffee);

    return coffee;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in getAllCoffee:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Get single coffee product by ID (with caching)
 */
export const getCoffeeById = async (id) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${id}`;

    // Check cache first
    const cached = cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    // Query database
    const product = await Coffee.findById(id).lean();

    if (!product) {
      throw new NotFoundError(MESSAGES.COFFEE_NOT_FOUND);
    }

    // Cache the result
    cacheSet(cacheKey, product);

    return product;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in getCoffeeById:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Create a new coffee product
 */
export const createCoffee = async (coffeeData) => {
  try {
    const newCoffee = new Coffee(coffeeData);
    const savedCoffee = await newCoffee.save();

    // Invalidate cache
    cacheDelPattern(CACHE_KEY_PREFIX);

    logger.info(`Coffee product created: ${savedCoffee._id}`);
    return savedCoffee;
  } catch (error) {
    logger.error('Error in createCoffee:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Update coffee product by ID
 */
export const updateCoffee = async (id, updateData) => {
  try {
    // Only allow updating specific fields
    const allowedFields = ['item', 'src', 'contain', 'price', 'description'];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedCoffee = await Coffee.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!updatedCoffee) {
      throw new NotFoundError(MESSAGES.COFFEE_NOT_FOUND);
    }

    // Invalidate cache
    cacheDelPattern(CACHE_KEY_PREFIX);

    logger.info(`Coffee product updated: ${id}`);
    return updatedCoffee;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in updateCoffee:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};

/**
 * Delete coffee product by ID
 */
export const deleteCoffee = async (id) => {
  try {
    const deletedCoffee = await Coffee.findByIdAndDelete(id);

    if (!deletedCoffee) {
      throw new NotFoundError(MESSAGES.COFFEE_NOT_FOUND);
    }

    // Invalidate cache
    cacheDelPattern(CACHE_KEY_PREFIX);

    logger.info(`Coffee product deleted: ${id}`);
    return deletedCoffee;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error('Error in deleteCoffee:', error);
    throw new DatabaseError(MESSAGES.DATABASE_ERROR);
  }
};
