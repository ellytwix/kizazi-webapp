import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import metaRoutes from './routes/meta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__dirname);

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
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini API success');
      
      res.json({ 
        text: generatedText,
        prompt,
        timestamp: new Date().toISOString(),
        source: 'gemini-1.5-flash'
      });
    } else {
      console.error('❌ Unexpected Gemini API response:', data);
      res.status(500).json({ 
        error: 'AI generation failed',
        details: data.error || 'Unexpected response format'
      });
    }

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
  const { email, password } = req.body;
  
  // Check demo account
  if (email === 'eliyatwisa@gmail.com' && password === '12345678') {
    res.json({ 
      message: 'Login successful',
      user: { id: 1, name: 'Elly Twix', email },
      token: 'jwt-token-' + Date.now()
    });
  } else if (email && password) {
    // Allow any valid email/password for demo
    res.json({ 
      message: 'Login successful',
      user: { id: Date.now(), name: 'Demo User', email },
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
