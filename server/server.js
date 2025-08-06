import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB, { initializeDatabase } from './config/database.js';
import PostSchedulerService from './scheduler/postScheduler.js';

// Import routes
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import analyticsRoutes from './routes/analytics.js';
import aiRoutes from './routes/ai.js';
import socialMediaRoutes from './routes/socialMedia.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
await connectDB();

// Initialize database (create indexes, etc.)
await initializeDatabase();

// Initialize and start the post scheduler
const scheduler = new PostSchedulerService();
scheduler.start();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/social', socialMediaRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { checkDBHealth } = await import('./config/database.js');
    const dbHealth = await checkDBHealth();
    
    res.json({ 
      status: 'OK', 
      message: 'KIZAZI Backend is running!',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      services: {
        scheduler: scheduler.isRunning ? 'running' : 'stopped',
        api: 'healthy'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 KIZAZI Backend server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📅 Post Scheduler: ${scheduler.isRunning ? 'Running' : 'Stopped'}`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  scheduler.stop();
  process.exit(0);
});

export default app;