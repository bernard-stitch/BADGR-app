import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Widget configuration service functions
async function getByShopId(shopId) {
  try {
    const { data, error } = await supabase
      .from('widget_configurations')
      .select('*')
      .eq('shop_id', shopId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching widget by shop ID:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { shopId } = req.query;

  if (!shopId) {
    return res.status(400).json({
      success: false,
      error: 'Shop ID or domain is required'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Try to get by shop ID first, then by domain
        let data = await getByShopId(shopId);
        
        // If not found by shop ID, try by domain
        if (!data) {
          try {
            const { data: domainData, error } = await supabase
              .from('widget_configurations')
              .select('*')
              .eq('shop_domain', shopId)
              .single();
            
            if (!error) {
              data = domainData;
            }
          } catch (domainError) {
            console.log('Shop not found by domain either:', domainError.message);
          }
        }
        
        if (!data) {
          return res.status(404).json({
            success: false,
            error: 'Widget configuration not found for this shop'
          });
        }
        
        return res.status(200).json({
          success: true,
          data
        });

      case 'PUT':
        // Update widget configuration for shop
        const { widget_data } = req.body;
        
        if (!widget_data) {
          return res.status(400).json({
            success: false,
            error: 'Widget data is required'
          });
        }

        const { data: updatedData, error: updateError } = await supabase
          .from('widget_configurations')
          .update(widget_data)
          .eq('shop_id', shopId)
          .select()
          .single();
        
        if (updateError) {
          throw updateError;
        }
        
        return res.status(200).json({
          success: true,
          data: updatedData
        });

      case 'DELETE':
        // Delete widget configuration for shop
        const { error: deleteError } = await supabase
          .from('widget_configurations')
          .delete()
          .eq('shop_id', shopId);
        
        if (deleteError) {
          throw deleteError;
        }
        
        return res.status(200).json({
          success: true,
          message: 'Widget configuration deleted successfully'
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Shop widget API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 