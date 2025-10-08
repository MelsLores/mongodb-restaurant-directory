# MongoDB Restaurant Directory

**Version 1.0.0** - Sprint 1 Release

## Project Description

Restaurant directory database system built with MongoDB Atlas. Manages restaurant information including location, contact details, ratings, and operational data for food establishments.

## Repository Structure

```
mongodb-restaurant-directory/
├── README.md                    # Project documentation
├── restaurants.csv              # CSV data for MongoDB import
├── restaurants.json             # Original JSON data
└── scripts/                     # Import and configuration scripts
    ├── direct-import.js         # CSV data import script
    └── create-indexes.js        # Database indexes creation
```

## Installation and Usage Instructions

### Prerequisites
- MongoDB Atlas account
- MongoDB Shell (mongosh)
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/MelsLores/mongodb-restaurant-directory.git
cd mongodb-restaurant-directory
```

2. **Import CSV Data to MongoDB Atlas**
```bash
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file scripts/direct-import.js
```

3. **Create Database Indexes**
```bash
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file scripts/create-indexes.js
```

### Database Configuration
- **Database**: `tattler-db`
- **Collection**: `restaurants`
- **Records**: 5 restaurant entries

## Screenshots

### 1. MongoDB Compass Connection Setup
![Connection Setup](screenshots/connection-setup.png)
*Creating connection to MongoDB Atlas in Compass*

### 2. Connection Established
![Connection Success](screenshots/connection-established.png)
*Successfully connected to MongoDB Atlas cluster*

### 3. Database and Collection Creation
![Database Creation](screenshots/database-collection-creation.png)
*Creating tattler-db database and restaurants collection*

### 4. CSV Data Import Command (Step 1)
![CSV Import Step 1](screenshots/csv-import-command.png)
*Executing first part of CSV data import script*

### 5. CSV Data Import Command (Step 2)
![CSV Import Step 2](screenshots/csv-import-command-2.png)
*Completing CSV data import to restaurants collection*

### 6. Create Indexes Command
![Create Indexes](screenshots/create-indexes-command.png)
*Running create-indexes script for optimized queries*

### 7. Final Data View in Compass
![Data in Compass](screenshots/data-view-compass.png)
*Restaurant data successfully imported and visible in MongoDB Compass*

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MelsLores/mongodb-restaurant-directory.git
   cd mongodb-restaurant-directory
   ```

2. **Connect to MongoDB Atlas**
   ```bash
   mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db"
   ```

3. **Run setup script**
   ```bash
   # For Linux/Mac
   chmod +x scripts/import-csv.sh
   ./scripts/import-csv.sh

   # For Windows
   scripts\import-csv.bat
   ```

4. **Create indexes and structure**
   ```bash
   mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file scripts/create-indexes.js
   ```

## System Usage

### Data Import Methods

#### Method 1: Using mongoimport (Recommended)
```bash
mongoimport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --type csv --headerline --file restaurants.csv
```

#### Method 2: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect using: `mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/`
3. Navigate to `tattler-db.restaurants` collection
4. Click "Import Data" and select `restaurants.csv`

#### Method 3: Using automated scripts
```bash
# Linux/Mac
./scripts/import-csv.sh restaurants.csv tattler-db restaurants

# Windows
scripts\import-csv.bat restaurants.csv tattler-db restaurants
```

### Query Examples

#### Location-based search
```javascript
// Restaurants near a specific point (5km radius)
db.restaurants.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-99.1332, 19.4284] },
      $maxDistance: 5000
    }
  }
})
```

#### Text search
```javascript
// Search for taco restaurants
db.restaurants.find({
  $text: { $search: "tacos mexican" }
})
```

#### Rating and price filters
```javascript
// High-rated restaurants with moderate pricing
db.restaurants.find({
  "rating.average": { $gte: 4.0 },
  "price_range.level": { $lte: 3 },
  "status": "active"
})
```

## Database Structure

### Collection: `restaurants` (in tattler-db database)

```javascript
{
  "_id": ObjectId,
  "name": String,                    // Restaurant name
  "description": String,             // Description
  "category": [String],              // Restaurant categories
  "cuisine_type": String,            // Cuisine type
  "contact": {                       // Contact information
    "phone": String,
    "email": String,
    "website": String,
    "social_media": {
      "facebook": String,
      "instagram": String,
      "twitter": String
    }
  },
  "address": {                       // Complete address
    "street": String,
    "neighborhood": String,
    "city": String,
    "state": String,
    "country": String,
    "zipcode": String,
    "full_address": String
  },
  "location": {                      // Geospatial coordinates
    "type": "Point",
    "coordinates": [Number, Number]  // [longitude, latitude]
  },
  "business_hours": {                // Operating hours
    "monday": { "open": String, "close": String },
    // ... other days
  },
  "rating": {                        // Rating system
    "average": Number,
    "total_reviews": Number,
    "rating_distribution": {
      "5": Number,
      "4": Number,
      "3": Number,
      "2": Number,
      "1": Number
    }
  },
  "price_range": {                   // Price information
    "level": Number,                 // 1-5 (budget to luxury)
    "currency": String,
    "average_cost": Number,
    "min_cost": Number,
    "max_cost": Number
  },
  "features": [String],              // Restaurant features
  "menu_highlights": [String],       // Featured dishes
  "payment_methods": [String],       // Accepted payment methods
  "status": String,                  // active, inactive, closed
  "verified": Boolean,               // Platform verified
  "owner_verified": Boolean,         // Owner verified
  "created_at": Date,
  "updated_at": Date,
  "tags": [String]                   // Search tags
}
```

### Implemented Indexes

