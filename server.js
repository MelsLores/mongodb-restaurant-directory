/**
 * MongoDB Restaurant Directory Server
 * Version: 3.0.0 - Enhanced with Sustainability & Scalability
 * Description: Enterprise Express.js RESTful API for restaurant management
 * Implements: Technological Sustainability and Scalability principles
 * Author: MelsLores
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Import routes and middleware
const restaurantRoutes = require('./api/routes/restaurantRoutes');
const { globalErrorHandler } = require('./api/middleware/errorHandler');
const PerformanceMonitor = require('./api/middleware/performanceMonitor');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db';

// Security middleware
app.use(helmet());
app.use(cors());

// Sustainability: Compression for efficient resource usage
app.use(compression());

// Scalability: Rate limiting (testing-friendly configuration)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 300, // Allow 300 requests per minute for testing
  message: { 
    error: 'Too many requests from this IP, please try again later.',
    sustainability_note: "Rate limiting helps optimize server resources"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Performance monitoring middleware (sustainability)
app.use(PerformanceMonitor.trackPerformance);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware with performance tracking
app.use(morgan('combined'));

// Enhanced MongoDB connection with scalability options
const mongooseOptions = {
  maxPoolSize: 10, // Scalability: Connection pooling
  serverSelectionTimeoutMS: 5000, // Sustainability: Faster failover
  socketTimeoutMS: 45000, // Sustainability: Efficient timeout
};

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database: tattler-db');
  console.log('🔗 Collection: restaurants');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// API Routes
app.use('/api/restaurants', restaurantRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Restaurant Directory API',
    version: '1.1.0',
    status: 'active',
    endpoints: {
      restaurants: '/api/restaurants',
      documentation: '/api/docs'
    },
    database: 'MongoDB Atlas - tattler-db'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/restaurants',
      'POST /api/restaurants',
      'GET /api/restaurants/:id',
      'PUT /api/restaurants/:id',
      'DELETE /api/restaurants/:id'
    ]
  });
});

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 Restaurant Directory API Server');
  console.log('================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🍽️  Restaurants API: http://localhost:${PORT}/api/restaurants`);
  console.log('================================');
});

module.exports = app;