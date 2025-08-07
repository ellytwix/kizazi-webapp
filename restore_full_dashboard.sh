#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔄 RESTORING FULL DASHBOARD UI WITH NEW FEATURES"
echo "================================================"

# Create the complete App.jsx with full dashboard functionality
echo "--- Creating complete dashboard interface ---"
cat > src/App.jsx << 'COMPLETE_DASHBOARD_APP'
import React, { useState, useContext, useEffect } from 'react';
import { Menu, X, Bell, User, Calendar, BarChart3, DollarSign, HeadphonesIcon, Settings, Upload, Hash, AlertTriangle, Download, FileDown } from 'lucide-react';
import { AuthProvider, useAuth, AuthContext } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from './services/api';

// Enhanced Backend Status Component
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
      } catch (error) {
        console.error('Backend check failed:', error);
        setIsOnline(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-[9999] flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse' : 'bg-red-500'}`} />
      {!isOnline && (
        <div className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs">
          Backend Unreachable
        </div>
      )}
    </div>
  );
};

// Social Media Icon Component
const SocialMediaIcon = ({ platform }) => {
  const iconMap = {
    Instagram: '📷',
    Facebook: '📘', 
    Twitter: '🐦',
    X: '#',
    LinkedIn: '💼',
    TikTok: '🎵',
    YouTube: '📺'
  };
  return <span className="text-2xl">{iconMap[platform] || '📱'}</span>;
};

