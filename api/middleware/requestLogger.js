/**
 * Request Logger Middleware
 * Logs all API requests for monitoring and debugging
 */

const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// Configure request logger
const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/requests.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const requestLoggerMiddleware = (req, res, next) => {
  // Generate unique request ID
  req.id = uuidv4();
  
  // Start timer
  const startTime = Date.now();

  // Log request details
  requestLogger.info({
    requestId: req.id,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    requestLogger.info({
      requestId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    });

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLoggerMiddleware;
