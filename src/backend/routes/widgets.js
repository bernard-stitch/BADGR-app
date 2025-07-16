const express = require('express');
const { widgetConfigService, supabase } = require('../config/supabase');
const router = express.Router();

// GET /api/widgets - Get all widget configurations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('widget_configurations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching widget configurations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch widget configurations',
      message: error.message
    });
  }
});

// GET /api/widgets/:shopId - Get widget configuration by shop ID or domain
router.get('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID or domain is required'
      });
    }
    
    // Try to get by shop ID first, then by domain
    let data = await widgetConfigService.getByShopId(shopId);
    
    // If not found by shop ID, try by domain
    if (!data) {
      try {
        const { data: domainData, error } = await supabase
          .from('widget_configurations')
          .select('*')
          .eq('shop_domain', shopId)
          .single();
        
        if (!error && domainData) {
          data = domainData;
        }
      } catch (domainError) {
        console.warn('Failed to lookup by domain:', domainError);
      }
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Widget configuration not found for this shop'
      });
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching widget configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch widget configuration',
      message: error.message
    });
  }
});

// POST /api/widgets - Create new widget configuration
router.post('/', async (req, res) => {
  try {
    const {
      shop_id,
      shop_domain,
      widget_enabled = true,
      logo_selection = 'default',
      widget_placement = 'product_description',
      bnpl_enabled = true,
      custom_settings = {}
    } = req.body;
    
    // Validate required fields
    if (!shop_id || !shop_domain) {
      return res.status(400).json({
        success: false,
        error: 'shop_id and shop_domain are required'
      });
    }
    
    // Validate widget placement options
    const validPlacements = ['product_description', 'product_title', 'product_price', 'product_image'];
    if (!validPlacements.includes(widget_placement)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid widget_placement. Must be one of: ' + validPlacements.join(', ')
      });
    }
    
    const configData = {
      shop_id,
      shop_domain,
      widget_enabled,
      logo_selection,
      widget_placement,
      bnpl_enabled,
      custom_settings
    };
    
    const data = await widgetConfigService.upsert(configData);
    
    res.status(201).json({
      success: true,
      data,
      message: 'Widget configuration created successfully'
    });
  } catch (error) {
    console.error('Error creating widget configuration:', error);
    
    // Handle duplicate key error
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({
        success: false,
        error: 'Widget configuration already exists for this shop',
        message: 'Use PUT to update existing configuration'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create widget configuration',
      message: error.message
    });
  }
});

// PUT /api/widgets/:shopId - Update widget configuration
router.put('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const updates = req.body;
    
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID is required'
      });
    }
    
    // Remove shop_id from updates to prevent conflicts
    delete updates.shop_id;
    delete updates.id;
    delete updates.created_at;
    
    // Validate widget placement if provided
    if (updates.widget_placement) {
      const validPlacements = ['product_description', 'product_title', 'product_price', 'product_image'];
      if (!validPlacements.includes(updates.widget_placement)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid widget_placement. Must be one of: ' + validPlacements.join(', ')
        });
      }
    }
    
    const data = await widgetConfigService.update(shopId, updates);
    
    res.json({
      success: true,
      data,
      message: 'Widget configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating widget configuration:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Widget configuration not found for this shop'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update widget configuration',
      message: error.message
    });
  }
});

// DELETE /api/widgets/:shopId - Delete widget configuration
router.delete('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID is required'
      });
    }
    
    await widgetConfigService.delete(shopId);
    
    res.json({
      success: true,
      message: 'Widget configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting widget configuration:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Widget configuration not found for this shop'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete widget configuration',
      message: error.message
    });
  }
});

