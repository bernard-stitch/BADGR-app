# BADGR Backend Configuration

## Environment Variables

The BADGR backend uses the following configuration approach:

### Primary Configuration
- **Supabase Connection**: Configured via `config/supabase.json` (automatically loaded)
- **Server Port**: Defaults to 3000, can be overridden with `PORT` environment variable
- **Node Environment**: Set via `NODE_ENV` (development/production)

### Supabase Configuration
The backend automatically loads Supabase configuration from `../../../config/supabase.json` which contains:
- Project URL: `https://rprltzscbxsqhigemejr.supabase.co`
- Anonymous Key: Auto-loaded from config file
- Project ID: `rprltzscbxsqhigemejr`
- Region: `us-east-1`

### Environment Variables (Optional Overrides)
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration (optional overrides)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Database Schema
- **widget_configurations** table is configured with:
  - shop_id (unique identifier)
  - shop_domain
  - widget_enabled (boolean)
  - logo_selection
  - widget_placement
  - bnpl_enabled (boolean)
  - custom_settings (JSON)
  - created_at/updated_at (automatic timestamps)

### Helper Functions
The `widgetConfigService` provides:
- `getByShopId(shopId)` - Get configuration for a shop
- `upsert(config)` - Create or update configuration
- `update(shopId, updates)` - Update specific fields
- `delete(shopId)` - Remove configuration

### Usage Example
```javascript
const { widgetConfigService } = require('./config/supabase');

// Get configuration for a shop
const config = await widgetConfigService.getByShopId('shop_123');

// Create/update configuration
await widgetConfigService.upsert({
  shop_id: 'shop_123',
  shop_domain: 'example.myshopify.com',
  widget_enabled: true,
  logo_selection: 'logo_badgr_blue',
  widget_placement: 'product_description',
  bnpl_enabled: true,
  custom_settings: { theme: 'modern' }
});
``` 