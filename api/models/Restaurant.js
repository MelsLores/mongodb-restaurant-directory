/**
 * Restaurant Model
 * Version: 1.1.0
 * Description: Mongoose schema for restaurant data
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: [{
    type: String,
    required: true
  }],
  cuisine_type: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: ['Mexicana', 'Italiana', 'Americana', 'China', 'Japonesa', 'Francesa', 'India', 'Café', 'Vegetariana', 'Vegana', 'Mariscos', 'Parrilla', 'Comida Rápida', 'Gourmet']
  },
  phone: {
    type: String,
    required: false,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    required: false,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  website: {
    type: String,
    match: [/^https?:\/\//, 'Website must be a valid URL']
  },
  facebook: String,
  instagram: String,
  street: {
    type: String,
    required: false
  },
  neighborhood: String,
  city: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  zipcode: {
    type: String,
    required: false
  },
  full_address: String,
  longitude: {
    type: Number,
    required: false,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  latitude: {
    type: Number,
    required: false,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  price_level: {
    type: Number,
    required: false,
    min: [1, 'Price level must be between 1 and 4'],
    max: [4, 'Price level must be between 1 and 4']
  },
  avg_cost_per_person: {
    type: Number,
    required: false,
    min: [0, 'Cost cannot be negative']
  },
  min_cost: {
    type: Number,
    required: false,
    min: [0, 'Minimum cost cannot be negative']
  },
  max_cost: {
    type: Number,
    required: false,
    min: [0, 'Maximum cost cannot be negative']
  },
  rating: {
    type: Number,
    required: false,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  total_reviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  accessibility_wheelchair: {
    type: Boolean,
    default: false
  },
  accessibility_parking: {
    type: Boolean,
    default: false
  },
  delivery_available: {
    type: Boolean,
    default: false
  },
  takeout_available: {
    type: Boolean,
    default: false
  },
  reservations_accepted: {
    type: Boolean,
    default: false
  },
  outdoor_seating: {
    type: Boolean,
    default: false
  },
  wifi_available: {
    type: Boolean,
    default: false
  },
  payment_cash: {
    type: Boolean,
    default: true
  },
  payment_card: {
    type: Boolean,
    default: true
  },
  payment_digital: {
    type: Boolean,
    default: false
  },
  monday_open: String,
  monday_close: String,
  tuesday_open: String,
  tuesday_close: String,
  wednesday_open: String,
  wednesday_close: String,
  thursday_open: String,
  thursday_close: String,
  friday_open: String,
  friday_close: String,
  saturday_open: String,
  saturday_close: String,
  sunday_open: String,
  sunday_close: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ longitude: 1, latitude: 1 });
restaurantSchema.index({ cuisine_type: 1 });
restaurantSchema.index({ city: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ price_level: 1 });

// Middleware to update updated_at on save
restaurantSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Virtual for location (GeoJSON format)
restaurantSchema.virtual('location').get(function() {
  return {
    type: 'Point',
    coordinates: [this.longitude, this.latitude]
  };
});

// Ensure virtual fields are serialized
restaurantSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);