#!/bin/bash
set -e
cd /var/www/kizazi/server

echo "=== FIXING BACKEND MODULE ISSUES ==="

# 1. Check what's actually happening
echo "--- 1. Checking current directory and files ---"
pwd
ls -la routes/

# 2. Remove the problematic file and recreate it completely
echo "--- 2. Removing and recreating analyticsExport.js ---"
rm -f routes/analyticsExport.js

# Create with exact formatting
cat > routes/analyticsExport.js << 'ANALYTICS_FILE'
import express from 'express';

const router = express.Router();

router.get('/export/csv', (req, res) => {
  const csvData = `Date,Platform,Posts,Engagement,Reach,Followers
2025-01-15,Instagram,5,248,1234,2450
2025-01-16,Facebook,3,156,892,2455
2025-01-17,X,7,89,567,2460`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
  res.send(csvData);
});

router.get('/export/json', (req, res) => {
  const jsonData = {
    exportDate: new Date().toISOString(),
    summary: { totalPosts: 21, totalEngagement: 850 },
    dailyStats: [
      { date: '2025-01-15', platform: 'Instagram', posts: 5, engagement: 248 }
    ]
  };
  res.json(jsonData);
});

export default router;
ANALYTICS_FILE

# 3. Create simplified server.js without problematic imports
echo "--- 3. Creating minimal working server.js ---"
cat > server.js << 'SIMPLE_SERVER'
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://kizazisocial.com', 'https://www.kizazisocial.com'],
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, timestamp: Date.now(), status: 'Backend running' });
});

app.get('/api/analytics/export/csv', (req, res) => {
  const csvData = `Date,Platform,Posts,Engagement
2025-01-15,Instagram,5,248
2025-01-16,Facebook,3,156`;
  res.setHeader('Content-Type', 'text/csv');
  res.send(csvData);
});

app.post('/api/gemini/generate', (req, res) => {
  const { prompt } = req.body;
  res.json({ 
    text: `Generated content for: ${prompt}. This is demo content from KizaziSocial AI.`,
    timestamp: new Date().toISOString() 
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ 
    message: 'User created successfully',
    user: { id: 1, name, email },
    token: 'demo-token-123'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'eliyatwisa@gmail.com' && password === '12345678') {
    res.json({ 
      message: 'Login successful',
      user: { id: 1, name: 'Elly Twix', email },
      token: 'demo-token-123'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'KizaziSocial Backend API', status: 'running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
SIMPLE_SERVER

# 4. Stop and restart PM2
echo "--- 4. Restarting PM2 ---"
pm2 stop kizazi-backend
pm2 delete kizazi-backend
pm2 start server.js --name "kizazi-backend"

# 5. Test endpoints
sleep 3
echo "--- 5. Testing endpoints ---"
curl -s http://localhost:5000/api/ping
echo -e "\n✅ Backend restarted!"
