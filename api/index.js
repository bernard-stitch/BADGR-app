// Main API root endpoint
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ 
    message: 'BADGR API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      testDb: '/api/test-db',
      widgets: '/api/widgets',
      widgetByShop: '/api/widgets/[shopId]'
    }
  });
} 