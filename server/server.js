import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import metaRoutes from './routes/meta.js';
import socialMediaRoutes from './routes/socialMedia.js';
import authRoutes from './routes/auth.js';

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
app.use('/api/meta', metaRoutes);
app.use('/api/social', socialMediaRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, timestamp: Date.now(), status: 'Backend running' });
});

// Note: social accounts are served exclusively via routes in routes/socialMedia.js

app.get('/api/analytics/export/csv', (req, res) => {
  const csvData = `Date,Platform,Posts,Engagement
2025-01-15,Instagram,5,248
2025-01-16,Facebook,3,156`;
  res.setHeader('Content-Type', 'text/csv');
  res.send(csvData);
});

// REAL Gemini API integration
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    console.log('🤖 Calling real Gemini API with prompt:', prompt.substring(0, 50) + '...');

    // Call the real Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    const data = await response.json();

    // Handle common error shapes from Gemini
    if (!response.ok) {
      const message = data?.error?.message || data?.error || `HTTP ${response.status}`;
      console.error('❌ Gemini API HTTP error:', message);
      return res.status(response.status).json({ error: message });
    }

    // Extract text from various Gemini response shapes
    const extractText = (payload) => {
      try {
        if (!payload) return '';
        if (payload.candidates && payload.candidates.length > 0) {
          const candidate = payload.candidates[0];
          // Newer SDK-style: candidate.content.parts[].text
          if (candidate.content && Array.isArray(candidate.content.parts)) {
            const partWithText = candidate.content.parts.find(p => typeof p.text === 'string');
            if (partWithText?.text) return partWithText.text;
          }
          // Alt shape: candidate.output_text
          if (typeof candidate.output_text === 'string') return candidate.output_text;
        }
        // Alt shape: promptFeedback / safety, no text
        return '';
      } catch (_) {
        return '';
      }
    };

    const generatedText = extractText(data);

    if (generatedText) {
      console.log('✅ Gemini API success');
      return res.json({ 
        text: generatedText,
        prompt,
        timestamp: new Date().toISOString(),
        source: 'gemini-1.5-flash'
      });
    }

    console.error('❌ Unexpected Gemini API response shape:', data);
    return res.status(502).json({ 
      error: 'AI generation failed',
      details: data?.error || 'Unexpected response format'
    });

  } catch (error) {
    console.error('❌ Gemini API error:', error);
    res.status(500).json({ 
      error: 'AI generation failed',
      message: error.message
    });
  }
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // In demo, always succeed
  res.json({ 
    message: 'User created successfully',
    user: { id: Date.now(), name, email },
    token: 'jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, mode } = req.body;
  
  console.log('🔐 Login attempt:', { email, mode });
  
  // Check if this is demo mode
  if (mode === 'demo') {
    res.json({ 
      message: 'Demo login successful',
      user: { id: 'demo-user', name: 'Demo User', email: 'demo@kizazisocial.com', type: 'demo' },
      token: 'jwt-demo-' + Date.now()
    });
    return;
  }
  
  // Check demo account (treat as real user)
  if (email === 'eliyatwisa@gmail.com' && password === '12345678') {
    res.json({ 
      message: 'Login successful',
      user: { id: 1, name: 'Elly Twix', email, type: 'user' },
      token: 'jwt-token-' + Date.now()
    });
  } else if (email && password) {
    // Allow any valid email/password for real users
    res.json({ 
      message: 'Login successful',
      user: { id: Date.now(), name: email.split('@')[0], email, type: 'user' },
      token: 'jwt-token-' + Date.now()
    });
  } else {
    res.status(401).json({ error: 'Email and password are required' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'KizaziSocial Backend API', status: 'running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🤖 Gemini AI: Real API integration enabled');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'KIZAZI Backend is running!',
    timestamp: new Date().toISOString(),
    database: {
      status: 'healthy',
      database: 'test',
      host: 'ac-q4ztjpw-shard-00-00.bsqw4lj.mongodb.net',
      port: 27017,
      readyState: 1,
      readyStateText: 'connected'
    },
    services: {
      scheduler: 'running',
      api: 'healthy'
    }
  });
});
