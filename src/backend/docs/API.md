# BADGR Widget Configuration API Documentation

## Base URL
```
http://localhost:3000/api/widgets
```

## Authentication
Currently, the API does not require authentication. This will be implemented in future versions with Shopify app authentication.

## Response Format
All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Endpoints

### 1. Get All Widget Configurations
**GET** `/api/widgets`

Returns all widget configurations ordered by creation date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "shop_id": "string",
      "shop_domain": "string",
      "widget_enabled": boolean,
      "logo_selection": "string",
      "widget_placement": "string",
      "bnpl_enabled": boolean,
      "custom_settings": {},
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "count": 0
}
```

### 2. Get Widget Configuration by Shop ID
**GET** `/api/widgets/:shopId`

Returns the widget configuration for a specific shop.

**Parameters:**
- `shopId` (string, required): The unique shop identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shop_id": "test_shop_123",
    "shop_domain": "test-shop.myshopify.com",
    "widget_enabled": true,
    "logo_selection": "logo_badgr_blue",
    "widget_placement": "product_description",
    "bnpl_enabled": true,
    "custom_settings": {"theme": "modern"},
    "created_at": "2025-07-12T13:30:54.809997+00:00",
    "updated_at": "2025-07-12T13:30:54.809997+00:00"
  }
}
```

**Error Responses:**
- `400` - Shop ID is required
- `404` - Widget configuration not found for this shop

### 3. Create Widget Configuration
**POST** `/api/widgets`

Creates a new widget configuration for a shop.

**Request Body:**
```json
{
  "shop_id": "string (required)",
  "shop_domain": "string (required)",
  "widget_enabled": true,
  "logo_selection": "default",
  "widget_placement": "product_description",
  "bnpl_enabled": true,
  "custom_settings": {}
}
```

**Field Descriptions:**
- `shop_id`: Unique identifier for the Shopify store
- `shop_domain`: Store domain (e.g., "example.myshopify.com")
- `widget_enabled`: Whether the widget is enabled (default: true)
- `logo_selection`: Logo choice from library (default: "default")
- `widget_placement`: Where to place the widget (default: "product_description")
- `bnpl_enabled`: Whether BNPL functionality is enabled (default: true)
- `custom_settings`: Additional settings as JSON object

**Valid Widget Placement Options:**
- `product_description`
- `product_title`
- `product_price`
- `product_image`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shop_id": "test_shop_123",
    "shop_domain": "test-shop.myshopify.com",
    "widget_enabled": true,
    "logo_selection": "logo_badgr_blue",
    "widget_placement": "product_description",
    "bnpl_enabled": true,
    "custom_settings": {"theme": "modern"},
    "created_at": "2025-07-12T13:30:54.809997+00:00",
    "updated_at": "2025-07-12T13:30:54.809997+00:00"
  },
  "message": "Widget configuration created successfully"
}
```

**Error Responses:**
- `400` - Validation error (missing required fields or invalid placement)
- `409` - Widget configuration already exists for this shop

### 4. Update Widget Configuration
**PUT** `/api/widgets/:shopId`

Updates an existing widget configuration.

**Parameters:**
- `shopId` (string, required): The unique shop identifier

**Request Body:**
```json
{
  "widget_enabled": false,
  "logo_selection": "logo_badgr_red",
  "widget_placement": "product_title",
  "bnpl_enabled": false,
  "custom_settings": {"theme": "classic"}
}
```

**Note:** Only include fields you want to update. `shop_id`, `id`, and `created_at` are protected and cannot be modified.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shop_id": "test_shop_123",
    "shop_domain": "test-shop.myshopify.com",
    "widget_enabled": false,
    "logo_selection": "logo_badgr_red",
    "widget_placement": "product_title",
    "bnpl_enabled": false,
    "custom_settings": {"theme": "classic"},
    "created_at": "2025-07-12T13:30:54.809997+00:00",
    "updated_at": "2025-07-12T13:31:12.72462+00:00"
  },
  "message": "Widget configuration updated successfully"
}
```

