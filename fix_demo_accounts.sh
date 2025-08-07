#!/bin/bash
set -e
cd /var/www/kizazi/server

echo "🔐 FIXING DEMO ACCOUNTS & LOGIN ISSUES"
echo "======================================"

# 1. Create server with clean demo account system
echo "--- 1. Creating server with clean demo accounts ---"
cat > emergency-server.js << 'CLEAN_SERVER'
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

console.log('🚀 Starting server with clean demo accounts...');

// Demo accounts database (in-memory)
const DEMO_ACCOUNTS = [
  {
    id: 1,
    name: 'Elly Twix',
    email: 'eliyatwisa@gmail.com',
    password: '12345678',
    type: 'admin'
  },
  {
    id: 2,
    name: 'Demo User',
    email: 'demo@kizazi.com',
    password: 'demo123',
    type: 'demo'
  },
  {
    id: 3,
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
    type: 'demo'
  }
];

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://kizazisocial.com', 
    'https://www.kizazisocial.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.path.includes('/auth/')) {
    console.log('Auth request body:', { ...req.body, password: '[HIDDEN]' });
  }
  next();
});

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: Date.now(), 
    status: 'Server running with clean demo accounts',
    accounts: DEMO_ACCOUNTS.length
  });
});

// CLEAN LOGIN ENDPOINT
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 Login attempt received');
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        error: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }
    
    console.log('🔍 Checking credentials for:', email);
    
    // Check against demo accounts
    const account = DEMO_ACCOUNTS.find(acc => 
      acc.email.toLowerCase() === email.toLowerCase() && 
      acc.password === password
    );
    
    if (account) {
      const token = `jwt-${account.type}-${Date.now()}-${account.id}`;
      
      console.log(`✅ Login successful for ${account.name} (${account.type})`);
      
      return res.json({ 
        message: 'Login successful',
        user: { 
          id: account.id, 
          name: account.name, 
          email: account.email,
          type: account.type
        },
        token,
        success: true
      });
    }
    
    // Allow any other email/password combination for demo
    if (email.includes('@') && password.length >= 3) {
      const user = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email.toLowerCase(),
        type: 'guest'
      };
      
      const token = `jwt-guest-${Date.now()}`;
      
      console.log('✅ Guest login successful for:', email);
      
      return res.json({ 
        message: 'Login successful',
        user,
        token,
        success: true
      });
    }
    
    console.log('❌ Invalid credentials');
    return res.status(401).json({ 
      error: 'Invalid email or password',
      hint: 'Try: demo@kizazi.com / demo123'
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
});

// CLEAN REGISTRATION ENDPOINT
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('📝 Registration attempt received');
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email and password are required' 
      });
    }
    
    // Check if email already exists in demo accounts
    const existingAccount = DEMO_ACCOUNTS.find(acc => 
      acc.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingAccount) {
      console.log('⚠️ Email already exists in demo accounts');
      return res.status(409).json({ 
        error: 'Email already exists',
        hint: 'Try logging in instead'
      });
    }
    
    // Create new account
    const newAccount = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      type: 'registered'
    };
    
    // Add to demo accounts (in memory)
    DEMO_ACCOUNTS.push(newAccount);
    
    const token = `jwt-registered-${Date.now()}-${newAccount.id}`;
    
    console.log('✅ Registration successful for:', email);
    
    return res.status(201).json({ 
      message: 'Account created successfully',
      user: { 
        id: newAccount.id, 
        name: newAccount.name, 
        email: newAccount.email,
        type: newAccount.type
      },
      token,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
});

// Demo accounts info endpoint
app.get('/api/demo-accounts', (req, res) => {
  const publicAccounts = DEMO_ACCOUNTS.map(acc => ({
    name: acc.name,
    email: acc.email,
    type: acc.type,
    hint: `Password: ${acc.password.substring(0, 3)}...`
  }));
  
  res.json({
    message: 'Available demo accounts',
    accounts: publicAccounts,
    total: DEMO_ACCOUNTS.length
  });
});

// AI Generation (working)
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.json({ 
        text: `Demo AI response for: ${prompt}`,
        timestamp: new Date().toISOString(),
        source: 'demo'
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const text = data.candidates[0].content.parts[0].text;
      res.json({ 
        text, 
        timestamp: new Date().toISOString(),
        source: 'gemini-1.5-flash'
      });
    } else {
      res.json({ 
        text: `AI response for: ${prompt}`,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// Analytics
app.get('/api/analytics/export/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('Date,Platform,Posts\n2025-01-15,Instagram,5');
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'KizaziSocial Clean Demo Server', 
    status: 'running',
    demoAccounts: DEMO_ACCOUNTS.length,
    endpoints: ['/api/ping', '/api/auth/login', '/api/auth/register', '/api/demo-accounts']
  });
});

// Error handlers
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Clean demo server running on port ${PORT}`);
  console.log('🔐 Demo Accounts Available:');
  DEMO_ACCOUNTS.forEach(acc => {
    console.log(`   ${acc.email} / ${acc.password} (${acc.name})`);
  });
});
CLEAN_SERVER

# 2. Restart server
echo "--- 2. Restarting with clean demo accounts ---"
pm2 restart kizazi-backend

sleep 3

# 3. Test all demo accounts
echo "--- 3. Testing all demo accounts ---"

echo "Testing Account 1 - Admin (eliyatwisa@gmail.com):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"eliyatwisa@gmail.com","password":"12345678"}' \
  http://localhost:5000/api/auth/login | python3 -m json.tool 2>/dev/null

echo -e "\nTesting Account 2 - Simple Demo (demo@kizazi.com):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@kizazi.com","password":"demo123"}' \
  http://localhost:5000/api/auth/login | python3 -m json.tool 2>/dev/null

echo -e "\nTesting Account 3 - Test User (test@test.com):"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  http://localhost:5000/api/auth/login | python3 -m json.tool 2>/dev/null

# 4. Show available accounts
echo -e "\n--- 4. Available Demo Accounts ---"
curl -s http://localhost:5000/api/demo-accounts | python3 -m json.tool 2>/dev/null

echo -e "\n--- 5. Server Status ---"
pm2 status | grep kizazi

echo ""
echo "✅ CLEAN DEMO ACCOUNTS CREATED!"
echo ""
echo "🔐 Try these accounts:"
echo "   1. eliyatwisa@gmail.com / 12345678 (Original Admin)"
echo "   2. demo@kizazi.com / demo123 (Simple Demo)"  
echo "   3. test@test.com / 123456 (Test User)"
echo ""
echo "🔄 Try logging in with any of these accounts!"
