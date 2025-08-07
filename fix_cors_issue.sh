#!/bin/bash
set -e
cd /var/www/kizazi/server

echo "=== FIXING CORS & API ENDPOINT ISSUES ==="

# 1. Fix server.js with proper CORS configuration
echo "--- 1. Updating server.js with robust CORS config ---"
cat > server.js <<'SERVER_FIX'
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('🔧 Environment loaded from:', envPath);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🚀 PORT:', process.env.PORT);
console.log('🌐 FRONTEND_URL:', process.env.FRONTEND_URL);

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import pingRoutes from './routes/ping.js';
import geminiRoutes from './routes/gemini.js';
import analyticsExportRoutes from './routes/analyticsExport.js';

// Import database connection
import './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind Nginx
app.set('trust proxy', 1);

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://kizazisocial.com',
    'https://www.kizazisocial.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 86400 // 24 hours
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (before auth middleware)
app.use('/api/ping', pingRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/analytics', analyticsExportRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    origin: req.get('Origin')
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'KizaziSocial Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/api/ping', '/api/test', '/api/auth', '/api/posts']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    requested: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📍 Server accessible at: http://0.0.0.0:${PORT}`);
});

export default app;
SERVER_FIX

# 2. Ensure ping route is robust
echo "--- 2. Updating ping route ---"
cat > routes/ping.js <<'PING_FIX'
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
PING_FIX

# 3. Restart the backend
echo "--- 3. Restarting backend with new configuration ---"
pm2 restart kizazi-backend

# 4. Wait a moment for startup
sleep 3

# 5. Test the endpoints
echo "--- 4. Testing backend endpoints ---"
echo "Testing root endpoint:"
curl -s http://localhost:5000/ | head -5

echo -e "\nTesting ping endpoint:"
curl -s http://localhost:5000/api/ping | head -5

echo -e "\nTesting with CORS headers:"
curl -s -H "Origin: https://kizazisocial.com" http://localhost:5000/api/ping | head -5

# 6. Check PM2 status
echo -e "\n--- 5. Updated PM2 Status ---"
pm2 status | grep kizazi

echo ""
echo "✅ CORS FIX APPLIED!"
echo "✅ Backend should now respond properly to frontend requests"
echo "✅ Check your website - the 'Backend Unreachable' message should disappear"
echo ""
