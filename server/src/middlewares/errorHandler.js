import logger from "../../utils/logger.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error("An error occurred", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Determine the status code
  const statusCode = err.statusCode || 500;
  
  // Determine the error message
  const message = err.message || "Internal Server Error";
  
  // Send the error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  logger.warn(`404 Not Found: ${req.originalUrl}`, {
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next(error);
};

export { errorHandler, notFound };
