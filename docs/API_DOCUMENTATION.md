# Restaurant Directory API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API is open for development. Future versions will implement JWT authentication.

## Response Format
All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {...}
}
```

## Endpoints

### 1. Get All Restaurants
**GET** `/restaurants`

Retrieves a list of all restaurants with optional filtering and pagination.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Results per page | 10 |
| cuisine_type | string | Filter by cuisine | - |
| city | string | Filter by city | - |
| min_rating | number | Minimum rating | - |
| max_price | number | Maximum price level | - |
| search | string | Text search | - |
| sort_by | string | Sort field | name |
| sort_order | string | Sort direction (asc/desc) | asc |

#### Example Request
```http
GET /api/restaurants?cuisine_type=Mexicana&min_rating=4.0&page=1&limit=5
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "restaurants": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRestaurants": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Get Restaurant by ID
**GET** `/restaurants/:id`

Retrieves a specific restaurant by its ID.

#### Example Request
```http
GET /api/restaurants/68e5e441a3bef30c7ccebea4
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "_id": "68e5e441a3bef30c7ccebea4",
    "name": "El Rey del Cabrito",
    "cuisine_type": "Mexicana",
    "rating": 4.6,
    "city": "Monterrey"
  }
}
```

### 3. Create Restaurant
**POST** `/restaurants`

Creates a new restaurant.

#### Request Body
```json
{
  "name": "New Restaurant",
  "description": "Restaurant description",
  "category": ["Category1", "Category2"],
  "cuisine_type": "Mexicana",
  "phone": "+52-81-1234-5678",
  "email": "contact@restaurant.com",
  "website": "https://restaurant.com",
  "street": "Street Address",
  "neighborhood": "Neighborhood",
  "city": "City",
  "state": "State",
  "country": "Country",
  "zipcode": "12345",
  "longitude": -100.3095,
  "latitude": 25.6695,
  "price_level": 2,
  "avg_cost_per_person": 250,
  "min_cost": 150,
  "max_cost": 350,
  "rating": 4.5,
  "total_reviews": 100
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "_id": "68e5e441a3bef30c7ccebea9",
    "name": "New Restaurant",
    "created_at": "2025-10-08T10:30:00.000Z"
  },
  "message": "Restaurant created successfully"
}
```

### 4. Update Restaurant
**PUT** `/restaurants/:id`

Updates an existing restaurant.

#### Request Body
```json
{
  "name": "Updated Restaurant Name",
  "rating": 4.8,
  "description": "Updated description"
}
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "_id": "68e5e441a3bef30c7ccebea4",
    "name": "Updated Restaurant Name",
    "updated_at": "2025-10-08T10:35:00.000Z"
  },
  "message": "Restaurant updated successfully"
}
```

### 5. Delete Restaurant
**DELETE** `/restaurants/:id`

Deletes a restaurant by ID.

#### Example Response
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

### 6. Find Nearby Restaurants
**GET** `/restaurants/nearby`

Finds restaurants within a specified radius.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| longitude | number | Yes | Longitude coordinate |
| latitude | number | Yes | Latitude coordinate |
| radius | number | No | Radius in meters (default: 1000) |

#### Example Request
```http
GET /api/restaurants/nearby?longitude=-100.3095&latitude=25.6695&radius=5000
```

### 7. Get Restaurant Statistics
**GET** `/restaurants/stats`

Returns aggregated statistics about restaurants.

#### Example Response
```json
{
  "success": true,
  "data": {
    "totalRestaurants": 5,
    "averageRating": 4.48,
    "cuisineTypes": {
      "Mexicana": 3,
      "Italiana": 1,
      "Café": 1
    },
    "cityDistribution": {
      "Monterrey": 5
    },
    "priceDistribution": {
      "1": 1,
      "2": 3,
      "3": 1
    }
  }
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information included in response headers

## Validation Rules

### Restaurant Creation/Update
- **name**: Required, 1-100 characters
- **description**: Required, max 500 characters
- **cuisine_type**: Required, must be from allowed list
- **phone**: Optional, valid phone format
- **email**: Optional, valid email format
- **coordinates**: longitude and latitude must be valid numbers
- **rating**: 0-5 range
- **price_level**: 1-5 range

## Examples with cURL

### Get all restaurants
```bash
curl -X GET "http://localhost:3000/api/restaurants"
```

### Create a restaurant
```bash
curl -X POST "http://localhost:3000/api/restaurants" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "description": "A test restaurant",
    "cuisine_type": "Mexicana",
    "city": "Monterrey",
    "longitude": -100.3095,
    "latitude": 25.6695
  }'
```

### Search restaurants
```bash
curl -X GET "http://localhost:3000/api/restaurants?search=tacos&min_rating=4.0"
```