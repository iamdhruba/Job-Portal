import { RateLimiterMemory } from "rate-limiter-flexible";
import logger from "../../utils/logger.js";

// Rate limiter for general API requests
const generalRateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 60 seconds
});

// Rate limiter for authentication requests (stricter)
const authRateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
});

// Rate limiter for job applications (stricter)
const applicationRateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

const rateLimiter = (req, res, next) => {
  const key = req.ip;
  
  generalRateLimiter.consume(key)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn("Rate limit exceeded", { ip: req.ip, url: req.url });
      res.status(429).json({
        status: false,
        message: "Too many requests, please try again later.",
      });
    });
};

const authRateLimiterMiddleware = (req, res, next) => {
  const key = req.ip;
  
  authRateLimiter.consume(key)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn("Auth rate limit exceeded", { ip: req.ip, url: req.url });
      res.status(429).json({
        status: false,
        message: "Too many authentication attempts, please try again later.",
      });
    });
};

const applicationRateLimiterMiddleware = (req, res, next) => {
  const key = req.ip;
  
  applicationRateLimiter.consume(key)
    .then(() => {
      next();
    })
    .catch(() => {
      logger.warn("Application rate limit exceeded", { ip: req.ip, url: req.url });
      res.status(429).json({
        status: false,
        message: "Too many application attempts, please try again later.",
      });
    });
};

export { rateLimiter, authRateLimiterMiddleware, applicationRateLimiterMiddleware };