// PATCH /api/widgets/:shopId/toggle - Toggle widget enabled status
router.patch('/:shopId/toggle', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { enabled } = req.body;
    
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID is required'
      });
    }
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'enabled field must be a boolean'
      });
    }
    
    const data = await widgetConfigService.update(shopId, { widget_enabled: enabled });
    
    res.json({
      success: true,
      data,
      message: `Widget ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error toggling widget status:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Widget configuration not found for this shop'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to toggle widget status',
      message: error.message
    });
  }
});

// GET /api/widgets/stats/summary - Get widget configuration statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('widget_configurations')
      .select('widget_enabled, bnpl_enabled, logo_selection, widget_placement');
    
    if (error) {
      throw error;
    }
    
    const stats = {
      total: data.length,
      enabled: data.filter(config => config.widget_enabled).length,
      disabled: data.filter(config => !config.widget_enabled).length,
      bnpl_enabled: data.filter(config => config.bnpl_enabled).length,
      logo_usage: {},
      placement_usage: {}
    };
    
    // Count logo usage
    data.forEach(config => {
      stats.logo_usage[config.logo_selection] = (stats.logo_usage[config.logo_selection] || 0) + 1;
    });
    
    // Count placement usage
    data.forEach(config => {
      stats.placement_usage[config.widget_placement] = (stats.placement_usage[config.widget_placement] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching widget statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch widget statistics',
      message: error.message
    });
  }
});

// POST /api/widgets/:widgetId/options - Get BNPL options for a product
router.post('/:widgetId/options', async (req, res) => {
  try {
    const { widgetId } = req.params;
    const { productId, price, currency = 'USD', enabledProviders = [], placement } = req.body;
    const shopDomain = req.headers['x-shopify-shop-domain'];
    
    if (!productId || !price) {
      return res.status(400).json({
        success: false,
        error: 'productId and price are required'
      });
    }
    
    // Get widget configuration for this shop
    let widgetConfig = null;
    if (shopDomain) {
      try {
        const { data } = await supabase
          .from('widget_configurations')
          .select('*')
          .eq('shop_domain', shopDomain)
          .single();
        widgetConfig = data;
      } catch (error) {
        console.warn('Widget configuration not found for shop:', shopDomain);
      }
    }
    
    // Generate BNPL options based on enabled providers
    const options = await generateBNPLOptions({
      productId,
      price: parseFloat(price),
      currency,
      enabledProviders,
      placement,
      widgetConfig,
      shopDomain
    });
    
    res.json({
      success: true,
      options,
      productId,
      price,
      currency,
      widgetId
    });
  } catch (error) {
    console.error('Error generating BNPL options:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate BNPL options',
      message: error.message
    });
  }
});

// Helper function to generate BNPL options
async function generateBNPLOptions({ productId, price, currency, enabledProviders, placement, widgetConfig, shopDomain }) {
  const options = [];
  
  // BNPL provider configurations
  const providerConfigs = {
    klarna: {
      displayName: 'Klarna',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/klarna-logo.svg`,
      minAmount: 1,
      maxAmount: 10000,
      installments: 4,
      eligibilityRules: (price) => price >= 1 && price <= 10000
    },
    afterpay: {
      displayName: 'Afterpay',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/afterpay-logo.svg`,
      minAmount: 1,
      maxAmount: 2000,
      installments: 4,
      eligibilityRules: (price) => price >= 1 && price <= 2000
    },
    affirm: {
      displayName: 'Affirm',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/affirm-logo.svg`,
      minAmount: 50,
      maxAmount: 30000,
      installments: 3,
      eligibilityRules: (price) => price >= 50 && price <= 30000
    },
    sezzle: {
      displayName: 'Sezzle',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/sezzle-logo.svg`,
      minAmount: 1,
      maxAmount: 2500,
      installments: 4,
      eligibilityRules: (price) => price >= 1 && price <= 2500
    },
    zip: {
      displayName: 'Zip',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/zip-logo.svg`,
      minAmount: 1,
      maxAmount: 1500,
      installments: 4,
      eligibilityRules: (price) => price >= 1 && price <= 1500
    },
    paypal_credit: {
      displayName: 'PayPal Credit',
      logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/paypal-credit-logo.svg`,
      minAmount: 99,
      maxAmount: 10000,
      installments: 6,
      eligibilityRules: (price) => price >= 99 && price <= 10000
    }
  };
  
  // Process each enabled provider
  for (const provider of enabledProviders) {
    const config = providerConfigs[provider];
    if (!config) continue;
    
    const isEligible = config.eligibilityRules(price);
    
    if (isEligible) {
      const installmentAmount = (price / config.installments).toFixed(2);
      const installmentText = `${config.installments} payments of ${currency === 'USD' ? '$' : ''}${installmentAmount}`;
      
      options.push({
        provider,
        displayName: config.displayName,
        logoUrl: config.logoUrl,
        installmentText,
        terms: `Interest-free installments`,
        isEligible: true,
        redirectUrl: generateProviderRedirectUrl(provider, {
          productId,
          price,
          currency,
          shopDomain
        })
      });
    }
  }
  
  return options;
}

// Helper function to generate provider redirect URLs
function generateProviderRedirectUrl(provider, { productId, price, currency, shopDomain }) {
  const baseUrls = {
    klarna: 'https://www.klarna.com/us/shopping/checkout',
    afterpay: 'https://www.afterpay.com/checkout',
    affirm: 'https://www.affirm.com/apps/checkout',
    sezzle: 'https://checkout.sezzle.com',
    zip: 'https://zip.co/checkout',
    paypal_credit: 'https://www.paypal.com/credit'
  };
  
  const baseUrl = baseUrls[provider];
  if (!baseUrl) return '#';
  
  // Create checkout URL with product information
  const params = new URLSearchParams({
    amount: price.toString(),
    currency,
    product_id: productId,
    shop_domain: shopDomain || '',
    return_url: `${shopDomain}/checkout/complete`,
    cancel_url: `${shopDomain}/cart`
  });
  
  return `${baseUrl}?${params.toString()}`;
}

// POST /api/widgets/track - Track widget events for analytics
router.post('/track', async (req, res) => {
  try {
    const { event, data, timestamp, url, userAgent } = req.body;
    const shopDomain = req.headers['x-shopify-shop-domain'];
    
    // Log the event (in production, you'd want to send to analytics service)
    console.log('Widget Analytics Event:', {
      event,
      data,
      timestamp,
      url,
      userAgent,
      shopDomain
    });
    
    // In production, you could store this in a separate analytics table
    // or send to services like Google Analytics, Mixpanel, etc.
    
    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track event',
      message: error.message
    });
  }
});

module.exports = router; 