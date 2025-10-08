/**
 * MongoDB Atlas Index Creation Script
 * Version: 1.0.0
 * Description: Creates optimized indexes for restaurant collection in Atlas
 * Run with: mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --file create-indexes.js
 */

// Database configuration
const DATABASE_NAME = 'tattler-db';
const COLLECTION_NAME = 'restaurants';

// Connect to Atlas database
use(DATABASE_NAME);

print('🚀 Creating MongoDB Atlas indexes for restaurant collection...');
print('Database:', DATABASE_NAME);
print('Collection:', COLLECTION_NAME);
print('');

// Performance tracking
let startTime = new Date();
let indexCount = 0;

/**
 * Helper function to create index with error handling
 */
function createIndexSafely(indexSpec, options = {}) {
    try {
        const result = db[COLLECTION_NAME].createIndex(indexSpec, options);
        indexCount++;
        return result;
    } catch (error) {
        print(`❌ Error creating index ${JSON.stringify(indexSpec)}: ${error.message}`);
        return null;
    }
}

// 1. Text Search Index - Enables full-text search across multiple fields
print('📝 Creating text search index...');
createIndexSafely({
    "name": "text",
    "description": "text", 
    "category": "text",
    "cuisine_type": "text",
    "tags": "text",
    "menu_highlights": "text"
}, {
    name: "restaurant_text_search",
    weights: {
        "name": 10,
        "cuisine_type": 8,
        "category": 6,
        "tags": 4,
        "description": 2,
        "menu_highlights": 1
    },
    default_language: "spanish"
});

// 2. Geospatial Index - Enables location-based queries
print('🌍 Creating geospatial index...');
createIndexSafely({ "location": "2dsphere" }, {
    name: "restaurant_location_2dsphere"
});

// 3. Compound Indexes for Common Query Patterns
print('🔍 Creating compound indexes...');

// Cuisine type + Rating (for browsing by category with best rated first)
createIndexSafely({ 
    "cuisine_type": 1, 
    "rating.average": -1 
}, {
    name: "cuisine_rating_compound"
});

// City + Price Level (for location and budget filtering)
createIndexSafely({ 
    "address.city": 1, 
    "price_range.level": 1 
}, {
    name: "city_price_compound"
});

// Status + Verification (for filtering active and verified restaurants)
createIndexSafely({ 
    "status": 1, 
    "verified": 1 
}, {
    name: "status_verification_compound"
});

// Location + Cuisine (for geospatial queries with cuisine filtering)
createIndexSafely({ 
    "location": "2dsphere", 
    "cuisine_type": 1 
}, {
    name: "location_cuisine_compound"
});

// 4. Single Field Indexes for Frequent Queries
print('📊 Creating single field indexes...');

// Rating average (for sorting by rating)
createIndexSafely({ "rating.average": -1 }, {
    name: "rating_average_desc"
});

// Price level (for price range filtering)
createIndexSafely({ "price_range.level": 1 }, {
    name: "price_level_asc"
});

// Created date (for sorting by newest)
createIndexSafely({ "created_at": -1 }, {
    name: "created_date_desc"
});

// Updated date (for finding recently updated restaurants)
createIndexSafely({ "updated_at": -1 }, {
    name: "updated_date_desc"
});

// Owner verification status
createIndexSafely({ "owner_verified": 1 }, {
    name: "owner_verified_status"
});

// Categories (for category-based filtering)
createIndexSafely({ "category": 1 }, {
    name: "category_index"
});

// 5. Sparse Indexes for Optional Fields
print('🎯 Creating sparse indexes...');

// Website (sparse because not all restaurants have websites)
createIndexSafely({ "contact.website": 1 }, {
    name: "website_sparse",
    sparse: true
});

// Social media handles (sparse)
createIndexSafely({ "contact.social_media.instagram": 1 }, {
    name: "instagram_sparse",
    sparse: true
});

// Awards (sparse because only some restaurants have awards)
createIndexSafely({ "awards.name": 1 }, {
    name: "awards_sparse",
    sparse: true
});

// 6. Partial Indexes for Specific Conditions
print('⚡ Creating partial indexes...');

// Index only for active restaurants
createIndexSafely({ 
    "name": 1,
    "rating.average": -1 
}, {
    name: "active_restaurants_only",
    partialFilterExpression: { "status": "active" }
});

// Index only for highly rated restaurants (4+ stars)
createIndexSafely({ 
    "address.city": 1,
    "cuisine_type": 1 
}, {
    name: "highly_rated_restaurants",
    partialFilterExpression: { "rating.average": { $gte: 4.0 } }
});

// Calculate execution time
let endTime = new Date();
let executionTime = endTime - startTime;

// Display results
print('');
print('✅ Index creation completed!');
print('');
print('📈 Summary:');
print(`   Total indexes created: ${indexCount}`);
print(`   Execution time: ${executionTime}ms`);
print('');

// List all indexes
print('📋 Current indexes in collection:');
const indexes = db[COLLECTION_NAME].getIndexes();
indexes.forEach((index, i) => {
    print(`   ${i + 1}. ${index.name} - ${JSON.stringify(index.key)}`);
});

print('');
print('🎉 Database is now optimized for restaurant queries!');
print('');
print('💡 Recommended next steps:');
print('   1. Import sample data: mongoimport --db restaurant_directory --collection restaurants --file restaurants.csv --type csv --headerline');
print('   2. Test queries: mongosh --file sample-queries.js');
print('   3. Monitor performance: db.restaurants.explain("executionStats").find({...})');
print('');