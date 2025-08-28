import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// In-memory cache as fallback
const memoryCache = new Map();
const cacheTimeouts = new Map();

// Create Redis client only if REDIS_HOST is configured
let redisClient = null;
let isRedisConnected = false;

if (process.env.REDIS_HOST) {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  // Handle Redis connection events
  redisClient.on('connect', () => {
    console.log('Redis client connected');
    isRedisConnected = true;
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    isRedisConnected = false;
  });

  // Connect to Redis
  redisClient.connect().catch(err => {
    console.error('Failed to connect to Redis:', err);
    isRedisConnected = false;
  });
}

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any>} - Cached data or null if not found
 */
export async function getFromCache(key) {
  try {
    // Use Redis if connected
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    }
    
    // Fallback to in-memory cache
    if (memoryCache.has(key)) {
      const { value, expiry } = memoryCache.get(key);
      if (!expiry || Date.now() < expiry) {
        return value;
      } else {
        // Expired, remove from cache
        memoryCache.delete(key);
        cacheTimeouts.get(key) && clearTimeout(cacheTimeouts.get(key));
        cacheTimeouts.delete(key);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting data from cache:', error);
    return null;
  }
}

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 300 seconds / 5 minutes)
 * @returns {Promise<boolean>} - Success status
 */
export async function setInCache(key, data, ttl = 300) {
  try {
    // Use Redis if connected
    if (isRedisConnected && redisClient) {
      const serializedData = JSON.stringify(data);
      await redisClient.setEx(key, ttl, serializedData);
      return true;
    }
    
    // Fallback to in-memory cache
    const expiry = ttl > 0 ? Date.now() + (ttl * 1000) : null;
    memoryCache.set(key, { value: data, expiry });
    
    // Set timeout to automatically remove expired entries
    if (ttl > 0) {
      const timeout = setTimeout(() => {
        memoryCache.delete(key);
        cacheTimeouts.delete(key);
      }, ttl * 1000);
      cacheTimeouts.set(key, timeout);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting data in cache:', error);
    return false;
  }
}

/**
 * Delete data from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteFromCache(key) {
  try {
    // Use Redis if connected
    if (isRedisConnected && redisClient) {
      await redisClient.del(key);
      return true;
    }
    
    // Fallback to in-memory cache
    const result = memoryCache.delete(key);
    if (result) {
      const timeout = cacheTimeouts.get(key);
      if (timeout) {
        clearTimeout(timeout);
        cacheTimeouts.delete(key);
      }
    }
    return result;
  } catch (error) {
    console.error('Error deleting data from cache:', error);
    return false;
  }
}

/**
 * Clear all cache
 * @returns {Promise<boolean>} - Success status
 */
export async function clearCache() {
  try {
    // Use Redis if connected
    if (isRedisConnected && redisClient) {
      await redisClient.flushAll();
      return true;
    }
    
    // Fallback to in-memory cache
    memoryCache.clear();
    // Clear all timeouts
    for (const timeout of cacheTimeouts.values()) {
      clearTimeout(timeout);
    }
    cacheTimeouts.clear();
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}

export default redisClient;