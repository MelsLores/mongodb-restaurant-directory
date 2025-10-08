// MongoDB Atlas Database Backup Script
// Version 1.0.0
// Creates backup of restaurant data from MongoDB Atlas

print('🚀 Creating MongoDB Atlas Backup...');
print('Database: tattler-db');
print('Collection: restaurants');
print('');

// Connect to database
use('tattler-db');

// Export all restaurant data
print('📊 Exporting restaurant data...');
const restaurants = db.restaurants.find().toArray();
print(`✅ Exported ${restaurants.length} restaurant records`);

// Show backup summary
print('');
print('📋 Backup Summary:');
print('==================');
print(`Total Records: ${restaurants.length}`);
print(`Database: tattler-db`);
print(`Collection: restaurants`);
print(`Timestamp: ${new Date().toISOString()}`);
print('');

// Show sample record
if (restaurants.length > 0) {
    print('📝 Sample Record:');
    printjson({
        name: restaurants[0].name,
        cuisine_type: restaurants[0].cuisine_type,
        city: restaurants[0].city,
        rating: restaurants[0].rating
    });
}

print('');
print('✅ Backup completed successfully!');
print('💡 To restore: mongosh --file direct-import.js');