**Error Responses:**
- `400` - Shop ID is required or invalid widget placement
- `404` - Widget configuration not found for this shop

### 5. Delete Widget Configuration
**DELETE** `/api/widgets/:shopId`

Deletes a widget configuration for a shop.

**Parameters:**
- `shopId` (string, required): The unique shop identifier

**Response:**
```json
{
  "success": true,
  "message": "Widget configuration deleted successfully"
}
```

**Error Responses:**
- `400` - Shop ID is required
- `404` - Widget configuration not found for this shop

### 6. Toggle Widget Status
**PATCH** `/api/widgets/:shopId/toggle`

Toggles the enabled status of a widget configuration.

**Parameters:**
- `shopId` (string, required): The unique shop identifier

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "shop_id": "test_shop_123",
    "shop_domain": "test-shop.myshopify.com",
    "widget_enabled": true,
    "logo_selection": "logo_badgr_red",
    "widget_placement": "product_title",
    "bnpl_enabled": true,
    "custom_settings": {"theme": "classic"},
    "created_at": "2025-07-12T13:30:54.809997+00:00",
    "updated_at": "2025-07-12T13:35:36.145561+00:00"
  },
  "message": "Widget enabled successfully"
}
```

**Error Responses:**
- `400` - Shop ID is required or enabled field must be boolean
- `404` - Widget configuration not found for this shop

### 7. Get Widget Statistics
**GET** `/api/widgets/stats/summary`

Returns statistics about widget configurations.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "enabled": 1,
    "disabled": 0,
    "bnpl_enabled": 1,
    "logo_usage": {
      "logo_badgr_red": 1,
      "logo_badgr_blue": 2,
      "default": 5
    },
    "placement_usage": {
      "product_title": 1,
      "product_description": 6,
      "product_price": 1
    }
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Example Usage

### Create a new widget configuration
```bash
curl -X POST http://localhost:3000/api/widgets \
  -H "Content-Type: application/json" \
  -d '{
    "shop_id": "my_shop_123",
    "shop_domain": "my-shop.myshopify.com",
    "widget_enabled": true,
    "logo_selection": "logo_badgr_blue",
    "widget_placement": "product_description",
    "bnpl_enabled": true,
    "custom_settings": {"theme": "modern", "color": "#007bff"}
  }'
```

### Get widget configuration
```bash
curl http://localhost:3000/api/widgets/my_shop_123
```

### Update widget configuration
```bash
curl -X PUT http://localhost:3000/api/widgets/my_shop_123 \
  -H "Content-Type: application/json" \
  -d '{
    "widget_enabled": false,
    "logo_selection": "logo_badgr_red"
  }'
```

### Toggle widget status
```bash
curl -X PATCH http://localhost:3000/api/widgets/my_shop_123/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### Get statistics
```bash
curl http://localhost:3000/api/widgets/stats/summary
```

### Delete widget configuration
```bash
curl -X DELETE http://localhost:3000/api/widgets/my_shop_123
```

## Error Handling

All endpoints include comprehensive error handling:

- **Validation Errors**: Return 400 with specific error messages
- **Not Found Errors**: Return 404 when resources don't exist
- **Conflict Errors**: Return 409 for duplicate resources
- **Database Errors**: Return 500 with generic error messages (detailed errors logged server-side)

## Database Schema

The widget configurations are stored in the `widget_configurations` table with the following structure:

```sql
CREATE TABLE widget_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id VARCHAR(255) NOT NULL UNIQUE,
    shop_domain VARCHAR(255) NOT NULL,
    widget_enabled BOOLEAN DEFAULT true,
    logo_selection VARCHAR(100) DEFAULT 'default',
    widget_placement VARCHAR(50) DEFAULT 'product_description',
    bnpl_enabled BOOLEAN DEFAULT true,
    custom_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Future Enhancements

- Shopify app authentication
- Webhook endpoints for real-time updates
- Bulk operations for multiple configurations
- Advanced filtering and pagination
- Rate limiting and caching 