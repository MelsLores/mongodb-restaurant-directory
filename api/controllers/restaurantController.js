/**
 * Restaurant Controller
 * Version: 1.1.0
 * Description: Business logic for restaurant operations
 */

const Restaurant = require('../models/Restaurant');
const { validationResult } = require('express-validator');

class RestaurantController {
  
  /**
   * Get all restaurants with optional filtering and pagination
   * GET /api/restaurants
   */
  static async getAllRestaurants(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        cuisine_type,
        city,
        min_rating,
        max_price,
        search,
        sort_by = 'name',
        sort_order = 'asc'
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (cuisine_type) filter.cuisine_type = cuisine_type;
      if (city) filter.city = new RegExp(city, 'i');
      if (min_rating) filter.rating = { $gte: parseFloat(min_rating) };
      if (max_price) filter.avg_cost_per_person = { $lte: parseInt(max_price) };
      
      // Text search
      if (search) {
        filter.$text = { $search: search };
      }

      // Sort configuration
      const sortConfig = {};
      sortConfig[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;
      const limitNum = parseInt(limit);

      // Execute query
      const restaurants = await Restaurant.find(filter)
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum)
        .select('-__v');

      const total = await Restaurant.countDocuments(filter);
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: restaurants,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_restaurants: total,
          per_page: limitNum,
          has_next: page < totalPages,
          has_previous: page > 1
        },
        filters_applied: filter
      });

    } catch (error) {
      console.error('Error getting restaurants:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve restaurants',
        message: error.message
      });
    }
  }

  /**
   * Get single restaurant by ID
   * GET /api/restaurants/:id
   */
  static async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      
      const restaurant = await Restaurant.findById(id).select('-__v');
      
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found',
          message: `No restaurant found with ID: ${id}`
        });
      }

      res.json({
        success: true,
        data: restaurant
      });

    } catch (error) {
      console.error('Error getting restaurant by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve restaurant',
        message: error.message
      });
    }
  }

  /**
   * Create new restaurant
   * POST /api/restaurants
   */
  static async createRestaurant(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const restaurant = new Restaurant(req.body);
      const savedRestaurant = await restaurant.save();

      res.status(201).json({
        success: true,
        message: 'Restaurant created successfully',
        data: savedRestaurant
      });

    } catch (error) {
      console.error('Error creating restaurant:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create restaurant',
        message: error.message
      });
    }
  }

  /**
   * Update restaurant by ID
   * PUT /api/restaurants/:id
   */
  static async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        req.body,
        { 
          new: true, 
          runValidators: true 
        }
      ).select('-__v');

      if (!updatedRestaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found',
          message: `No restaurant found with ID: ${id}`
        });
      }

      res.json({
        success: true,
        message: 'Restaurant updated successfully',
        data: updatedRestaurant
      });

    } catch (error) {
      console.error('Error updating restaurant:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update restaurant',
        message: error.message
      });
    }
  }

  /**
   * Delete restaurant by ID
   * DELETE /api/restaurants/:id
   */
  static async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;
      
      const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

      if (!deletedRestaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found',
          message: `No restaurant found with ID: ${id}`
        });
      }

      res.json({
        success: true,
        message: 'Restaurant deleted successfully',
        data: {
          id: deletedRestaurant._id,
          name: deletedRestaurant.name
        }
      });

    } catch (error) {
      console.error('Error deleting restaurant:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete restaurant',
        message: error.message
      });
    }
  }

  /**
   * Search restaurants by location (geospatial)
   * GET /api/restaurants/nearby
   */
  static async getNearbyRestaurants(req, res) {
    try {
      const { longitude, latitude, radius = 5000, limit = 10 } = req.query;

      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          error: 'Missing coordinates',
          message: 'Longitude and latitude are required'
        });
      }

      const restaurants = await Restaurant.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: parseInt(radius),
            spherical: true
          }
        },
        {
          $limit: parseInt(limit)
        },
        {
          $project: {
            __v: 0
          }
        }
      ]);

      res.json({
        success: true,
        data: restaurants,
        search_criteria: {
          center: [parseFloat(longitude), parseFloat(latitude)],
          radius_meters: parseInt(radius),
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Error getting nearby restaurants:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to find nearby restaurants',
        message: error.message
      });
    }
  }

  /**
   * Get restaurant statistics
   * GET /api/restaurants/stats
   */
  static async getRestaurantStats(req, res) {
    try {
      const stats = await Restaurant.aggregate([
        {
          $group: {
            _id: null,
            total_restaurants: { $sum: 1 },
            avg_rating: { $avg: '$rating' },
            avg_price: { $avg: '$avg_cost_per_person' },
            min_price: { $min: '$avg_cost_per_person' },
            max_price: { $max: '$avg_cost_per_person' }
          }
        }
      ]);

      const cuisineStats = await Restaurant.aggregate([
        {
          $group: {
            _id: '$cuisine_type',
            count: { $sum: 1 },
            avg_rating: { $avg: '$rating' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const cityStats = await Restaurant.aggregate([
        {
          $group: {
            _id: '$city',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      res.json({
        success: true,
        data: {
          general: stats[0] || {},
          by_cuisine: cuisineStats,
          by_city: cityStats
        }
      });

    } catch (error) {
      console.error('Error getting restaurant stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics',
        message: error.message
      });
    }
  }
}

module.exports = RestaurantController;