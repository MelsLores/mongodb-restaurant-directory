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
 * @route   GET /api/restaurants/search/advanced
 * @desc    Advanced search with multiple criteria and suggestions
 * @access  Public
 * @params  q, cuisine_types, price_range, amenities, location_radius, longitude, latitude, rating_min, sort_by, limit, include_suggestions
 */
router.get('/search/advanced', RestaurantController.advancedSearch);

/**
 * @route   GET /api/restaurants/search/autocomplete
 * @desc    Autocomplete search suggestions
 * @access  Public
 * @params  q, limit
 */
router.get('/search/autocomplete', RestaurantController.autocompleteSearch);

/**
 * @route   GET /api/restaurants/recommendations
 * @desc    Get personalized restaurant recommendations
 * @access  Public
 * @params  preferred_cuisines, budget_max, must_have_amenities, location_preference, longitude, latitude, limit
 */
router.get('/recommendations', RestaurantController.getRecommendations);

/**
 * @route   GET /api/restaurants/categories/:categories
 * @desc    Get restaurants by multiple categories
 * @access  Public
 * @params  categories (comma-separated), limit, sort_by
 */
router.get('/categories/:categories', RestaurantController.getRestaurantsByCategories);

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