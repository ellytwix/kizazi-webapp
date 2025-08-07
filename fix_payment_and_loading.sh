#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔧 FIXING PAYMENT IMAGES & REGION LOADING"
echo "========================================"

# 1. Create proper payment method images as SVGs
echo "--- 1. Creating payment method images ---"
mkdir -p public/payment-icons

# Create M-Pesa icon
cat > public/payment-icons/mpesa.svg << 'MPESA_SVG'
<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="40" rx="6" fill="#00A651"/>
  <text x="30" y="15" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="8" font-weight="bold">M-PESA</text>
  <circle cx="30" cy="26" r="6" fill="white"/>
  <text x="30" y="30" text-anchor="middle" fill="#00A651" font-family="Arial, sans-serif" font-size="8" font-weight="bold">M</text>
</svg>
MPESA_SVG

# Create Airtel Money icon
cat > public/payment-icons/airtel.svg << 'AIRTEL_SVG'
<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="40" rx="6" fill="#FF0000"/>
  <text x="30" y="15" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="7" font-weight="bold">AIRTEL</text>
  <text x="30" y="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="6">MONEY</text>
</svg>
AIRTEL_SVG

# Create Miix by Yas icon
cat > public/payment-icons/miix.svg << 'MIIX_SVG'
<svg width="60" height="40" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="40" rx="6" fill="#FFD700"/>
  <text x="30" y="18" text-anchor="middle" fill="#000" font-family="Arial, sans-serif" font-size="8" font-weight="bold">MIIX</text>
  <text x="30" y="30" text-anchor="middle" fill="#000" font-family="Arial, sans-serif" font-size="6">by YAS</text>
</svg>
MIIX_SVG

# 2. Fix the App.jsx with corrected region handling and payment images
echo "--- 2. Fixing App.jsx with proper region handling and payment images ---"
cat > src/App.jsx << 'FIXED_APP_JSX'
import React, { useState, useContext, useEffect } from 'react';
import { Menu, X, Bell, User, Calendar, BarChart3, DollarSign, HeadphonesIcon, Settings, Upload, Hash, AlertTriangle, Download, FileDown } from 'lucide-react';
import { AuthProvider, useAuth, AuthContext } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from './services/api';

