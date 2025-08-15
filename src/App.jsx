import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Calendar, BarChart3, DollarSign, HeadphonesIcon, Settings, Upload, Hash, AlertTriangle, Download, FileDown, Globe } from 'lucide-react';
import { AuthProvider, useAuth, AuthContext } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from './services/api';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DataDeletion from './components/DataDeletion';
import SocialMediaConnect from './components/SocialMediaConnect';
import PostCreator from './components/PostCreator';
import Analytics from './components/Analytics';
import OAuthCallback from './components/OAuthCallback';

// Backend Status Component
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
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

// Language Toggle Component
const LanguageToggle = () => {
  const { language, languages, setLanguage, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Globe size={20} />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <span className="hidden sm:block text-sm">{currentLanguage?.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3 ${
                language === code ? 'bg-pink-50 text-pink-600' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
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
  const { setRegion, isProcessing } = useRegion();
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = [
    {
      name: 'Kenya',
      flag: '🇰🇪',
      currency: 'KES',
      description: t('kenyanShilling')
    },
    {
      name: 'Tanzania',
      flag: '🇹🇿',
      currency: 'TZS',
      description: t('tanzanianShilling')
    }
  ];

  const handleRegionSelect = (regionName) => {
    console.log('🌍 Region selected:', regionName);
    setSelectedRegion(regionName);
    setRegion(regionName);
  };

  if (isProcessing) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-pink-200 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('settingUpRegion')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <img src="/kizazi-logo.png" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">{t('welcome')}</h1>
          <p className="text-pink-200 text-lg">{t('selectRegion')}</p>
        </div>
        
        {/* Language toggle in region selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
            <LanguageToggle />
          </div>
        </div>
        
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
              <h3 className="text-2xl font-bold text-white mb-2">{t(region.name.toLowerCase())}</h3>
              <p className="text-pink-200 mb-4">{region.description}</p>
              <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg px-4 py-2 inline-block">
                <span className="text-white font-semibold">{region.currency}</span>
              </div>
              {selectedRegion === region.name && (
                <div className="mt-4 text-white text-sm">
                  ✓ {t('selected')}
                </div>
              )}
            </motion.button>
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
      title: t('demoMode'),
      description: t('exploreFeatures'),
      icon: '🎯',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      key: 'full',
      title: t('fullAccess'),
      description: t('createAccount'),
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
          <img src="/kizazi-logo.png" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">{t('chooseExperience')}</h1>
          <p className="text-pink-200 text-lg">How would you like to get started?</p>
      </div>
        
        {/* Language toggle in mode selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
            <LanguageToggle />
          </div>
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
                <span className="text-white font-semibold">{t('getStarted')}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// NEW: Post Creation Modal
const PostCreationModal = ({ isOpen, onClose, onPostCreated }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    content: '',
    platform: 'Instagram',
    scheduleDate: '',
    scheduleTime: '',
    publishType: 'now'
  });
  const [loading, setLoading] = useState(false);

  const platforms = ['Instagram', 'Facebook', 'X', 'LinkedIn', 'TikTok'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate post creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: Date.now(),
        content: formData.content,
        platform: formData.platform,
        date: formData.publishType === 'schedule' ? formData.scheduleDate : new Date().toISOString().split('T')[0],
        time: formData.publishType === 'schedule' ? formData.scheduleTime : new Date().toTimeString().split(' ')[0].slice(0,5),
        status: formData.publishType === 'schedule' ? 'scheduled' : 'published'
      };
      
      onPostCreated(newPost);
      onClose();
      
      // Reset form
      setFormData({
        content: '',
        platform: 'Instagram',
        scheduleDate: '',
        scheduleTime: '',
        publishType: 'now'
      });
      
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {t('createPost')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('postContent')}
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows={4}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectPlatform')}
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publish Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="publishType"
                  value="now"
                  checked={formData.publishType === 'now'}
                  onChange={(e) => setFormData({...formData, publishType: e.target.value})}
                  className="mr-2"
                />
                {t('publishNow')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="publishType"
                  value="schedule"
                  checked={formData.publishType === 'schedule'}
                  onChange={(e) => setFormData({...formData, publishType: e.target.value})}
                  className="mr-2"
                />
                {t('scheduleLater')}
              </label>
            </div>
          </div>
          
          {formData.publishType === 'schedule' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required={formData.publishType === 'schedule'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required={formData.publishType === 'schedule'}
                />
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition"
          >
            {loading ? t('processing') : (formData.publishType === 'schedule' ? 'Schedule Post' : 'Publish Now')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Login Modal Component
const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, loading, error } = useAuth();
  const { t } = useLanguage();
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
            {isLoginMode ? t('login') : t('signUp')}
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
              placeholder={t('fullName')}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required={!isLoginMode}
            />
          )}
          <input
            type="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="password"
            placeholder={t('password')}
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
            {loading ? t('processing') : (isLoginMode ? t('login') : t('signUp'))}
                </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isLoginMode ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-pink-600 hover:underline ml-1"
                >
            {isLoginMode ? t('signUp') : t('login')}
                </button>
        </p>
              </motion.div>
        </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <img src="/kizazi-logo.png" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
            <p className="text-xl mb-8">Please log in to continue</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg text-lg transition"
            >
              {t('login')} / {t('signUp')}
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
  const { resetRegion } = useRegion();
  const { t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="relative z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={20} />
            </button>
          <div className="flex items-center gap-3">
            <img src="/kizazi-logo.png" alt="KizaziSocial" className="w-10 h-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              KizaziSocial
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          
          {isDemoMode && (
            <>
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                ✨ {t('demoMode')}
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
              {t('login')}
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
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'connect-accounts', label: 'Connect Accounts', icon: Settings, isNew: true },
    { id: 'create-post', label: 'Create Post', icon: Upload, isNew: true },
    { id: 'ai-content', label: t('aiContent'), icon: Upload },
    { id: 'post-scheduler', label: t('postScheduler'), icon: Calendar },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    { id: 'pricing', label: t('pricing'), icon: DollarSign },
    { id: 'support', label: t('support'), icon: HeadphonesIcon },
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
              <img src="/kizazi-logo.png" alt="KIZAZI" className="w-8 h-8" />
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
                if (item.id === 'connect-accounts' || item.id === 'create-post') {
                  // Navigate to new routes
                  window.location.href = `/${item.id}`;
                } else {
                  setActiveSection(item.id);
                }
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
              {item.isNew && (
                <span className="ml-auto px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-white text-sm">Enhanced v2.0</div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <a 
                href="/privacy" 
                className="text-white/80 hover:text-white text-xs underline transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
          </div>
      </div>
              </div>
      </aside>
    </>
  );
};

// ENHANCED: Dashboard Component with Demo Data for Demo Users
const Dashboard = () => {
  const { currency } = useRegion();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Demo data for demo accounts, empty for real users
  const isDemoUser = !user || user.type === 'demo' || user.type === 'admin';
  
  const stats = isDemoUser ? {
    scheduledPosts: 12,
    totalReach: 45780,
    followers: 1250,
    revenue: 25000
  } : {
    scheduledPosts: 0,
    totalReach: 0,
    followers: 0,
    revenue: 0
  };

  const samplePosts = isDemoUser ? [
    {
      id: 1,
      platform: 'Instagram',
      content: 'Beautiful sunset in Tanzania! 🌅 #TanzaniaVibes #Safari',
      date: '2025-01-15',
      likes: 248
    },
    {
      id: 2,
      platform: 'Facebook',
      content: 'Exciting news about our expansion into Kenya! 🇰🇪',
      date: '2025-01-14',
      likes: 156
    },
    {
      id: 3,
      platform: 'X',
      content: 'Technology is transforming East Africa one startup at a time! #TechAfrica',
      date: '2025-01-13',
      likes: 89
    }
  ] : [];

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {t('welcomeBack')}, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">{t('socialMediaOverview')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('scheduledPosts')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.scheduledPosts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
      </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalReach')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalReach.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <User className="h-6 w-6 text-white" />
                      </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('followers')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.followers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('revenue')}</p>
                <p className="text-2xl font-semibold text-gray-900">{currency} {stats.revenue.toLocaleString()}</p>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('noPosts')}</h3>
                <p className="text-gray-600 mb-6">{t('startCreating')}</p>
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition">
                  {t('createFirstPost')}
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
  const { t } = useLanguage();
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
            {t('aiContentGenerator')}
          </h1>
          <p className="text-gray-600 mt-1">{t('createEngaging')}</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('describeContent')}
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
                  {t('generatingAI')}
                </span>
              ) : (
                t('generateContent')
              )}
          </button>
        </div>

        {generatedContent && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{t('generatedContent')}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
                <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="mt-3 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
                >
                {t('copyToClipboard')}
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ENHANCED: Post Scheduler Component with Functional Post Creation
const PostScheduler = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);

  // Demo data for demo users
  useEffect(() => {
    const isDemoUser = !user || user.type === 'demo' || user.type === 'admin';
    
    if (isDemoUser) {
      setPosts([
        { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-20', time: '10:00', status: 'scheduled' },
        { id: 2, platform: 'Facebook', content: 'Exciting news about our expansion!', date: '2025-01-22', time: '14:30', status: 'draft' },
        { id: 3, platform: 'X', content: 'Technology transforming East Africa! #TechAfrica', date: '2025-01-25', time: '09:15', status: 'scheduled' }
      ]);
    }
  }, [user]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t('postScheduler')}</h1>
            <p className="text-gray-600 mt-1">{t('manageSchedule')}</p>
          </div>
          <div className="flex gap-3">
                <button
              onClick={downloadCalendar}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              <Download size={20} />
              {t('downloadCalendar')}
            </button>
            <button 
              onClick={() => setShowPostModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              {t('newPost')}
                </button>
              </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('noScheduled')}</h3>
              <p className="text-gray-600 mb-6">{t('scheduleFirst')}</p>
              <button 
                onClick={() => setShowPostModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                {t('scheduleFirstPost')}
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
        
        <PostCreationModal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          onPostCreated={handlePostCreated}
        />
        </div>
      </div>
  );
};

// Regional Pricing Component (unchanged)
const RegionalPricing = () => {
  const { region, currency } = useRegion();
  const { t } = useLanguage();
  
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
            {t('choosePlan')}
          </h1>
          <p className="text-gray-600 text-lg">{t('flexiblePricing')} {region}</p>
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
                    {t('mostPopular')}
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
                {t('getStarted')}
              </button>
            </motion.div>
        ))}
      </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            {t('paymentMethods')} {region}
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
            <p className="text-gray-600 mb-4">{t('securePayments')}</p>
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

// Legacy Analytics Component (for old navigation)
const LegacyAnalytics = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t('analytics')}</h1>
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
};

// Support Component
const Support = () => {
  const { t } = useLanguage();
  
  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t('support')}</h1>
          <p className="text-gray-600 mt-1">We are here to help!</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <p className="text-gray-600 text-lg">Get in touch with our support team for assistance.</p>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 KIZAZI Africa Ltd. All rights reserved. | 
              <a href="/privacy" className="text-pink-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Made with ❤️ for Africa by the KIZAZI Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Layout Component
const AppLayout = ({ isDemoMode, onBackToHome, onShowModeSelection }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'ai-content': return <AIContentGenerator />;
      case 'post-scheduler': return <PostScheduler />;
      case 'analytics': return <LegacyAnalytics />;
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

// FIXED: App Router Component
const AppRouter = () => {
  const { isRegionSelected, isProcessing } = useRegion();
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

  console.log('🌍 AppRouter - isRegionSelected:', isRegionSelected, 'isProcessing:', isProcessing, 'showModeSelection:', showModeSelection, 'appMode:', appMode);

  if (!isRegionSelected || isProcessing) {
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

// Privacy Policy Wrapper Component
const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  
  return (
    <PrivacyPolicy onBack={() => navigate('/')} />
  );
};

// Terms of Service Wrapper Component
const TermsOfServicePage = () => {
  const navigate = useNavigate();
  
  return (
    <TermsOfService onBack={() => navigate('/')} />
  );
};

// Data Deletion Wrapper Component
const DataDeletionPage = () => {
  const navigate = useNavigate();
  
  return (
    <DataDeletion onBack={() => navigate('/')} />
  );
};

// Social Media Connect Wrapper Component
const SocialConnectPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <SocialMediaConnect />
        </div>
        </div>
  );
};

// Post Creator Wrapper Component
const PostCreatorPage = () => {
  const navigate = useNavigate();
  
  const handlePostCreated = (postData) => {
    console.log('Post created:', postData);
    // Could show success message or redirect
    navigate('/analytics');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <PostCreator onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
};

// Analytics Wrapper Component
const AnalyticsPage = () => {
  const location = useLocation();
  const accountId = location.pathname.split('/')[2]; // Extract accountId from URL
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <Analytics accountId={accountId} />
      </div>
    </div>
  );
};

// Main App Component with Router
const App = () => {
  return (
    <Router>
      <RegionProvider>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/data-deletion" element={<DataDeletionPage />} />
              <Route path="/connect-accounts" element={<SocialConnectPage />} />
              <Route path="/create-post" element={<PostCreatorPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/analytics/:accountId" element={<AnalyticsPage />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/" element={<AppRouter />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </RegionProvider>
    </Router>
  );
};

export default App;
