import logger from "../../utils/logger.js";

// Simple analytics middleware to track user activity
const analytics = (req, res, next) => {
  const startTime = Date.now();

  const logAnalytics = () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    logger.info("User activity tracked", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      userId: req.user ? req.user.id : null,
      role: req.user ? req.user.role : null,
    });
  };

  res.on("finish", logAnalytics);

  next();
};

export default analytics;
