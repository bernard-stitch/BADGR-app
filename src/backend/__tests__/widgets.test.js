const request = require('supertest');
const express = require('express');

// Create a test app with the widget routes
const app = express();
app.use(express.json());

// Mock the Supabase configuration before requiring the routes
jest.mock('../config/supabase', () => {
  const mockWidgetConfig = {
    id: 1,
    shop_id: 'test-shop',
    shop_domain: 'test-shop.myshopify.com',
    widget_enabled: true,
    selected_logo: 'klarna-logo.svg',
    enabled_providers: ['klarna', 'afterpay'],
    placement: 'below_price',
    show_logos: true,
    show_payment_breakdown: true,
    apply_to_all_products: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  const mockWidgetConfigs = [mockWidgetConfig];
  
  return {
    widgetConfigService: {
      getByShopId: jest.fn((shopId) => {
        if (shopId === 'error-shop') {
          throw new Error('Database connection failed');
        }
        if (shopId === 'non-existent-shop') {
          return Promise.resolve(null);
        }
        return Promise.resolve(mockWidgetConfig);
      }),
      upsert: jest.fn(() => Promise.resolve(mockWidgetConfig)),
      update: jest.fn(() => Promise.resolve(mockWidgetConfig)),
      delete: jest.fn(() => Promise.resolve({ success: true }))
    },
    supabase: {
      from: jest.fn((table) => {
        if (table === 'widget_configurations') {
          return {
            select: jest.fn(() => ({
              order: jest.fn(() => {
                // Simulate database error for error test
                if (process.env.SIMULATE_DB_ERROR === 'true') {
                  return { data: null, error: { message: 'Database connection failed' } };
                }
                return { data: mockWidgetConfigs, error: null };
              }),
              eq: jest.fn((column, value) => ({
                single: jest.fn(() => {
                  // Return null for non-existent shop in domain lookup too
                  if (value === 'non-existent-shop') {
                    return { data: null, error: null };
                  }
                  return { data: mockWidgetConfig, error: null };
                })
              }))
            })),
            insert: jest.fn(() => ({ data: mockWidgetConfig, error: null })),
            update: jest.fn(() => ({
              eq: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn(() => ({ data: mockWidgetConfig, error: null }))
                }))
              }))
            })),
            delete: jest.fn(() => ({
              eq: jest.fn(() => ({ data: null, error: null }))
            }))
          };
        }
        return {
          select: jest.fn(() => ({ data: [], error: null }))
        };
      })
    }
  };
});

// Import routes after mocking
const widgetRoutes = require('../routes/widgets');
app.use('/api/widgets', widgetRoutes);

describe('Widget API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    delete process.env.SIMULATE_DB_ERROR;
  });

  describe('GET /api/widgets', () => {
    it('should return all widget configurations', async () => {
      const response = await request(app)
        .get('/api/widgets')
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        data: expect.any(Array),
        count: expect.any(Number)
      });
      expect(response.body.data.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle database errors', async () => {
      // Set environment variable to simulate database error
      process.env.SIMULATE_DB_ERROR = 'true';
      
      const response = await request(app)
        .get('/api/widgets')
        .expect(500);
        
      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('GET /api/widgets/:shopId', () => {
    it('should return widget configuration by shop ID', async () => {
      const response = await request(app)
        .get('/api/widgets/test-shop')
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          shop_id: 'test-shop'
        })
      });
    });

    it('should return 404 for non-existent shop', async () => {
      const response = await request(app)
        .get('/api/widgets/non-existent-shop')
        .expect(404);
        
      expect(response.body).toMatchObject({
        success: false,
        error: 'Widget configuration not found for this shop'  // Match actual API message
      });
    });
  });

  describe('POST /api/widgets', () => {
    it('should create new widget configuration', async () => {
      const newConfig = {
        shop_id: 'new-shop',
        shop_domain: 'new-shop.myshopify.com',
        widget_enabled: true,
        selected_logo: 'klarna-logo.svg',
        enabled_providers: ['klarna'],
        placement: 'below_price'
      };

      const response = await request(app)
        .post('/api/widgets')
        .send(newConfig)
        .expect(201);
      
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          shop_id: expect.any(String)
        }),
        message: 'Widget configuration created successfully'  // Include expected message
      });
    });

    it('should return 400 for missing required fields', async () => {
      const invalidConfig = {
        widget_enabled: true
      };

      const response = await request(app)
        .post('/api/widgets')
        .send(invalidConfig)
        .expect(400);
      
      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('POST /api/widgets/:widgetId/options', () => {
    it('should return BNPL options for a product', async () => {
      const productData = {
        price: 100,
        currency: 'USD',
        productId: 'test-product-123'
      };

      const response = await request(app)
        .post('/api/widgets/1/options')
        .send(productData)
        .expect(200);
        
      expect(response.body).toMatchObject({
        success: true,
        options: expect.any(Array)  // Change from 'data' to 'options'
      });
    });

    it('should handle missing product data', async () => {
      const response = await request(app)
        .post('/api/widgets/1/options')
        .send({})
        .expect(400);
        
      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('POST /api/widgets/track', () => {
    it('should track widget events', async () => {
      const trackingData = {
        event: 'widget_viewed',
        data: { productId: 'test-123' },
        timestamp: new Date().toISOString(),
        url: 'https://test-shop.myshopify.com/products/test',
        userAgent: 'Test Browser',
        shopDomain: 'test-shop.myshopify.com'
      };

      const response = await request(app)
        .post('/api/widgets/track')
        .send(trackingData)
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        message: 'Event tracked successfully'
      });
    });

    it('should handle missing tracking data gracefully', async () => {
      const response = await request(app)
        .post('/api/widgets/track')
        .send({})
        .expect(200);
      
      expect(response.body).toEqual({
        success: true,
        message: 'Event tracked successfully'
      });
    });
  });
}); 