import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('widget_configurations')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const isConnected = await testConnection();
    res.status(200).json({ 
      database: isConnected ? 'connected' : 'disconnected',
      supabase: !!process.env.SUPABASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 