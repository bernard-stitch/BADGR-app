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

// GET /api/widgets/:shopId - Get widget configuration by shop ID
router.get('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID is required'
      });
    }
    
    const data = await widgetConfigService.getByShopId(shopId);
    
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

module.exports = router; 