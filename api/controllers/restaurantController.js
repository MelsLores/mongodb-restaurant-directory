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
        max_rating,
        min_price,
        max_price,
        price_level,
        neighborhood,
        delivery_available,
        takeout_available,
        wifi_available,
        outdoor_seating,
        wheelchair_accessible,
        search,
        sort_by = 'name',
        sort_order = 'asc',
        category,
        payment_methods,
        open_now,
        radius,
        longitude,
        latitude
      } = req.query;

      // Build advanced filter object
      const filter = {};
      
      // Basic filters
      if (cuisine_type) {
        // Support multiple cuisine types
        if (cuisine_type.includes(',')) {
          filter.cuisine_type = { $in: cuisine_type.split(',') };
        } else {
          filter.cuisine_type = cuisine_type;
        }
      }
      
      if (city) {
        // Smart city search with aliases for common abbreviations
        const cityAliases = {
          'cdmx': 'ciudad de méxico',
          'df': 'ciudad de méxico',
          'mexico city': 'ciudad de méxico',
          'ciudad de mexico': 'ciudad de méxico',
          'mty': 'monterrey',
          'gdl': 'guadalajara'
        };
        
        const searchCity = city.toLowerCase();
        const expandedCity = cityAliases[searchCity] || city;
        filter.city = new RegExp(expandedCity, 'i');
      }
      if (neighborhood) filter.neighborhood = new RegExp(neighborhood, 'i');
      
      // Rating range filter
      if (min_rating || max_rating) {
        filter.rating = {};
        if (min_rating) filter.rating.$gte = parseFloat(min_rating);
        if (max_rating) filter.rating.$lte = parseFloat(max_rating);
      }
      
      // Price range filter
      if (min_price || max_price) {
        filter.avg_cost_per_person = {};
        if (min_price) filter.avg_cost_per_person.$gte = parseInt(min_price);
        if (max_price) filter.avg_cost_per_person.$lte = parseInt(max_price);
      }
      
      // Price level filter (1-4 scale)
      if (price_level) {
        if (price_level.includes(',')) {
          filter.price_level = { $in: price_level.split(',').map(p => parseInt(p)) };
        } else {
          filter.price_level = parseInt(price_level);
        }
      }
      
      // Category filter (array field)
      if (category) {
        if (category.includes(',')) {
          filter.category = { $in: category.split(',') };
        } else {
          filter.category = category;
        }
      }
      
      // Boolean amenities filters
      if (delivery_available === 'true') filter.delivery_available = true;
      if (takeout_available === 'true') filter.takeout_available = true;
      if (wifi_available === 'true') filter.wifi_available = true;
      if (outdoor_seating === 'true') filter.outdoor_seating = true;
      if (wheelchair_accessible === 'true') filter.accessibility_wheelchair = true;
      
      // Payment methods filter
      if (payment_methods) {
        const methods = payment_methods.split(',');
        if (methods.includes('cash')) filter.payment_cash = true;
        if (methods.includes('card')) filter.payment_card = true;
        if (methods.includes('digital')) filter.payment_digital = true;
      }
      
      // Text search with advanced options
      if (search) {
        // Check if search looks like a phrase (contains quotes)
        if (search.startsWith('"') && search.endsWith('"')) {
          filter.$text = { $search: search, $caseSensitive: false };
        } else {
          // Split search terms for AND operation
          const searchTerms = search.split(' ').filter(term => term.length > 0);
          if (searchTerms.length > 1) {
            filter.$and = searchTerms.map(term => ({
              $or: [
                { name: new RegExp(term, 'i') },
                { description: new RegExp(term, 'i') },
                { category: new RegExp(term, 'i') },
                { cuisine_type: new RegExp(term, 'i') }
              ]
            }));
          } else {
            filter.$text = { $search: search };
          }
        }
      }

      // Sort configuration with multiple options
      const sortConfig = {};
      const validSortFields = ['name', 'rating', 'avg_cost_per_person', 'price_level', 'total_reviews', 'created_at', 'updated_at'];
      
      if (validSortFields.includes(sort_by)) {
        sortConfig[sort_by] = sort_order === 'desc' ? -1 : 1;
      } else {
        sortConfig['name'] = 1; // Default sort
      }
      
      // Add secondary sort for consistency
      if (sort_by !== 'name') {
        sortConfig['name'] = 1;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const limitNum = parseInt(limit);

      let query;
      
      // Handle geospatial queries if coordinates provided
      if (longitude && latitude) {
        const maxDistance = radius ? parseInt(radius) : 5000; // Default 5km
        
        query = Restaurant.aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              distanceField: 'distance',
              maxDistance: maxDistance,
              spherical: true,
              query: filter
            }
          },
          { $sort: sortConfig },
          { $skip: skip },
          { $limit: limitNum },
          { $project: { __v: 0 } }
        ]);
      } else {
        // Regular query without geospatial
        query = Restaurant.find(filter)
          .sort(sortConfig)
          .skip(skip)
          .limit(limitNum)
          .select('-__v');
      }

      const restaurants = await query;
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
        filters_applied: filter,
        search_metadata: {
          search_term: search || null,
          geospatial_search: !!(longitude && latitude),
          radius_meters: longitude && latitude ? (radius || 5000) : null,
          sort_by: sort_by,
          sort_order: sort_order
        }
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

  /**
   * Advanced search with multiple criteria and suggestions
   * GET /api/restaurants/search/advanced
   */
  static async advancedSearch(req, res) {
    try {
      const {
        q: searchTerm,
        cuisine_types,
        price_range,
        amenities,
        location_radius,
        longitude,
        latitude,
        rating_min = 0,
        sort_by = 'relevance',
        limit = 10,
        include_suggestions = 'true'
      } = req.query;

      const pipeline = [];
      const matchStage = { $match: {} };

      // Text search stage
      if (searchTerm) {
        pipeline.push({
          $search: {
            index: "restaurant_text_search",
            text: {
              query: searchTerm,
              path: ["name", "description", "cuisine_type", "category"]
            }
          }
        });
      }

      // Build match filters
      if (cuisine_types) {
        matchStage.$match.cuisine_type = { $in: cuisine_types.split(',') };
      }

      if (price_range) {
        const [minPrice, maxPrice] = price_range.split('-').map(Number);
        matchStage.$match.avg_cost_per_person = { $gte: minPrice, $lte: maxPrice };
      }

      if (rating_min) {
        matchStage.$match.rating = { $gte: parseFloat(rating_min) };
      }

      if (amenities) {
        const amenityList = amenities.split(',');
        amenityList.forEach(amenity => {
          switch (amenity) {
            case 'wifi':
              matchStage.$match.wifi_available = true;
              break;
            case 'delivery':
              matchStage.$match.delivery_available = true;
              break;
            case 'takeout':
              matchStage.$match.takeout_available = true;
              break;
            case 'wheelchair':
              matchStage.$match.accessibility_wheelchair = true;
              break;
            case 'outdoor':
              matchStage.$match.outdoor_seating = true;
              break;
          }
        });
      }

      // Add match stage if we have filters
      if (Object.keys(matchStage.$match).length > 0) {
        pipeline.push(matchStage);
      }

      // Geospatial search
      if (longitude && latitude) {
        const radius = location_radius ? parseInt(location_radius) : 5000;
        pipeline.unshift({
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: radius,
            spherical: true
          }
        });
      }

      // Sorting
      const sortStage = { $sort: {} };
      switch (sort_by) {
        case 'rating':
          sortStage.$sort = { rating: -1, total_reviews: -1 };
          break;
        case 'price_low':
          sortStage.$sort = { avg_cost_per_person: 1 };
          break;
        case 'price_high':
          sortStage.$sort = { avg_cost_per_person: -1 };
          break;
        case 'distance':
          if (longitude && latitude) {
            sortStage.$sort = { distance: 1 };
          } else {
            sortStage.$sort = { name: 1 };
          }
          break;
        case 'newest':
          sortStage.$sort = { created_at: -1 };
          break;
        default: // relevance or name
          sortStage.$sort = { name: 1 };
      }

      pipeline.push(sortStage);
      pipeline.push({ $limit: parseInt(limit) });
      pipeline.push({ $project: { __v: 0 } });

      const results = await Restaurant.aggregate(pipeline);

      // Generate search suggestions if requested
      let suggestions = [];
      if (include_suggestions === 'true' && searchTerm) {
        suggestions = await Restaurant.aggregate([
          {
            $search: {
              index: "restaurant_text_search",
              autocomplete: {
                query: searchTerm,
                path: "name"
              }
            }
          },
          { $limit: 5 },
          { $project: { name: 1, cuisine_type: 1 } }
        ]).catch(() => []); // Fallback if search index not available
      }

      res.json({
        success: true,
        data: results,
        suggestions: suggestions,
        search_metadata: {
          query: searchTerm,
          filters_applied: {
            cuisine_types: cuisine_types || null,
            price_range: price_range || null,
            amenities: amenities || null,
            rating_min: rating_min,
            location_search: !!(longitude && latitude)
          },
          results_count: results.length,
          sort_by: sort_by
        }
      });

    } catch (error) {
      console.error('Error in advanced search:', error);
      res.status(500).json({
        success: false,
        error: 'Advanced search failed',
        message: error.message
      });
    }
  }

  /**
   * Get restaurants by multiple categories
   * GET /api/restaurants/categories/:categories
   */
  static async getRestaurantsByCategories(req, res) {
    try {
      const { categories } = req.params;
      const { limit = 10, sort_by = 'rating' } = req.query;

      const categoryList = categories.split(',');
      
      const restaurants = await Restaurant.find({
        category: { $in: categoryList }
      })
      .sort({ [sort_by]: -1 })
      .limit(parseInt(limit))
      .select('-__v');

      // Group by category for better organization
      const groupedResults = {};
      categoryList.forEach(cat => {
        groupedResults[cat] = restaurants.filter(r => r.category.includes(cat));
      });

      res.json({
        success: true,
        data: restaurants,
        grouped_by_category: groupedResults,
        categories_searched: categoryList,
        total_results: restaurants.length
      });

    } catch (error) {
      console.error('Error getting restaurants by categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve restaurants by categories',
        message: error.message
      });
    }
  }

  /**
   * Get restaurant recommendations based on preferences
   * GET /api/restaurants/recommendations
   */
  static async getRecommendations(req, res) {
    try {
      const {
        preferred_cuisines,
        budget_max,
        must_have_amenities,
        location_preference,
        longitude,
        latitude,
        limit = 5
      } = req.query;

      const pipeline = [];
      const matchStage = { $match: {} };

      // Preference-based scoring
      const addFieldsStage = {
        $addFields: {
          recommendation_score: {
            $add: [
              // Base score
              { $multiply: ["$rating", 2] },
              
              // Cuisine preference bonus
              preferred_cuisines ? {
                $cond: {
                  if: { $in: ["$cuisine_type", preferred_cuisines.split(',')] },
                  then: 10,
                  else: 0
                }
              } : 0,
              
              // Budget fit bonus
              budget_max ? {
                $cond: {
                  if: { $lte: ["$avg_cost_per_person", parseInt(budget_max)] },
                  then: 5,
                  else: -10
                }
              } : 0,
              
              // Review count bonus (popularity)
              { $min: [{ $divide: ["$total_reviews", 10] }, 5] }
            ]
          }
        }
      };

      // Apply budget filter if specified
      if (budget_max) {
        matchStage.$match.avg_cost_per_person = { $lte: parseInt(budget_max) };
      }

      // Apply amenities filter if specified
      if (must_have_amenities) {
        const amenities = must_have_amenities.split(',');
        amenities.forEach(amenity => {
          switch (amenity) {
            case 'wifi':
              matchStage.$match.wifi_available = true;
              break;
            case 'delivery':
              matchStage.$match.delivery_available = true;
              break;
            case 'parking':
              matchStage.$match.accessibility_parking = true;
              break;
          }
        });
      }

      // Add stages to pipeline
      if (Object.keys(matchStage.$match).length > 0) {
        pipeline.push(matchStage);
      }

      // Location-based search
      if (longitude && latitude) {
        pipeline.unshift({
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: 10000, // 10km radius for recommendations
            spherical: true
          }
        });
        
        // Add distance bonus to score
        addFieldsStage.$addFields.recommendation_score.$add.push({
          $subtract: [10, { $divide: ["$distance", 1000] }] // Closer = higher score
        });
      }

      pipeline.push(addFieldsStage);
      pipeline.push({ $sort: { recommendation_score: -1 } });
      pipeline.push({ $limit: parseInt(limit) });
      pipeline.push({ $project: { __v: 0 } });

      const recommendations = await Restaurant.aggregate(pipeline);

      res.json({
        success: true,
        data: recommendations,
        recommendation_criteria: {
          preferred_cuisines: preferred_cuisines?.split(',') || null,
          budget_max: budget_max || null,
          must_have_amenities: must_have_amenities?.split(',') || null,
          location_preference: !!(longitude && latitude),
          algorithm: 'preference_based_scoring'
        },
        total_recommendations: recommendations.length
      });

    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations',
        message: error.message
      });
    }
  }

  /**
   * Search restaurants with autocomplete suggestions
   * GET /api/restaurants/search/autocomplete
   */
  static async autocompleteSearch(req, res) {
    try {
      const { q: query, limit = 10 } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Query too short',
          message: 'Search query must be at least 2 characters'
        });
      }

      // Create regex for partial matching
      const searchRegex = new RegExp(query, 'i');

      const suggestions = await Restaurant.aggregate([
        {
          $match: {
            $or: [
              { name: searchRegex },
              { cuisine_type: searchRegex },
              { category: { $elemMatch: { $regex: searchRegex } } },
              { city: searchRegex },
              { neighborhood: searchRegex }
            ]
          }
        },
        {
          $project: {
            name: 1,
            cuisine_type: 1,
            city: 1,
            neighborhood: 1,
            rating: 1,
            avg_cost_per_person: 1,
            category: 1,
            suggestion_type: {
              $cond: {
                if: { $regexMatch: { input: "$name", regex: searchRegex } },
                then: "restaurant_name",
                else: {
                  $cond: {
                    if: { $regexMatch: { input: "$cuisine_type", regex: searchRegex } },
                    then: "cuisine_type",
                    else: "location_or_category"
                  }
                }
              }
            }
          }
        },
        { $sort: { rating: -1, name: 1 } },
        { $limit: parseInt(limit) }
      ]);

      // Group suggestions by type
      const groupedSuggestions = {
        restaurants: suggestions.filter(s => s.suggestion_type === 'restaurant_name'),
        cuisines: [...new Set(suggestions.filter(s => s.suggestion_type === 'cuisine_type').map(s => s.cuisine_type))],
        locations: [...new Set(suggestions.map(s => s.city).filter(Boolean))],
        categories: [...new Set(suggestions.flatMap(s => s.category || []).filter(cat => searchRegex.test(cat)))]
      };

      res.json({
        success: true,
        query: query,
        suggestions: groupedSuggestions,
        total_suggestions: suggestions.length
      });

    } catch (error) {
      console.error('Error in autocomplete search:', error);
      res.status(500).json({
        success: false,
        error: 'Autocomplete search failed',
        message: error.message
      });
    }
  }
}

module.exports = RestaurantController;