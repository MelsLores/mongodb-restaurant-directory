/**
 * API Test Script
 * Version: 2.0.0
 * Description: Simple test script to verify API functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Restaurant Directory API v2.0.0');
  console.log('==========================================');
  
  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    
    // Test 2: Get All Restaurants
    console.log('\n2. Testing Get All Restaurants...');
    const restaurantsResponse = await axios.get(`${BASE_URL}/api/restaurants`);
    console.log('✅ Restaurants Retrieved:', restaurantsResponse.data.data.restaurants.length);
    
    // Test 3: Get Restaurant by ID
    if (restaurantsResponse.data.data.restaurants.length > 0) {
      console.log('\n3. Testing Get Restaurant by ID...');
      const restaurantId = restaurantsResponse.data.data.restaurants[0]._id;
      const singleRestaurant = await axios.get(`${BASE_URL}/api/restaurants/${restaurantId}`);
      console.log('✅ Single Restaurant:', singleRestaurant.data.data.name);
    }
    
    // Test 4: Search Restaurants
    console.log('\n4. Testing Search Functionality...');
    const searchResponse = await axios.get(`${BASE_URL}/api/restaurants?cuisine_type=Mexicana`);
    console.log('✅ Search Results:', searchResponse.data.data.restaurants.length);
    
    // Test 5: Statistics
    console.log('\n5. Testing Statistics Endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/api/restaurants/stats`);
    console.log('✅ Statistics:', `${statsResponse.data.data.totalRestaurants} total restaurants`);
    
    console.log('\n🎉 All API tests passed successfully!');
    console.log('==========================================');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run tests
testAPI();