1. **Full-Text Search Index**
   ```javascript
   db.restaurants.createIndex({
     "name": "text",
     "description": "text",
     "category": "text",
     "cuisine_type": "text",
     "tags": "text"
   })
   ```

2. **Geospatial Index**
   ```javascript
   db.restaurants.createIndex({ "location": "2dsphere" })
   ```

3. **Compound Indexes**
   ```javascript
   db.restaurants.createIndex({ "cuisine_type": 1, "rating.average": -1 })
   db.restaurants.createIndex({ "address.city": 1, "price_range.level": 1 })
   db.restaurants.createIndex({ "status": 1, "verified": 1 })
   ```

## Quick Start Guide

### 1. Connect to Database
```bash
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db"
```

### 2. Import Sample Data
```bash
mongoimport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --type csv --headerline --file restaurants.csv --drop
```

### 3. Create Indexes
```bash
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file scripts/create-indexes.js
```

### 4. Test Queries
```bash
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file scripts/sample-queries.js
```

## Advanced Queries

### Geospatial Queries
```javascript
// Find restaurants within 10km of Mexico City center
db.restaurants.find({
  location: {
    $geoWithin: {
      $centerSphere: [[-99.1332, 19.4284], 10/6378.1]
    }
  }
})
```

### Aggregation Examples
```javascript
// Restaurant count by cuisine type
db.restaurants.aggregate([
  {$match: {"status": "active"}},
  {$group: {_id: "$cuisine_type", count: {$sum: 1}}},
  {$sort: {count: -1}}
])

// Average rating by price level
db.restaurants.aggregate([
  {$match: {"status": "active", "rating.average": {$exists: true}}},
  {$group: {
    _id: "$price_range.level",
    avgRating: {$avg: "$rating.average"},
    count: {$sum: 1}
  }},
  {$sort: {_id: 1}}
])
```

## API Integration Examples

### Node.js Example
```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/';
const client = new MongoClient(uri);

async function findNearbyRestaurants(lng, lat, radius = 5000) {
  await client.connect();
  const db = client.db('tattler-db');
  const collection = db.collection('restaurants');
  
  const restaurants = await collection.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radius
      }
    },
    status: "active"
  }).limit(10).toArray();
  
  return restaurants;
}
```

### Python Example
```python
from pymongo import MongoClient

client = MongoClient('mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/')
db = client['tattler-db']
collection = db['restaurants']

def search_restaurants(cuisine=None, min_rating=0, max_price=5):
    query = {
        'status': 'active',
        'rating.average': {'$gte': min_rating},
        'price_range.level': {'$lte': max_price}
    }
    
    if cuisine:
        query['cuisine_type'] = cuisine
    
    return list(collection.find(query).limit(20))
```

## Data Management

### Backup Commands
```bash
# Export collection to JSON
mongoexport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --out restaurants-backup.json

# Export collection to CSV
mongoexport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --type csv --fields name,cuisine_type,rating.average,address.city --out restaurants-backup.csv
```

### Restore Commands
```bash
# Import from JSON
mongoimport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --file restaurants-backup.json

# Import from CSV
mongoimport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --type csv --headerline --file restaurants-backup.csv
```

## Version Control

This project follows XXX versioning guidelines:

- **First X (Major Version)**: Significant changes that may not be backward compatible
- **Second X (New Features)**: Addition of new functionalities to the project
- **Third X (Revisions)**: Minor bug fixes or corrections

**Current Version: 1.0.0**
- First stable version of the system
- Complete CRUD implementation for restaurants
- Geospatial and text search system
- Import and configuration scripts

## Performance Optimization

### Query Optimization
```javascript
// Use explain() to analyze query performance
db.restaurants.explain("executionStats").find({"cuisine_type": "Mexican"})

// Force index usage with hint()
db.restaurants.find({"rating.average": {$gte: 4.0}}).hint({"rating.average": -1})
```

### Index Usage Guidelines
- Use compound indexes for multi-field queries
- Leverage geospatial indexes for location-based searches
- Implement text indexes for search functionality
- Monitor index usage with explain() method

## Security Configuration

### Atlas Security Best Practices
- Use strong passwords and enable two-factor authentication
- Configure IP whitelisting for database access
- Implement proper user roles and permissions
- Regular security audits and updates

### Connection Security
```javascript
// Use SSL/TLS for all connections
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
});
```

## Production Deployment

### Environment Variables
```bash
# Set environment variables for production
export MONGODB_URI="mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db"
export NODE_ENV="production"
```

### Monitoring and Logging
- Enable MongoDB Atlas monitoring
- Set up alerts for performance metrics
- Implement application-level logging
- Regular backup scheduling

## Troubleshooting

### Common Issues and Solutions

#### Connection Problems
```bash
# Test connection
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --eval "db.runCommand({hello:1})"
```

#### Import Errors
```bash
# Verify file format and permissions
head -5 restaurants.csv

# Use absolute path for import
mongoimport --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --type csv --headerline --file "$(pwd)/restaurants.csv"
```

#### Performance Issues
- Check index usage with explain()
- Monitor query execution time
- Optimize complex aggregation pipelines
- Consider data partitioning for large datasets

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact Information

- **Developer**: MelsLores
- **Repository**: [https://github.com/MelsLores/mongodb-restaurant-directory](https://github.com/MelsLores/mongodb-restaurant-directory)
- **Issues**: [https://github.com/MelsLores/mongodb-restaurant-directory/issues](https://github.com/MelsLores/mongodb-restaurant-directory/issues)

## Support

For issues or questions:

1. Check the documentation and examples
2. Search existing issues
3. Create a new issue with detailed information
4. Include screenshots if necessary

---

*Last updated: October 2025*
