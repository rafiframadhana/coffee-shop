import NodeCache from 'node-cache';
import { CACHE } from '../config/constants.js';
import logger from './logger.js';

// Initialize cache with default TTL
const cache = new NodeCache({
  stdTTL: CACHE.TTL,
  checkperiod: CACHE.CHECK_PERIOD,
  useClones: false, // Better performance, don't clone objects
});

// Cache event listeners for debugging
cache.on('set', (key) => {
  logger.debug(`Cache SET: ${key}`);
});

cache.on('del', (key) => {
  logger.debug(`Cache DEL: ${key}`);
});

cache.on('expired', (key) => {
  logger.debug(`Cache EXPIRED: ${key}`);
});

// Wrapper functions for type safety and logging
export const cacheGet = (key) => {
  try {
    const value = cache.get(key);
    if (value) {
      logger.debug(`Cache HIT: ${key}`);
    } else {
      logger.debug(`Cache MISS: ${key}`);
    }
    return value;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}:`, error);
    return undefined;
  }
};

export const cacheSet = (key, value, ttl = CACHE.TTL) => {
  try {
    const success = cache.set(key, value, ttl);
    if (!success) {
      logger.warn(`Cache SET failed for key: ${key}`);
    }
    return success;
  } catch (error) {
    logger.error(`Cache SET error for key ${key}:`, error);
    return false;
  }
};

export const cacheDel = (key) => {
  try {
    const count = cache.del(key);
    logger.debug(`Cache deleted ${count} key(s): ${key}`);
    return count;
  } catch (error) {
    logger.error(`Cache DEL error for key ${key}:`, error);
    return 0;
  }
};

export const cacheFlush = () => {
  try {
    cache.flushAll();
    logger.info('Cache flushed');
  } catch (error) {
    logger.error('Cache FLUSH error:', error);
  }
};

// Pattern-based cache deletion (e.g., delete all keys starting with "coffee:")
export const cacheDelPattern = (pattern) => {
  try {
    const keys = cache.keys();
    const matchingKeys = keys.filter((key) => key.startsWith(pattern));
    cache.del(matchingKeys);
    logger.debug(`Cache deleted ${matchingKeys.length} keys matching pattern: ${pattern}`);
    return matchingKeys.length;
  } catch (error) {
    logger.error(`Cache DEL pattern error for ${pattern}:`, error);
    return 0;
  }
};

export default cache;
