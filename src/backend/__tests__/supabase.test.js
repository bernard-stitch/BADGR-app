// Use doMock to allow for dynamic mock replacement
let mockSupabaseClient;

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

// Create a mock that can be overridden per test
const createMockSupabaseClient = (shouldError = false, shouldReturnNull = false) => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      limit: jest.fn(() => ({ 
        data: shouldError ? null : [], 
        error: shouldError ? { message: 'Connection failed' } : null 
      })),
      eq: jest.fn(() => ({
        single: jest.fn(() => ({ 
          data: shouldReturnNull ? null : mockWidgetConfig, 
          error: null 
        })),
        select: jest.fn(() => ({
          single: jest.fn(() => ({ 
            data: shouldReturnNull ? null : mockWidgetConfig, 
            error: shouldReturnNull ? { message: 'Shop not found' } : null 
          }))
        }))
      }))
    })),
    upsert: jest.fn((data) => {
      // Simulate validation error for invalid data
      if (!data.shop_id || !data.shop_domain) {
        return {
          select: jest.fn(() => ({
            single: jest.fn(() => ({ 
              data: null, 
              error: { message: 'shop_id and shop_domain are required' } 
            }))
          }))
        };
      }
      return {
        select: jest.fn(() => ({
          single: jest.fn(() => ({ data: mockWidgetConfig, error: null }))
        }))
      };
    }),
    update: jest.fn(() => ({
      eq: jest.fn((column, value) => {
        // Simulate error for non-existent shop
        if (value === 'non-existent') {
          return {
            select: jest.fn(() => ({
              single: jest.fn(() => ({ 
                data: null, 
                error: { message: 'Shop not found' } 
              }))
            }))
          };
        }
        return {
          select: jest.fn(() => ({
            single: jest.fn(() => ({ data: mockWidgetConfig, error: null }))
          }))
        };
      })
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({ data: null, error: null }))
    }))
  }))
});

// Mock Supabase client to avoid real database calls in tests
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));

// Set default mock
mockSupabaseClient = createMockSupabaseClient();

describe('Supabase Configuration', () => {
  let testConnection, widgetConfigService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Reset to default mock
    mockSupabaseClient = createMockSupabaseClient();
    const { createClient } = require('@supabase/supabase-js');
    createClient.mockReturnValue(mockSupabaseClient);
    
    // Re-require the module to get fresh instances
    const supabaseModule = require('../config/supabase');
    testConnection = supabaseModule.testConnection;
    widgetConfigService = supabaseModule.widgetConfigService;
  });

  describe('testConnection', () => {
    it('should test database connection successfully', async () => {
      const result = await testConnection();
      expect(result).toBe(true);
    });

    it('should handle connection errors gracefully', async () => {
      // Override mock for this test
      mockSupabaseClient = createMockSupabaseClient(true); // shouldError = true
      const { createClient } = require('@supabase/supabase-js');
      createClient.mockReturnValue(mockSupabaseClient);
      
      // Re-require module with error mock
      jest.resetModules();
      const { testConnection: errorTestConnection } = require('../config/supabase');

      const result = await errorTestConnection();
      expect(result).toBe(false);
    });
  });

  describe('widgetConfigService', () => {
    describe('getByShopId', () => {
      it('should retrieve widget configuration by shop ID', async () => {
        const config = await widgetConfigService.getByShopId('test-shop');
        expect(config).toEqual(mockWidgetConfig);
      });

      it('should handle non-existent shop gracefully', async () => {
        // Override mock for this test
        mockSupabaseClient = createMockSupabaseClient(false, true); // shouldReturnNull = true
        const { createClient } = require('@supabase/supabase-js');
        createClient.mockReturnValue(mockSupabaseClient);
        
        // Re-require module with null mock
        jest.resetModules();
        const { widgetConfigService: nullConfigService } = require('../config/supabase');

        const config = await nullConfigService.getByShopId('non-existent');
        expect(config).toBeNull();
      });
    });

    describe('upsert', () => {
      it('should create or update widget configuration', async () => {
        const validConfig = {
          shop_id: 'test-shop',
          shop_domain: 'test-shop.myshopify.com',
          widget_enabled: true
        };

        const result = await widgetConfigService.upsert(validConfig);
        expect(result).toEqual(mockWidgetConfig);
      });

      it('should handle invalid configuration data', async () => {
        const invalidConfig = {
          // Missing required shop_id and shop_domain
          widget_enabled: true
        };

        await expect(widgetConfigService.upsert(invalidConfig))
          .rejects.toThrow('shop_id and shop_domain are required');
      });
    });

    describe('update', () => {
      it('should update existing widget configuration', async () => {
        const updates = { widget_enabled: false };
        
        const result = await widgetConfigService.update('test-shop', updates);
        expect(result).toEqual(expect.objectContaining({
          shop_id: 'test-shop',
          widget_enabled: true // Mock returns original data
        }));
      });

      it('should handle updates to non-existent shop', async () => {
        const updates = { widget_enabled: false };

        await expect(widgetConfigService.update('non-existent', updates))
          .rejects.toThrow('Shop not found');
      });
    });

    describe('delete', () => {
      it('should delete widget configuration', async () => {
        const result = await widgetConfigService.delete('test-shop');
        expect(result).toBe(true);
      });

      it('should handle deletion of non-existent configuration', async () => {
        // Mock successful deletion even for non-existent (Supabase behavior)
        const result = await widgetConfigService.delete('non-existent');
        expect(result).toBe(true);
      });
    });
  });
}); 