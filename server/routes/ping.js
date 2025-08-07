import express from 'express';
const router = express.Router();

// Enhanced health check endpoint
router.get('/', (req, res) => {
  try {
    const healthData = {
      ok: true,
      timestamp: Date.now(),
      status: 'Backend is running',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      cors: {
        origin: req.get('Origin'),
        method: req.method,
        headers: req.headers
      }
    };
    
    console.log('✅ Ping request successful from:', req.get('Origin'));
    res.json(healthData);
  } catch (error) {
    console.error('❌ Ping error:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
      timestamp: Date.now()
    });
  }
});

// Additional test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Ping test successful',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: req.method,
      url: req.url,
      origin: req.get('Origin'),
      userAgent: req.get('User-Agent')
    }
  });
});

export default router;
