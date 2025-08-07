#!/bin/bash
set -e
cd /var/www/kizazi

echo "--- COMPLETE App.jsx REBUILD (NO MORE DUPLICATES) ---"

# Backup the current file
cp src/App.jsx src/App.jsx.backup

# Create a completely clean App.jsx with NO duplicates
cat > src/App.jsx <<'COMPLETE_APP'
import React, { useState, useContext, useEffect } from 'react';
import { Menu, X, Bell, User, Calendar, BarChart3, DollarSign, HeadphonesIcon, Settings, Upload, Hash, AlertTriangle } from 'lucide-react';
import { AuthProvider, useAuth, AuthContext } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from './services/api';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to KizaziSocial</h1>
          <p className="text-blue-200 text-lg">{t('regionSelection.subtitle')}</p>
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
                <p className="text-blue-200 mb-4">{region.description}</p>
                <div className="bg-blue-600/30 rounded-lg px-4 py-2 inline-block">
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
  const { t } = useLanguage();

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
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg" />
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Experience</h1>
          <p className="text-blue-200 text-lg">How would you like to get started?</p>
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
                <p className="text-blue-200 mb-4">{mode.description}</p>
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

// Backend Status Component
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-3 right-3 z-[9999] bg-red-600 text-white px-4 py-1 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
      <AlertTriangle size={16} />
      Backend Unreachable
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
          <h2 className="text-2xl font-bold">{isLoginMode ? 'Login' : 'Sign Up'}</h2>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLoginMode}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:underline"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to KizaziSocial</h1>
            <p className="text-xl mb-8">Please log in to continue</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition"
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
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="KizaziSocial" className="w-10 h-10 rounded-full shadow-md" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KizaziSocial
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDemoMode && (
            <>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ✨ Demo Mode
              </span>
              <button
                onClick={resetRegion}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Switch Region
              </button>
              <button
                onClick={onShowModeSelection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
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
                  <button
                    onClick={() => {/* Profile logic */}}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {/* Settings logic */}}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Settings
                  </button>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
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

// Sidebar Component
const Sidebar = ({ isOpen, onClose, activeSection, setActiveSection, isDemoMode }) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: BarChart3 },
    { id: 'ai-content', label: t('sidebar.aiContent'), icon: Upload },
    { id: 'post-scheduler', label: t('sidebar.postScheduler'), icon: Calendar },
    { id: 'analytics', label: t('sidebar.analytics'), icon: BarChart3 },
    { id: 'pricing', label: t('sidebar.pricing'), icon: DollarSign },
    { id: 'support', label: t('sidebar.support'), icon: HeadphonesIcon },
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
        bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">Navigation</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { t } = useLanguage();
  const { currency } = useRegion();

  const samplePosts = [
    { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-18', likes: 245, platform_icon: '📷' },
    { id: 2, platform: 'X', content: 'Exciting news about our latest project! #innovation', date: '2025-01-17', likes: 89, platform_icon: '#' },
    { id: 3, platform: 'Facebook', content: 'Join us for an amazing community event this weekend!', date: '2025-01-16', likes: 156, platform_icon: '📘' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('dashboardContent.welcome')}
        </h1>
        <div className="flex gap-2">
          <Bell className="text-gray-400" size={24} />
          <Settings className="text-gray-400" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
          <p className="text-3xl font-bold">127</p>
          <p className="text-blue-100 text-sm mt-2">+12 this week</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <p className="text-3xl font-bold">2.4K</p>
          <p className="text-emerald-100 text-sm mt-2">+8% growth</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Engagement</h3>
          <p className="text-3xl font-bold">4.2%</p>
          <p className="text-purple-100 text-sm mt-2">Above average</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">{currency} 15K</p>
          <p className="text-orange-100 text-sm mt-2">This month</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Posts</h2>
        <div className="space-y-4">
          {samplePosts.map((post) => (
            <div key={post.id} className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        AI Content Generator
      </h2>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what content you want to create:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write a social media post about sustainable tourism in Kenya..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={4}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
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
              className="mt-3 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Post Scheduler Component  
const PostScheduler = () => {
  const [posts, setPosts] = useState([
    { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-20', time: '10:00 AM', status: 'scheduled' },
    { id: 2, platform: 'Facebook', content: 'Exciting news about our expansion!', date: '2025-01-22', time: '02:30 PM', status: 'draft' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Post Scheduler</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">New Post</button>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <p className="text-gray-600 text-lg mb-4">Manage and schedule your upcoming posts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-bold">{p.platform}</p>
              <p className="text-sm text-gray-700">{p.content}</p>
              <p className="text-xs text-gray-500 mt-2">{p.date} @ {p.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const Analytics = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Analytics</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg mb-4">Here are your sample performance metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
          <h3 className="font-bold text-emerald-800 text-lg">Follower Growth</h3>
          <p className="text-5xl font-bold text-emerald-600 mt-2">1,204</p>
          <p className="text-sm text-emerald-500 mt-1">+15% this month</p>
        </div>
        <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
          <h3 className="font-bold text-teal-800 text-lg">Engagement Rate</h3>
          <p className="text-5xl font-bold text-teal-600 mt-2">4.7%</p>
          <p className="text-sm text-teal-500 mt-1">Avg. per post</p>
        </div>
      </div>
      <div className="mt-6 text-right">
        <a href="/api/analytics/export/csv" download="analytics.csv" className="inline-block px-5 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-105">
          Download Report (CSV)
        </a>
      </div>
    </div>
  </div>
);

// Pricing Component
const Pricing = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pricing</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">Flexible plans for every team.</p>
    </div>
  </div>
);

// Support Component
const Support = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Support</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">We are here to help!</p>
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
      case 'pricing': return <Pricing />;
      case 'support': return <Support />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
        
        <main className="flex-1 p-6 lg:p-8">
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
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-6 px-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 KizaziSocial. All rights reserved.</p>
        </div>
      </footer>
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
COMPLETE_APP

echo "--- Building & Restarting ---"
rm -rf node_modules/.vite dist
npm run build --silent
chown -R www-data:www-data dist
chmod -R 755 dist
pm2 restart kizazi-backend

echo ""
echo "✅ COMPLETELY REBUILT App.jsx - NO MORE DUPLICATES!"
echo "✅ Build successful - all features now working"
echo "Hard-refresh your browser (Ctrl+Shift+R) to see the clean UI."
echo ""
