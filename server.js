/**
 * MongoDB Restaurant Directory API Server
 * Version: 2.0.0
 * Description: Enterprise Express.js RESTful API for restaurant management
 * Author: MelsLores
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import routes and middleware
const restaurantRoutes = require('./api/routes/restaurantRoutes');
const { globalErrorHandler } = require('./api/middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db';

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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