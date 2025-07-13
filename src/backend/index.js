require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { supabase, testConnection } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'BADGR API Server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Database connection test route
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      database: 'supabase',
      connected: isConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection test failed',
      message: error.message 
    });
  }
});

// API routes
app.use('/api/widgets', require('./routes/widgets'));

// TODO: Add more API routes as needed
// app.use('/api/config', require('./routes/config'));

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 BADGR Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`🎯 Widget API: http://localhost:${PORT}/api/widgets`);
  
  // Test Supabase connection on startup
  await testConnection();
});

module.exports = app; 