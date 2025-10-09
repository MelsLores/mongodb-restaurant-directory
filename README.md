# MongoDB Restaurant Directory API

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/MelsLores/mongodb-restaurant-directory)
[![Status](https://img.shields.io/badge/status-active-green.svg)](https://github.com/MelsLores/mongodb-restaurant-directory)
[![Database](https://img.shields.io/badge/database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/atlas)
[![API](https://img.shields.io/badge/API-REST-blue.svg)](http://localhost:3000/api/restaurants)
[![Tests](https://img.shields.io/badge/tests-passing-green.svg)](./tests/postman/)

Enterprise-grade RESTful API for restaurant management with MongoDB Atlas cloud database.

> 📋 **Sprint 2 Status**: API Development ✅ | Testing 🟡 | Documentation 75% Complete

## 🚀 Visual Setup Guide

| Step | Screenshot | Description |
|------|------------|-------------|
| 1 | [Connection Setup](./screenshots/connection-setup.png) | MongoDB Atlas connection configuration |
| 2 | [Database Creation](./screenshots/database-collection-creation.png) | Creating tattler-db database and restaurants collection |
| 3 | [CSV Import](./screenshots/csv-import-command.png) | Importing restaurant data from CSV |
| 4 | [Data Verification](./screenshots/data-view-compass.png) | Viewing imported data in MongoDB Compass |
| 5 | [Index Creation](./screenshots/create-indexes-command.png) | Creating performance indexes |

## Quick Setup

### Prerequisites
- Node.js (version 16+)
- MongoDB Atlas account

### Installation
```bash
# 1. Clone and enter directory
git clone https://github.com/MelsLores/mongodb-restaurant-directory.git
cd mongodb-restaurant-directory

# 2. Install dependencies
npm install

# 3. Start server
npm start
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Basic Operations
- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get specific restaurant
- `POST /restaurants` - Create restaurant
- `PUT /restaurants/:id` - Update restaurant
- `DELETE /restaurants/:id` - Delete restaurant

### Search
- `GET /restaurants/search?q=tacos` - Text search
- `GET /restaurants/nearby?longitude=-99.13&latitude=19.43&radius=5000` - Find nearby

### Analytics
- `GET /restaurants/stats` - Restaurant statistics
- `GET /health` - Server health check

## Example Usage

```bash
# Get all restaurants
curl http://localhost:3000/api/restaurants

# Search for Mexican food
curl "http://localhost:3000/api/restaurants?cuisine_type=Mexicana"

# Find nearby restaurants
curl "http://localhost:3000/api/restaurants/nearby?longitude=-99.13&latitude=19.43"

# Check server health
curl http://localhost:3000/health
```

## Data Examples

### POST Request Example
```json
{
  "name": "La Bella Italia",
  "description": "Auténtica comida italiana en el corazón de la ciudad",
  "cuisine_type": "Italiana",
  "phone": "+52-555-123-4567",
  "email": "info@labellaitalia.com",
  "street": "Av. Reforma 123",
  "city": "Ciudad de México",
  "state": "CDMX",
  "country": "México",
  "zipcode": "06600",
  "latitude": 19.4326,
  "longitude": -99.1332,
  "rating": 4.5,
  "price_level": 3,
  "avg_cost_per_person": 350
}
```

### API Response Example
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "_id": "67061a2b123456789abcdef0",
    "name": "La Bella Italia",
    "description": "Auténtica comida italiana en el corazón de la ciudad",
    "cuisine_type": "Italiana",
    "rating": 4.5,
    "createdAt": "2025-10-08T23:45:31.234Z",
    "updatedAt": "2025-10-08T23:45:31.234Z"
  }
}
```

## Database

- **Database**: tattler-db
- **Collection**: restaurants
- **Connection**: MongoDB Atlas
- **Records**: 5 sample restaurants

### Schema Documentation

#### Restaurant Collection Schema

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | String | ✅ | 1-100 chars | Restaurant name |
| `description` | String | ✅ | 1-500 chars | Restaurant description |
| `cuisine_type` | String | ✅ | Enum values | Type of cuisine (see below) |
| `phone` | String | ❌ | Phone format | Contact phone number |
| `email` | String | ❌ | Email format | Contact email |
| `website` | String | ❌ | URL format | Website URL |
| `facebook` | String | ❌ | - | Facebook page |
| `instagram` | String | ❌ | - | Instagram handle |
| `street` | String | ❌ | - | Street address |
| `neighborhood` | String | ❌ | - | Neighborhood |
| `city` | String | ❌ | - | City |
| `state` | String | ❌ | - | State/Province |
| `country` | String | ❌ | - | Country |
| `zipcode` | String | ❌ | - | Postal code |
| `full_address` | String | ❌ | - | Complete address |
| `longitude` | Number | ❌ | -180 to 180 | GPS longitude |
| `latitude` | Number | ❌ | -90 to 90 | GPS latitude |
| `price_level` | Number | ❌ | 1-4 | Price category |
| `avg_cost_per_person` | Number | ❌ | ≥ 0 | Average cost |
| `min_cost` | Number | ❌ | ≥ 0 | Minimum cost |
| `max_cost` | Number | ❌ | ≥ 0 | Maximum cost |
| `rating` | Number | ❌ | 1-5 | Customer rating |
| `total_reviews` | Number | ❌ | ≥ 0 | Number of reviews |
| `accessibility_wheelchair` | Boolean | ❌ | - | Wheelchair accessible |
| `accessibility_parking` | Boolean | ❌ | - | Parking available |
| `delivery_available` | Boolean | ❌ | - | Delivery service |
| `pickup_available` | Boolean | ❌ | - | Pickup service |
| `reservation_required` | Boolean | ❌ | - | Reservations needed |
| `outdoor_seating` | Boolean | ❌ | - | Outdoor seating |

#### Cuisine Types (Enum Values)
- Mexicana, Italiana, Americana, China, Japonesa, Francesa
- India, Café, Vegetariana, Vegana, Mariscos, Parrilla
- Comida Rápida, Gourmet

### Database Indexes
The collection uses 18 optimized indexes for enhanced query performance:
- Text indexes for search functionality
- Geospatial indexes for location queries  
- Compound indexes for filtering combinations
- Single field indexes for common queries

### How to Restore Database

#### Option 1: Import from CSV (Recommended)
```bash
# 1. Install MongoDB Compass or MongoDB CLI tools
# 2. Connect to your MongoDB Atlas cluster
# 3. Create database: tattler-db
# 4. Create collection: restaurants
# 5. Import the CSV file:

mongoimport --uri="YOUR_MONGODB_ATLAS_URI" \
  --db=tattler-db \
  --collection=restaurants \
  --type=csv \
  --headerline \
  --file=restaurants.csv
```

#### Option 2: Import from JSON
```bash
# Import from JSON backup
mongoimport --uri="YOUR_MONGODB_ATLAS_URI" \
  --db=tattler-db \
  --collection=restaurants \
  --file=backup-restaurants.json \
  --jsonArray
```

#### Option 3: Use Scripts (Advanced)
```bash
# Run the direct import script
node scripts/direct-import.js

# Create indexes after import
node scripts/create-indexes.js
```

#### Visual Guide
See screenshots in `/screenshots/` folder:
- `connection-setup.png` - MongoDB Atlas connection
- `database-collection-creation.png` - Creating database and collection
- `csv-import-command.png` - CSV import process
- `data-view-compass.png` - Viewing imported data
- `create-indexes-command.png` - Creating indexes

#### Verification
After import, verify the data:
```bash
# Check server health
curl http://localhost:3000/health

# Verify restaurants count
curl http://localhost:3000/api/restaurants/stats
```

## Testing

```bash
# Run API tests
node test-api.js

# Or use Postman collection
tests/postman/Restaurant-API-Collection.json
```

## Project Structure

```
├── server.js              # Main server
├── test-api.js            # API tests
├── package.json           # Dependencies
├── api/
│   ├── controllers/       # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   └── middleware/       # Error handling
├── tests/postman/        # Postman tests
├── scripts/              # Database scripts
└── docs/                 # Documentation
```

## Features

✅ CRUD operations  
✅ Text search  
✅ Geospatial search  
✅ Pagination  
✅ Error handling  
✅ Security middleware  
✅ API testing  

---

**Version**: 2.0.0  
**Author**: MelsLores  
**License**: MIT
