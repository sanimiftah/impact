/**
 * Global Error Handler Middleware
 * Handles all errors and provides consistent error responses
 */

const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

const errorHandler = (error, req, res, next) => {
  // Log error details
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let response = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    response = {
      error: 'Validation Error',
      message: 'Invalid input data',
      details: error.details || error.message,
      timestamp: new Date().toISOString()
    };
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    response = {
      error: 'Invalid ID',
      message: 'The provided ID is not valid',
      timestamp: new Date().toISOString()
    };
  }

  if (error.code === 11000) { // MongoDB duplicate key error
    statusCode = 409;
    response = {
      error: 'Duplicate Entry',
      message: 'A record with this data already exists',
      timestamp: new Date().toISOString()
    };
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    response = {
      error: 'Invalid Token',
      message: 'The provided authentication token is invalid',
      timestamp: new Date().toISOString()
    };
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    response = {
      error: 'Token Expired',
      message: 'Your session has expired. Please login again.',
      timestamp: new Date().toISOString()
    };
  }

  // Handle custom API errors
  if (error.statusCode) {
    statusCode = error.statusCode;
    response.error = error.name || 'API Error';
    response.message = error.message;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.details = error;
  }

  // Add request ID for tracking
  if (req.id) {
    response.requestId = req.id;
  }

  res.status(statusCode).json(response);
};

// Custom error classes
class APIError extends Error {
  constructor(message, statusCode = 500, name = 'APIError') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, 'ValidationError');
    this.details = details;
  }
}

class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NotFoundError');
  }
}

class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UnauthorizedError');
  }
}

class ForbiddenError extends APIError {
  constructor(message = 'Forbidden access') {
    super(message, 403, 'ForbiddenError');
  }
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  APIError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  asyncHandler
};
