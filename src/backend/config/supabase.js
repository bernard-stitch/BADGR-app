const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load Supabase configuration from config file
const configPath = path.join(__dirname, '../../../config/supabase.json');
const supabaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize Supabase client with TypeScript types
const supabase = createClient(
  supabaseConfig.project.url,
  supabaseConfig.keys.anon,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

// Test connection function
async function testConnection() {
  try {
    const { data, error } = await supabase.from('widget_configurations').select('*').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" - expected for new DB
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

// Widget configuration helper functions
const widgetConfigService = {
  // Get widget configuration for a shop
  async getByShopId(shopId) {
    const { data, error } = await supabase
      .from('widget_configurations')
      .select('*')
      .eq('shop_id', shopId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get widget configuration: ${error.message}`);
    }
    
    return data;
  },

  // Create or update widget configuration
  async upsert(config) {
    const { data, error } = await supabase
      .from('widget_configurations')
      .upsert(config, {
        onConflict: 'shop_id'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to upsert widget configuration: ${error.message}`);
    }
    
    return data;
  },

  // Update widget configuration
  async update(shopId, updates) {
    const { data, error } = await supabase
      .from('widget_configurations')
      .update(updates)
      .eq('shop_id', shopId)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update widget configuration: ${error.message}`);
    }
    
    return data;
  },

  // Delete widget configuration
  async delete(shopId) {
    const { error } = await supabase
      .from('widget_configurations')
      .delete()
      .eq('shop_id', shopId);
    
    if (error) {
      throw new Error(`Failed to delete widget configuration: ${error.message}`);
    }
    
    return true;
  }
};

module.exports = {
  supabase,
  testConnection,
  widgetConfigService
}; 