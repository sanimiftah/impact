/**
 * IMPACT Platform API Server
 * API-First Architecture for Web & Mobile Apps
 * Built for scalability and future expansion
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const volunteerRoutes = require('./routes/volunteers');
const matchingRoutes = require('./routes/matching');
const teamRoutes = require('./routes/teams');
const analyticsRoutes = require('./routes/analytics');
const sdgRoutes = require('./routes/sdg');
const socialRoutes = require('./routes/social');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://impact-platform.com']
    : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Impact Platform API',
    version: '1.0.0',
    description: 'API-First Architecture for Impact Platform - Connecting volunteers with meaningful opportunities',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      volunteers: '/api/v1/volunteers',
      matching: '/api/v1/matching',
      teams: '/api/v1/teams',
      analytics: '/api/v1/analytics',
      sdg: '/api/v1/sdg',
      social: '/api/v1/social'
    },
    documentation: '/api/docs',
    health: '/health'
  });
});

// API Routes (v1)
const apiV1 = express.Router();

// Mount route modules
apiV1.use('/auth', authRoutes);
apiV1.use('/users', authMiddleware, userRoutes);
apiV1.use('/projects', projectRoutes);
apiV1.use('/volunteers', volunteerRoutes);
apiV1.use('/matching', authMiddleware, matchingRoutes);
apiV1.use('/teams', authMiddleware, teamRoutes);
apiV1.use('/analytics', analyticsRoutes);
apiV1.use('/sdg', sdgRoutes);
apiV1.use('/social', authMiddleware, socialRoutes);

// Mount API version
app.use('/api/v1', apiV1);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/api',
      '/health',
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/projects',
      '/api/v1/volunteers',
      '/api/v1/matching',
      '/api/v1/teams',
      '/api/v1/analytics',
      '/api/v1/sdg',
      '/api/v1/social'
    ]
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Impact Platform API Server Started!
┌─────────────────────────────────────────┐
│  Environment: ${process.env.NODE_ENV || 'development'}                    │
│  Port: ${PORT}                               │
│  API Version: v1                        │
│  Health Check: http://localhost:${PORT}/health │
│  API Docs: http://localhost:${PORT}/api       │
└─────────────────────────────────────────┘
  `);
});

module.exports = app;
