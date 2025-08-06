# KIZAZI Setup Guide

This guide will help you set up KIZAZI Social Media Management Platform on your local machine.

## ✅ What's Been Completed

### 🎨 Frontend Updates
- ✅ **Updated Twitter to X**: All references now use "X (formerly Twitter)" with proper X icon
- ✅ **Added Your Logo**: Your logo from Downloads is now integrated into the sidebar
- ✅ **Made Social Icons Bigger**: Increased icon sizes from 14px to 18-20px
- ✅ **Updated Copyright**: Changed from 2024 to 2025 in footer
- ✅ **Major UI Improvements**: 
  - Modern gradient backgrounds
  - Glass-morphism effects with backdrop blur
  - Enhanced animations and hover effects
  - Better shadows and rounded corners
  - Improved card designs and spacing

### 🔧 Backend Implementation
- ✅ **Complete Backend Setup**: Node.js + Express + MongoDB
- ✅ **Authentication System**: JWT-based auth with user registration/login
- ✅ **Post Management**: Full CRUD operations for social media posts
- ✅ **AI Content Generation**: OpenAI integration for content creation
- ✅ **Analytics System**: Comprehensive performance tracking
- ✅ **Social Media Integration**: Facebook, Instagram, and X API support
- ✅ **Automated Scheduler**: Cron-based post scheduling system
- ✅ **Database Models**: User, Post models with proper relationships
- ✅ **API Routes**: Complete RESTful API endpoints

### 🔗 Frontend-Backend Integration
- ✅ **API Service**: Complete API client with error handling
- ✅ **Authentication Context**: React context for user management
- ✅ **Protected Routes**: Login system with protected dashboard
- ✅ **Real-time Updates**: Connected frontend to backend APIs

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=KIZAZI
```

**Backend (server/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/kizazi
JWT_SECRET=kizazi-super-secret-jwt-key-2025-africa
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI in server/.env
```

### 4. Start the Application
```bash
npm run start:all
```

This will start both:
- **Backend**: http://localhost:5000 (API server)
- **Frontend**: http://localhost:5173 (React app)

## 🏗️ Architecture Overview

### Frontend Stack
- **React 19** with Hooks and Context API
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **Lucide React** for icons

### Backend Stack
- **Node.js + Express** for API server
- **MongoDB + Mongoose** for database
- **JWT** for authentication
- **OpenAI** for AI content generation
- **node-cron** for automated scheduling
- **bcryptjs** for password hashing

### Key Features Implemented

#### 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes and API endpoints
- User profile management

#### 📱 Social Media Management
- Multi-platform post creation (Instagram, Facebook, X)
- Visual post scheduler with calendar
- Automatic post publishing
- Post analytics and performance tracking

#### 🤖 AI Content Generation
- OpenAI GPT integration
- Generate engaging captions
- Hashtag generation
- Content optimization
- Multi-language support

#### 📊 Analytics Dashboard
- Real-time engagement metrics  
- Performance trends over time
- Best posting times analysis
- Hashtag performance tracking
- Export capabilities

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Posts
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### AI Content
- `POST /api/ai/generate-content` - Generate post content
- `POST /api/ai/generate-hashtags` - Generate hashtags

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/trends` - Engagement trends

### Social Media
- `POST /api/social/connect/:platform` - Connect social account
- `POST /api/social/publish/:postId` - Publish post

## 🌍 Multi-Language Support

The app supports 5 languages:
- English 🇺🇸
- Kiswahili 🇰🇪  
- Français 🇫🇷
- العربية 🇸🇦
- Português 🇧🇷

## 💡 Next Steps

### To Complete Full Social Media Integration:
1. **Get API Keys**: Obtain keys from Facebook, Instagram, and X developers
2. **Update Environment**: Add your API keys to server/.env
3. **OpenAI Integration**: Add your OpenAI API key for AI features
4. **MongoDB Setup**: Use local MongoDB or MongoDB Atlas

### Optional Enhancements:
- Deploy to cloud (Vercel + Railway/Heroku)
- Add payment processing (Stripe/M-Pesa)
- Implement real-time notifications
- Add team collaboration features

## 🆘 Troubleshooting

### Common Issues:

1. **Backend won't start**: 
   - Make sure MongoDB is running
   - Check server/.env file exists with correct values

2. **Frontend can't connect to backend**:
   - Verify VITE_API_URL in .env points to http://localhost:5000/api
   - Make sure backend is running on port 5000

3. **AI features not working**:
   - Add your OpenAI API key to server/.env
   - Check you have sufficient OpenAI credits

## 📞 Support

Your KIZAZI platform is now fully functional with:
- ✅ Modern, responsive UI
- ✅ Complete backend system
- ✅ User authentication
- ✅ AI-powered content generation
- ✅ Social media management
- ✅ Analytics and reporting

Happy social media managing! 🚀