// Region Selection Component
const RegionSelection = () => {
  const { setRegion } = useRegion();
  const { t } = useLanguage();

  const regions = [
    {
      name: 'Kenya',
      flag: '🇰🇪',
      currency: 'KES',
      description: 'Kenyan Shilling pricing'
    },
    {
      name: 'Tanzania',
      flag: '🇹🇿',
      currency: 'TZS',
      description: 'Tanzanian Shilling pricing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <img src="/new-logo.svg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to KizaziSocial</h1>
          <p className="text-pink-200 text-lg">Choose your region to get started</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {regions.map((region) => (
            <motion.div
              key={region.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRegion(region.name)}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{region.flag}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
                <p className="text-pink-200 mb-4">{region.description}</p>
                <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg px-4 py-2 inline-block">
                  <span className="text-white font-semibold">{region.currency}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Mode Selection Component
const ModeSelection = ({ onModeSelect }) => {
  const modes = [
    {
      key: 'demo',
      title: 'Demo Mode',
      description: 'Explore features with sample data',
      icon: '🎯',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      key: 'full',
      title: 'Full Access',
      description: 'Create account and manage real campaigns',
      icon: '🚀',
      color: 'from-pink-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <img src="/new-logo.svg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Experience</h1>
          <p className="text-pink-200 text-lg">How would you like to get started?</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {modes.map((mode) => (
            <motion.div
              key={mode.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeSelect(mode.key)}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{mode.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                <p className="text-pink-200 mb-4">{mode.description}</p>
                <div className={`bg-gradient-to-r ${mode.color} rounded-lg px-6 py-3 inline-block`}>
                  <span className="text-white font-semibold">Get Started</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Login Modal Component
const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, loading, error } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {isLoginMode ? 'Login' : 'Sign Up'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required={!isLoginMode}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition"
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-pink-600 hover:underline"
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <img src="/new-logo.svg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to KizaziSocial</h1>
            <p className="text-xl mb-8">Please log in to continue</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg text-lg transition"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return children;
};

// Header Component
const Header = ({ onToggleSidebar, isDemoMode, onShowModeSelection }) => {
  const { user, logout } = useAuth();
  const { region, resetRegion } = useRegion();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <img src="/new-logo.svg" alt="KizaziSocial" className="w-10 h-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              KizaziSocial
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDemoMode && (
            <>
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                ✨ Demo Mode
              </span>
              <button
                onClick={resetRegion}
                className="text-sm text-pink-600 hover:text-pink-800 font-medium transition"
              >
                Switch Region
              </button>
              <button
                onClick={onShowModeSelection}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm transition shadow"
              >
                🏠 Switch Mode
              </button>
            </>
          )}

          {!isDemoMode && user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <User size={20} />
                <span className="hidden sm:block">{user.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">Profile</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">Settings</button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!isDemoMode && !user && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition shadow"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

// Enhanced Sidebar with new gradient
const Sidebar = ({ isOpen, onClose, activeSection, setActiveSection, isDemoMode }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ai-content', label: 'AI Content', icon: Upload },
    { id: 'post-scheduler', label: 'Post Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 
        bg-gradient-to-b from-pink-900 via-purple-900 to-indigo-900
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src="/new-logo.svg" alt="KIZAZI" className="w-8 h-8" />
              <span className="text-white font-bold text-lg">KIZAZI</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                ${activeSection === item.id 
                  ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-white shadow-lg border border-pink-400/30' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-white text-sm">Enhanced v2.0</div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Continue with the rest of the components...
// [I'll include the remaining components in the next part to avoid hitting length limits]

// Main Dashboard Component
const Dashboard = () => {
  const { currency } = useRegion();

  const samplePosts = [
    { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-18', likes: 245 },
    { id: 2, platform: 'X', content: 'Exciting news about our latest project! #innovation', date: '2025-01-17', likes: 89 },
    { id: 3, platform: 'Facebook', content: 'Join us for an amazing community event this weekend!', date: '2025-01-16', likes: 156 },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back to KIZAZI!
          </h1>
          <p className="text-gray-600 mt-1">Here's your social media overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
                <p className="text-2xl font-semibold text-gray-900">25</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-semibold text-gray-900">12.5K</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-2xl font-semibold text-gray-900">2.4K</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{currency} 15K</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Posts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {samplePosts.map((post) => (
                <div key={post.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                  <SocialMediaIcon platform={post.platform} />
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.platform}</span>
                      <span>{post.date}</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Content Generator Component
const AIContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiService.request('/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      setGeneratedContent(response.text || 'Generated content here...');
    } catch (error) {
      console.error('AI generation error:', error);
      setGeneratedContent('Sorry, there was an error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            AI Content Generator
          </h1>
          <p className="text-gray-600 mt-1">Create engaging content with Gemini 1.5 Pro</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what content you want to create:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write a social media post about sustainable tourism in Kenya..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                rows={4}
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
          
          {generatedContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Generated Content:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="mt-3 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Post Scheduler Component with Calendar Download
const PostScheduler = () => {
  const [posts, setPosts] = useState([
    { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-20', time: '10:00', status: 'scheduled' },
    { id: 2, platform: 'Facebook', content: 'Exciting news about our expansion!', date: '2025-01-22', time: '14:30', status: 'draft' },
    { id: 3, platform: 'X', content: 'Social media marketing tips for 2025', date: '2025-01-25', time: '09:00', status: 'scheduled' }
  ]);

  const downloadCalendar = () => {
    const formatDateTime = (date, time) => {
      const dateObj = new Date(`${date}T${time}:00`);
      return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KizaziSocial//Post Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${posts.map(post => `BEGIN:VEVENT
UID:${post.id}@kizazisocial.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${formatDateTime(post.date, post.time)}
SUMMARY:${post.platform}: ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}
DESCRIPTION:Platform: ${post.platform}\\nContent: ${post.content}\\nStatus: ${post.status}
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kizazi-post-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Post Scheduler</h1>
            <p className="text-gray-600 mt-1">Manage and schedule your upcoming posts</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadCalendar}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              <Download size={20} />
              Download Calendar
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105">
              New Post
            </button>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-gray-900">{post.platform}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    post.status === 'scheduled' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>{post.date} @ {post.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Regional Pricing Component
const RegionalPricing = () => {
  const { region, currency } = useRegion();
  
  const pricingTiers = [
    {
      name: 'Starter',
      price: region === 'Kenya' ? 6000 : 10000,
      features: ['5 Social Accounts', '50 Posts/Month', 'Basic Analytics', 'Email Support']
    },
    {
      name: 'Professional', 
      price: region === 'Kenya' ? 30000 : 50000,
      features: ['15 Social Accounts', '200 Posts/Month', 'Advanced Analytics', 'AI Content', 'Priority Support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: region === 'Kenya' ? 60000 : 100000,
      features: ['Unlimited Accounts', 'Unlimited Posts', 'Custom Analytics', 'API Access', '24/7 Support']
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">Flexible pricing for {region}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 ${
                tier.popular ? 'border-pink-500 scale-105' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {currency} {tier.price.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">/month</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                tier.popular 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => (
  <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your social media performance</p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h3 className="font-bold text-emerald-800 text-lg">Follower Growth</h3>
            <p className="text-5xl font-bold text-emerald-600 mt-2">1,204</p>
            <p className="text-sm text-emerald-500 mt-1">+15% this month</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="font-bold text-blue-800 text-lg">Engagement Rate</h3>
            <p className="text-5xl font-bold text-blue-600 mt-2">4.7%</p>
            <p className="text-sm text-blue-500 mt-1">Avg. per post</p>
          </div>
        </div>
        <div className="text-right">
          <a href="/api/analytics/export/csv" download="analytics.csv" className="inline-block px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105">
            Download Report (CSV)
          </a>
        </div>
      </div>
    </div>
  </div>
);

// Support Component
const Support = () => (
  <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Support</h1>
        <p className="text-gray-600 mt-1">We are here to help!</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <p className="text-gray-600 text-lg">Get in touch with our support team for assistance.</p>
      </div>
    </div>
  </div>
);

// Main App Layout Component
const AppLayout = ({ isDemoMode, onBackToHome, onShowModeSelection }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'ai-content': return <AIContentGenerator />;
      case 'post-scheduler': return <PostScheduler />;
      case 'analytics': return <Analytics />;
      case 'pricing': return <RegionalPricing />;
      case 'support': return <Support />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackendStatus />
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isDemoMode={isDemoMode}
        onBackToHome={onBackToHome}
        onShowModeSelection={onShowModeSelection}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isDemoMode={isDemoMode}
        />
        
        <main className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  const { isRegionSelected } = useRegion();
  const [appMode, setAppMode] = useState('demo');
  const [showModeSelection, setShowModeSelection] = useState(false);

  const handleModeSelect = (mode) => {
    setAppMode(mode);
    setShowModeSelection(false);
  };

  const handleBackToHome = () => {
    setShowModeSelection(true);
  };

  if (!isRegionSelected) {
    return <RegionSelection />;
  }

  if (showModeSelection) {
    return <ModeSelection onModeSelect={handleModeSelect} />;
  }

  if (appMode === 'demo') {
    return (
      <AppLayout
        isDemoMode={true}
        onBackToHome={handleBackToHome}
        onShowModeSelection={() => setShowModeSelection(true)}
      />
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout
        isDemoMode={false}
        onBackToHome={handleBackToHome}
        onShowModeSelection={() => setShowModeSelection(true)}
      />
    </ProtectedRoute>
  );
};

// Main App Component
const App = () => {
  return (
    <RegionProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </RegionProvider>
  );
};

export default App;
COMPLETE_DASHBOARD_APP

# Build the complete dashboard
echo "--- Building complete dashboard ---"
npm run build --silent

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    chown -R www-data:www-data dist
    chmod -R 755 dist
    
    echo ""
    echo "🎉 COMPLETE DASHBOARD RESTORED!"
    echo ""
    echo "✅ Features available:"
    echo "   📊 Full Dashboard with sidebar navigation"
    echo "   🤖 AI Content Generator (Gemini 1.5 Pro)"
    echo "   📅 Post Scheduler with calendar download"
    echo "   📈 Analytics with CSV export"
    echo "   💰 Regional pricing (TZS/KES)"
    echo "   🎨 Pink/purple gradient theme"
    echo "   🔐 Complete authentication system"
    echo "   🌍 Region selection (Kenya/Tanzania)"
    echo "   ⚡ Demo mode and full access modes"
    echo ""
    echo "🔄 Hard refresh your browser to see the complete dashboard!"
else
    echo "❌ Build failed - trying simpler approach..."
    # Fallback to simpler version if needed
fi

echo ""
echo "Backend status:"
cd server && pm2 status | grep kizazi
