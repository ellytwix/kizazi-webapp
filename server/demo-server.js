import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// In-memory demo data
let users = [];
let posts = [];
let userIdCounter = 1;
let postIdCounter = 1;

// Demo JWT secret
const JWT_SECRET = 'demo-secret-key';

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Demo authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'KIZAZI Demo Backend is running!',
    timestamp: new Date().toISOString(),
    mode: 'DEMO MODE - No database required'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      plan: 'pro', // Give everyone pro for demo
      createdAt: new Date()
    };
    
    users.push(user);
    
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.get('/api/auth/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      plan: req.user.plan
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Posts routes
app.get('/api/posts', authenticate, (req, res) => {
  const userPosts = posts.filter(p => p.userId === req.user.id);
  res.json({
    success: true,
    posts: userPosts,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: userPosts.length
    }
  });
});

app.post('/api/posts', authenticate, (req, res) => {
  const { platform, content, scheduledDate, hashtags = [] } = req.body;
  
  const post = {
    id: postIdCounter++,
    userId: req.user.id,
    platform,
    content,
    scheduledDate,
    hashtags,
    status: 'scheduled',
    createdAt: new Date(),
    analytics: {
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10)
    }
  };
  
  posts.push(post);
  
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post
  });
});

app.get('/api/posts/upcoming/week', authenticate, (req, res) => {
  const userPosts = posts.filter(p => p.userId === req.user.id && p.status === 'scheduled');
  res.json({
    success: true,
    posts: userPosts.slice(0, 5)
  });
});

// Analytics routes
app.get('/api/analytics/dashboard', authenticate, (req, res) => {
  const userPosts = posts.filter(p => p.userId === req.user.id);
  const publishedPosts = userPosts.filter(p => p.status === 'published');
  
  res.json({
    success: true,
    analytics: {
      overview: {
        totalPosts: userPosts.length,
        scheduledPosts: userPosts.filter(p => p.status === 'scheduled').length,
        publishedPosts: publishedPosts.length
      },
      engagement: {
        likes: publishedPosts.reduce((sum, p) => sum + (p.analytics?.likes || 0), 0),
        comments: publishedPosts.reduce((sum, p) => sum + (p.analytics?.comments || 0), 0),
        shares: publishedPosts.reduce((sum, p) => sum + (p.analytics?.shares || 0), 0),
        growthRate: 8.5
      },
      platforms: [
        { name: 'Instagram', posts: 12, likes: 245, comments: 67 },
        { name: 'Facebook', posts: 8, likes: 189, comments: 34 },  
        { name: 'X', posts: 15, likes: 123, comments: 89 }
      ]
    }
  });
});

// AI routes (mock responses)
app.post('/api/ai/generate-content', authenticate, (req, res) => {
  const { prompt, platform = 'Instagram' } = req.body;
  
  const mockContent = {
    caption: `🌟 Exciting times ahead! Here's something amazing about ${prompt}. Let's make it happen together! 💪`,
    hashtags: ['#KIZAZI', '#SocialMedia', '#Africa', '#Growth', '#Success'],
    platform,
    strategy: 'AI-generated content optimized for engagement',
    characterCount: 95,
    hashtagCount: 5,
    generatedAt: new Date()
  };
  
  res.json({
    success: true,
    message: 'Content generated successfully (Demo Mode)',
    content: mockContent
  });
});

// Social media routes
app.get('/api/social/accounts', authenticate, (req, res) => {
  res.json({
    success: true,
    accounts: [
      { platform: 'Instagram', accountName: 'demo_account', isActive: true },
      { platform: 'Facebook', accountName: 'Demo Page', isActive: true },
      { platform: 'X', accountName: '@demo_handle', isActive: true }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KIZAZI Demo Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🎯 Mode: DEMO - No database required!`);
  console.log(`✨ Ready for demo! Visit http://localhost:5173`);
});

export default app;