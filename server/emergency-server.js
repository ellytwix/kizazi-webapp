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

console.log('🚀 Starting quota-aware server...');
console.log('🤖 Gemini API Key present:', !!process.env.GEMINI_API_KEY);

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
  next();
});

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: Date.now(), 
    status: 'Quota-aware server running',
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// ENHANCED: Gemini AI with quota handling and model fallback
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.log('❌ No Gemini API key configured');
      return res.status(500).json({ 
        error: 'Gemini API not configured. Please add GEMINI_API_KEY to environment variables.'
      });
    }

    console.log('🤖 Attempting Gemini API generation with prompt:', prompt.substring(0, 50));

    // List of models to try (from more powerful to lighter)
    const modelsToTry = [
      'gemini-1.5-flash',  // Lighter model, higher quota
      'gemini-pro'         // Fallback to older model
    ];

    let lastError = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`🔄 Trying model: ${model}`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ text: prompt }] 
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,  // Reduced to conserve quota
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success with model: ${model}`);
          
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ Generated text length:', text.length);
            
            return res.json({ 
              text, 
              timestamp: new Date().toISOString(),
              source: model,
              prompt: prompt
            });
          } else {
            throw new Error('Unexpected response structure');
          }
        } else {
          const errorData = await response.text();
          const error = JSON.parse(errorData);
          
          // Check if it's a quota error
          if (response.status === 429 || error.error?.code === 429) {
            console.log(`⚠️ Quota exceeded for ${model}, trying next model...`);
            lastError = error;
            continue; // Try next model
          } else {
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }
        }
        
      } catch (modelError) {
        console.log(`❌ Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }
    
    // If all models failed due to quota, provide a helpful response
    if (lastError && (lastError.error?.code === 429 || lastError.message?.includes('429'))) {
      console.log('❌ All models quota exceeded');
      return res.json({
        text: `⚠️ AI service temporarily at capacity. Here's a helpful response for "${prompt}":

${generateHelpfulFallback(prompt)}

Note: Try again in a few minutes when quota resets.`,
        timestamp: new Date().toISOString(),
        source: 'quota-fallback',
        prompt: prompt,
        warning: 'API quota exceeded, using fallback response'
      });
    }
    
    // Generic error if not quota-related
    throw lastError || new Error('All AI models failed');
    
  } catch (error) {
    console.error('❌ AI generation error:', error);
    res.status(500).json({ 
      error: 'AI generation failed',
      message: error.message,
      details: error.error || error
    });
  }
});

// Helper function to generate contextual fallback responses
function generateHelpfulFallback(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('social media') || lowerPrompt.includes('post')) {
    return "🚀 Here's a great social media post idea: Share authentic moments that connect with your audience. Use engaging visuals, ask questions to boost interaction, and don't forget relevant hashtags! #SocialMediaTips #Engagement";
  }
  
  if (lowerPrompt.includes('coffee')) {
    return "☕ Start your day right! Nothing beats the perfect cup of coffee to fuel your productivity and warm your soul. What's your favorite brewing method? #CoffeeLovers #MorningBoost";
  }
  
  if (lowerPrompt.includes('business') || lowerPrompt.includes('marketing')) {
    return "💼 Success in business comes from understanding your customers' needs and consistently delivering value. Focus on building relationships, not just making sales. #BusinessTips #Marketing";
  }
  
  if (lowerPrompt.includes('travel') || lowerPrompt.includes('tourism')) {
    return "✈️ Discover amazing destinations and create unforgettable memories! Travel opens your mind to new cultures, cuisines, and experiences. Where's your next adventure? #TravelInspiration #Adventure";
  }
  
  // Generic helpful response
  return "Here's some great content for your request! Remember to engage with your audience, use relevant hashtags, and share authentic experiences that resonate with your followers.";
}

// Gemini version info
app.get('/api/gemini/version', (req, res) => {
  res.json({
    models: ['gemini-1.5-flash', 'gemini-pro'],
    version: '1.5',
    provider: 'Google AI',
    features: ['text-generation', 'quota-aware', 'fallback-support'],
    configured: !!process.env.GEMINI_API_KEY,
    quotaHandling: 'automatic-fallback'
  });
});

// Auth endpoints (unchanged)
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 Login attempt received');
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        error: 'Email and password are required'
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
      error: 'Invalid email or password'
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
});

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
        error: 'Email already exists'
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

// Analytics
app.get('/api/analytics/export/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('Date,Platform,Posts\n2025-01-15,Instagram,5\n2025-01-16,Facebook,3');
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'KizaziSocial Quota-Aware Server', 
    status: 'running',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    quotaHandling: 'enabled'
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
  console.log(`🚀 Quota-aware server running on port ${PORT}`);
  console.log('🤖 Gemini API configured:', !!process.env.GEMINI_API_KEY);
  console.log('🔄 Quota handling: Automatic model fallback enabled');
  console.log('🔐 Demo Accounts Available:');
  DEMO_ACCOUNTS.forEach(acc => {
    console.log(`   ${acc.email} / ${acc.password} (${acc.name})`);
  });
});
