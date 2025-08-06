# KIZAZI - Social Media Management Platform for Africa

![KIZAZI Logo](public/logo.jpg)

KIZAZI is a comprehensive social media management platform designed specifically for African markets. Manage your Instagram, Facebook, and X (formerly Twitter) accounts from one powerful dashboard with AI-powered content generation and detailed analytics.

## 🌟 Features

### 📱 Multi-Platform Management
- **Instagram**: Schedule posts with media support
- **Facebook**: Full post scheduling and management
- **X (Twitter)**: Tweet scheduling with character optimization
- **Unified Dashboard**: Manage all platforms from one place

### 🤖 AI-Powered Content Generation
- **Smart Content Creation**: Generate engaging posts using OpenAI GPT
- **Hashtag Generation**: Automatically generate relevant hashtags
- **Content Optimization**: Improve existing content for better engagement
- **Multi-language Support**: Generate content in English, Swahili, French, Arabic, and Portuguese

### 📊 Advanced Analytics
- **Performance Tracking**: Monitor likes, comments, shares, and reach
- **Engagement Analytics**: Track your audience interaction rates
- **Best Time Analysis**: Discover optimal posting times
- **Hashtag Performance**: See which hashtags drive the most engagement
- **Growth Metrics**: Monitor follower growth and reach expansion

### ⏰ Smart Scheduling
- **Post Calendar**: Visual calendar interface for scheduling
- **Automatic Publishing**: Posts are published automatically at scheduled times
- **Bulk Scheduling**: Schedule multiple posts at once
- **Time Zone Support**: Respect your audience's time zones

### 🔒 Authentication & Security
- **JWT Authentication**: Secure user authentication
- **Plan-based Access**: Starter, Pro, and Enterprise plans
- **Rate Limiting**: API protection against abuse
- **Data Encryption**: Secure storage of sensitive information

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 19**: Latest React with concurrent features
- **Tailwind CSS**: Modern styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Context API**: State management for auth and language
- **Responsive Design**: Mobile-first approach

### Backend (Node.js + Express)
- **Express.js**: RESTful API server
- **MongoDB**: Document database with Mongoose ODM
- **JWT Authentication**: Secure token-based auth
- **OpenAI Integration**: AI content generation
- **Social Media APIs**: Direct integration with platforms
- **Automated Scheduler**: Cron-based post scheduling

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **OpenAI API Key** (for AI features)
- **Social Media API Keys** (for publishing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kizazi-africa.git
   cd kizazi-africa
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=KIZAZI
   ```
   
   **Backend (server/.env):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/kizazi
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

3. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

4. **Access the application**
   Open your browser and go to `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/upcoming/week` - Get upcoming posts

### AI Content
- `POST /api/ai/generate-content` - Generate post content
- `POST /api/ai/generate-hashtags` - Generate hashtags
- `POST /api/ai/improve-content` - Improve existing content

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/posts/performance` - Post performance
- `GET /api/analytics/trends` - Engagement trends
- `GET /api/analytics/best-times` - Best posting times

### Social Media
- `POST /api/social/connect/:platform` - Connect social account
- `DELETE /api/social/disconnect/:platform/:id` - Disconnect account
- `POST /api/social/publish/:postId` - Publish post
- `GET /api/social/analytics/:postId` - Get post analytics

## 🌍 Multi-Language Support

KIZAZI supports 5 languages:
- **English** 🇺🇸
- **Kiswahili** 🇰🇪
- **Français** 🇫🇷
- **العربية** 🇸🇦
- **Português** 🇧🇷

## 💳 Pricing Plans

### Starter Plan (Ksh 1,500/month)
- Up to 3 social media accounts
- 15 scheduled posts/month
- Basic analytics
- Email support

### Pro Plan (Ksh 5,000/month)
- Up to 10 social media accounts
- Unlimited scheduled posts
- Advanced analytics
- AI Content Generator
- Priority support

### Enterprise Plan (Contact Us)
- Unlimited accounts
- Custom solutions
- Dedicated support
- Payment Integration
- Custom branding

## 🔧 Development

### Project Structure
```
kizazi-africa/
├── public/                 # Static assets
├── src/                   # Frontend source
│   ├── components/        # React components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── ...
├── server/               # Backend source
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── scheduler/       # Post scheduler
│   └── config/          # Configuration files
└── ...
```

### Key Technologies
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **AI**: OpenAI GPT API
- **Scheduling**: node-cron
- **Social APIs**: Facebook Graph API, Instagram API, X API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT API
- **Meta** for Facebook/Instagram APIs
- **X (Twitter)** for API access
- **African developers** who inspired this project
- **Tailwind CSS** for the amazing styling framework

## 📞 Support

- **Email**: support@kizazi.africa
- **WhatsApp**: +254712345678
- **Website**: https://kizazi.africa

---

**Made with ❤️ for Africa by the KIZAZI Team**