// Backend Status Component
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
        console.log('✅ Backend ping successful');
      } catch (error) {
        console.error('❌ Backend check failed:', error);
        setIsOnline(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full shadow-lg ${
        isOnline 
          ? 'bg-green-500 animate-pulse' 
          : 'bg-red-500'
      }`} />
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

// FIXED: Region Selection Component
const RegionSelection = () => {
  const { setRegion } = useRegion();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleRegionSelect = async (regionName) => {
    console.log('🌍 Region selected:', regionName);
    setSelectedRegion(regionName);
    setIsProcessing(true);
    
    // Add visual feedback delay, then proceed
    setTimeout(() => {
      console.log('🌍 Setting region in context:', regionName);
      setRegion(regionName);
      setIsProcessing(false);
    }, 800);
  };

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
        
        {isProcessing ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Setting up your region...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {regions.map((region) => (
              <motion.button
                key={region.name}
                onClick={() => handleRegionSelect(region.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 w-full text-center ${
                  selectedRegion === region.name ? 'bg-white/30 border-white/40' : ''
                }`}
                disabled={selectedRegion !== null}
              >
                <div className="text-6xl mb-4">{region.flag}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
                <p className="text-pink-200 mb-4">{region.description}</p>
                <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg px-4 py-2 inline-block">
                  <span className="text-white font-semibold">{region.currency}</span>
                </div>
                {selectedRegion === region.name && (
                  <div className="mt-4 text-white text-sm">
                    ✓ Selected! Processing...
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
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
            <motion.button
              key={mode.key}
              onClick={() => onModeSelect(mode.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 w-full text-center"
            >
              <div className="text-6xl mb-4">{mode.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-pink-200 mb-4">{mode.description}</p>
              <div className={`bg-gradient-to-r ${mode.color} rounded-lg px-6 py-3 inline-block`}>
                <span className="text-white font-semibold">Get Started</span>
              </div>
            </motion.button>
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

// Enhanced Sidebar
const Sidebar = ({ isOpen, onClose, activeSection, setActiveSection, isDemoMode }) => {
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

// Dashboard Component with zero initial data
const Dashboard = () => {
  const { currency } = useRegion();
  const { user } = useAuth();

  const initialStats = {
    scheduledPosts: 0,
    totalReach: 0,
    followers: 0,
    revenue: 0
  };

  const samplePosts = [];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'User'}!
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
                <p className="text-2xl font-semibold text-gray-900">{initialStats.scheduledPosts}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{initialStats.totalReach}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{initialStats.followers}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{currency} {initialStats.revenue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Posts</h2>
          </div>
          <div className="p-6">
            {samplePosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Start creating content to see your posts here</p>
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition">
                  Create Your First Post
                </button>
              </div>
            ) : (
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
            )}
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
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    setGeneratedContent('');
    
    try {
      console.log('🤖 Starting AI generation with prompt:', prompt);
      
      const response = await apiService.request('/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      console.log('✅ AI generation response received:', response);
      
      if (response.text) {
        setGeneratedContent(response.text);
        setError('');
      } else if (response.error) {
        throw new Error(response.error);
      } else {
        throw new Error('No content generated');
      }
      
    } catch (error) {
      console.error('❌ AI generation error:', error);
      setError(`AI generation failed: ${error.message}`);
      setGeneratedContent('');
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
          <p className="text-gray-600 mt-1">Create engaging content with Gemini AI</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what content you want to create:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Write a social media post about sustainable tourism in Kenya..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                rows={4}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating with AI...
                </span>
              ) : (
                'Generate Content'
              )}
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

// Post Scheduler Component
const PostScheduler = () => {
  const [posts, setPosts] = useState([]);

  const downloadCalendar = () => {
    if (posts.length === 0) {
      alert('No posts scheduled yet. Create some posts first!');
      return;
    }

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
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No scheduled posts</h3>
              <p className="text-gray-600 mb-6">Schedule your first post to get started</p>
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition">
                Schedule Your First Post
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

// ENHANCED: Regional Pricing Component with Proper Payment Method Images
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

  // Mobile Money Payment Methods by Region with proper images
  const paymentMethods = {
    Kenya: [
      { 
        name: 'M-Pesa', 
        image: '/payment-icons/mpesa.svg', 
        description: 'Safaricom M-Pesa',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      { 
        name: 'Airtel Money', 
        image: '/payment-icons/airtel.svg', 
        description: 'Airtel Kenya',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    ],
    Tanzania: [
      { 
        name: 'M-Pesa', 
        image: '/payment-icons/mpesa.svg', 
        description: 'Vodacom M-Pesa',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      { 
        name: 'Airtel Money', 
        image: '/payment-icons/airtel.svg', 
        description: 'Airtel Tanzania',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      { 
        name: 'Miix by Yas', 
        image: '/payment-icons/miix.svg', 
        description: 'Yas Mobile Money',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    ]
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">Flexible pricing for {region}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
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

        {/* FIXED: Mobile Money Payment Methods with Images */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            Payment Methods Available in {region}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods[region]?.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${method.bgColor} rounded-xl p-6 shadow-lg border-2 ${method.borderColor} hover:shadow-xl transition-all hover:scale-105`}
              >
                <div className="text-center">
                  <img 
                    src={method.image} 
                    alt={method.name}
                    className="w-16 h-12 mx-auto mb-3 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-4xl mb-3 hidden">💳</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{method.name}</h4>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Secure payments powered by trusted mobile money providers</p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Secure & Encrypted
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Instant Confirmation
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                24/7 Support
              </span>
            </div>
          </div>
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
            <p className="text-5xl font-bold text-emerald-600 mt-2">0</p>
            <p className="text-sm text-emerald-500 mt-1">Start growing your audience</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="font-bold text-blue-800 text-lg">Engagement Rate</h3>
            <p className="text-5xl font-bold text-blue-600 mt-2">0%</p>
            <p className="text-sm text-blue-500 mt-1">Create engaging content</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No analytics data yet</h3>
          <p className="text-gray-600 mb-6">Start posting content to see analytics here</p>
          <a href="/api/analytics/export/csv" download="analytics.csv" className="inline-block px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-transform transform hover:scale-105">
            Download Sample Report
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

// FIXED: App Router Component with better region handling
const AppRouter = () => {
  const { isRegionSelected } = useRegion();
  const [appMode, setAppMode] = useState('demo');
  const [showModeSelection, setShowModeSelection] = useState(false);

  const handleModeSelect = (mode) => {
    console.log('🎯 Mode selected:', mode);
    setAppMode(mode);
    setShowModeSelection(false);
  };

  const handleBackToHome = () => {
    setShowModeSelection(true);
  };

  console.log('🌍 AppRouter - isRegionSelected:', isRegionSelected, 'showModeSelection:', showModeSelection, 'appMode:', appMode);

  if (!isRegionSelected) {
    return <RegionSelection />;
  }

  if (showModeSelection || appMode === null) {
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
FIXED_APP_JSX

# 3. Build and deploy
echo "--- 3. Building updated app ---"
npm run build --silent

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    chown -R www-data:www-data dist public
    chmod -R 755 dist public
    
    echo ""
    echo "🎉 BOTH ISSUES FIXED!"
    echo ""
    echo "✅ Fixed Issues:"
    echo "   🌍 Region Selection: Now properly proceeds after selection"
    echo "   💳 Payment Method Images: Added proper SVG icons for all providers"
    echo ""
    echo "📱 Payment Methods Now Show:"
    echo "   - M-Pesa: Green card with logo"
    echo "   - Airtel Money: Red card with logo"
    echo "   - Miix by Yas: Yellow card with logo (Tanzania only)"
    echo ""
    echo "🔄 Hard refresh your browser to see the changes!"
else
    echo "❌ Build failed"
fi

echo ""
echo "--- 4. Testing payment method images ---"
ls -la public/payment-icons/
echo ""
echo "--- 5. Final status ---"
echo "✅ Region selection should work smoothly"
echo "✅ Payment method cards should display with proper images"
echo "✅ Loading states should progress correctly"

