#!/usr/bin/env node

/**
 * Environment Setup Script for Kizazi Social Media Platform
 * This script creates the .env file with the correct configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://kizazisocial:jK3VFqGCCfwBMiJU@cluster0.bsqw4lj.mongodb.net/kizazi-social?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=kizazi-super-secret-jwt-key-2024

# Server Configuration
PORT=5000
NODE_ENV=production

# Meta API Configuration (Facebook)
META_APP_ID=1254207229501657
META_APP_SECRET=ccc6801ee12d122736e92808d671a660
META_WEBHOOK_VERIFY_TOKEN=kizazi_webhook_verify_token_2024

# Instagram API Configuration
INSTAGRAM_APP_ID=1442447900331004
INSTAGRAM_APP_SECRET=264c69dccfa4feae2ce37514de0c939a

# AI API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# URL Configuration
BACKEND_URL=https://www.kizazisocial.com
FRONTEND_URL=https://www.kizazisocial.com

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Other API Keys (optional)
TWITTER_API_KEY=your_twitter_api_key
LINKEDIN_API_KEY=your_linkedin_api_key
`;

// Create server/.env file
const serverDir = path.join(__dirname, 'server');
const envPath = path.join(serverDir, '.env');

// Ensure server directory exists
if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
}

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Environment file created successfully!');
console.log('📍 Location:', envPath);
console.log('🔧 Configuration includes:');
console.log('   - Meta App ID: 1254207229501657');
console.log('   - Instagram App ID: 1442447900331004');
console.log('   - Database connection');
console.log('   - Server settings');
console.log('');
console.log('⚠️  SECURITY NOTE:');
console.log('   App secrets are included for development purposes.');
console.log('   In production, use environment variables or secure vaults.');
