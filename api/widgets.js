import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        // GET /api/widgets - Get all widget configurations
        const { data, error } = await supabase
          .from('widget_configurations')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return res.status(200).json({
          success: true,
          data,
          count: data.length
        });

      case 'POST':
        // POST /api/widgets - Create new widget configuration
        const { widget_data } = req.body;
        
        if (!widget_data) {
          return res.status(400).json({
            success: false,
            error: 'Widget data is required'
          });
        }

        const { data: newData, error: createError } = await supabase
          .from('widget_configurations')
          .insert([widget_data])
          .select();
        
        if (createError) {
          throw createError;
        }
        
        return res.status(201).json({
          success: true,
          data: newData[0]
        });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Widgets API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 