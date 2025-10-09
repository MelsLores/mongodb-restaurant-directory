/**
 * Restaurant Routes
 * Version: 1.1.0
 * Description: Express.js routes for restaurant API endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const RestaurantController = require('../controllers/restaurantController');
const router = express.Router();

// Validation middleware for restaurant creation/update
const restaurantValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Restaurant name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  
  body('cuisine_type')
    .isIn(['Mexicana', 'Italiana', 'Americana', 'China', 'Japonesa', 'Francesa', 'India', 'Café', 'Vegetariana', 'Vegana', 'Mariscos', 'Parrilla', 'Comida Rápida', 'Gourmet', 'Internacional'])
    .withMessage('Invalid cuisine type')
];

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants with filtering and pagination
 * @access  Public
 * @params  page, limit, cuisine_type, city, min_rating, max_price, search, sort_by, sort_order
 */
router.get('/', RestaurantController.getAllRestaurants);

/**
 * @route   GET /api/restaurants/stats
 * @desc    Get restaurant statistics
 * @access  Public
 */
router.get('/stats', RestaurantController.getRestaurantStats);

/**
 * @route   GET /api/restaurants/nearby
 * @desc    Get nearby restaurants based on coordinates
 * @access  Public
 * @params  longitude, latitude, radius, limit
 */
router.get('/nearby', RestaurantController.getNearbyRestaurants);

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get single restaurant by ID
 * @access  Public
 */
router.get('/:id', RestaurantController.getRestaurantById);

/**
 * @route   POST /api/restaurants
 * @desc    Create new restaurant
 * @access  Public
 */
router.post('/', restaurantValidation, RestaurantController.createRestaurant);

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Update restaurant by ID
 * @access  Public
 */
router.put('/:id', restaurantValidation, RestaurantController.updateRestaurant);

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Delete restaurant by ID
 * @access  Public
 */
router.delete('/:id', RestaurantController.deleteRestaurant);

module.exports = router;