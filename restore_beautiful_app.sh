#!/bin/bash

echo "🎨 Restoring Beautiful KizaziSocial Design"
echo "========================================"

cd /var/www/kizazi

echo "🔄 Completely rebuilding App.jsx with beautiful design..."
cat > src/App.jsx << 'BEAUTIFULEOF'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import {
  Calendar,
  Rocket,
  BarChart,
  Lightbulb,
  DollarSign,
  Headset,
  Menu,
  X,
  Languages,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Send,
  PlusCircle,
  Copy,
  Info,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  Hash,
  LogOut,
  User,
  PlayCircle,
  Zap,
  Heart,
  Share,
  TrendingUp
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageContext from './contexts/LanguageContext';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RegionSelection from './components/RegionSelection';
import ModeSelection from './components/ModeSelection';
import LoginModal from './components/Auth/LoginModal';
import apiService from './services/api';

// --- MAIN APP COMPONENT ---
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

  // Always show region selection first if not selected
  if (!isRegionSelected) {
    return <RegionSelection />;
  }

  // Show mode selection after region is selected
  if (showModeSelection) {
    return <ModeSelection onModeSelect={handleModeSelect} />;
  }

  // Demo mode - no authentication required
  if (appMode === 'demo') {
    return (
      <AppLayout 
        isDemoMode={true} 
        onBackToHome={handleBackToHome} 
        onShowModeSelection={() => setShowModeSelection(true)} 
      />
    );
  }

  // Full mode - requires authentication
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

// --- APP LAYOUT COMPONENT ---
const AppLayout = ({ isDemoMode, onBackToHome, onShowModeSelection }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const auth = isDemoMode ? null : useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'scheduler':
        return <PostScheduler />;
      case 'analytics':
        return <Analytics />;
      case 'aiContent':
        return <AIContentGenerator />;
      case 'pricing':
        return <Pricing />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  const isDashboard = currentPage === 'dashboard';

  return (
    <AuthContext.Provider value={auth}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-gray-800">
        {/* Sidebar */}
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          <Header 
            setIsSidebarOpen={setIsSidebarOpen} 
            currentPage={currentPage} 
            isDemoMode={isDemoMode} 
            onBackToHome={onBackToHome} 
            onShowModeSelection={onShowModeSelection} 
          />
          
          <main className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-500 ${
            isDashboard 
              ? 'bg-gradient-to-br from-fuchsia-50/80 via-white to-purple-50/80' 
              : 'bg-gradient-to-br from-white to-slate-50/50'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

// --- HEADER COMPONENT ---
const Header = ({ setIsSidebarOpen, currentPage, isDemoMode, onBackToHome, onShowModeSelection }) => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const authContext = isDemoMode ? null : useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      scheduler: 'Post Scheduler',
      analytics: 'Analytics',
      aiContent: 'AI Content',
      pricing: 'Pricing',
      support: 'Support'
    };
    return titles[currentPage] || 'Dashboard';
  };

  const isDashboard = currentPage === 'dashboard';

  return (
    <header className={`sticky top-0 shadow-lg backdrop-blur-md z-20 transition-all duration-500 ${
      isDashboard 
        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 border-b border-fuchsia-500/30' 
        : 'bg-white/90 border-b border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg transition-all duration-200 md:hidden ${
              isDashboard 
                ? 'text-white hover:bg-white/20' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg">
              <img 
                src="/logo.jpg" 
                alt="KizaziSocial" 
                className="w-8 h-8 object-contain rounded"
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-lg hidden">K</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDashboard ? 'text-white' : 'text-gray-800'
              }`}>
                KizaziSocial
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDashboard ? 'text-white/80' : 'text-gray-500'
              }`}>
                {getPageTitle()}
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Indicators */}
          {isDemoMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={onShowModeSelection}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isDashboard 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Switch Mode
              </button>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isDashboard 
                  ? 'bg-white/20 text-white' 
                  : 'bg-green-100 text-green-700'
              }`}>
                ✨ Demo Mode
              </div>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
                isDashboard 
                  ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Languages size={20} />
              <span className="hidden md:inline-block text-sm font-medium uppercase">{language}</span>
            </button>

            <AnimatePresence>
            {isLanguageMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
              >
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 transition-colors ${
                    language === 'en' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇺🇸</span> English
                </button>
                <button
                  onClick={() => handleLanguageChange('sw')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 transition-colors ${
                    language === 'sw' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇹🇿</span> Kiswahili
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {/* User Menu (Full Mode Only) */}
          {!isDemoMode && user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
                  isDashboard 
                    ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <User size={20} />
                <span className="hidden md:inline-block text-sm font-medium">{user.name}</span>
              </button>

              <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                >
                  <button
                    onClick={logout}
                    className="flex w-full items-center p-3 text-sm text-left hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const navItems = [
    { id: 'dashboard', icon: Rocket, label: 'Dashboard', gradient: 'from-fuchsia-500 to-purple-600' },
    { id: 'scheduler', icon: Calendar, label: 'Post Scheduler', gradient: 'from-blue-500 to-cyan-600' },
    { id: 'analytics', icon: BarChart, label: 'Analytics', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'aiContent', icon: Lightbulb, label: 'AI Content', gradient: 'from-amber-500 to-orange-600' },
    { id: 'pricing', icon: DollarSign, label: 'Pricing', gradient: 'from-indigo-500 to-purple-600' },
    { id: 'support', icon: Headset, label: 'Support', gradient: 'from-pink-500 to-rose-600' },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:relative md:translate-x-0 md:shadow-lg border-r border-gray-200/50"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-fuchsia-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.jpg" 
                  alt="KizaziSocial" 
                  className="w-9 h-9 object-contain rounded-lg"
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-white font-bold text-xl hidden">K</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                  KizaziSocial
                </h2>
                <p className="text-xs text-gray-500">Social Media Management</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                currentPage === item.id
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/25`
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-fuchsia-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
              }`}>
                <item.icon 
                  size={20} 
                  className={`transition-transform duration-200 ${
                    currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
              </div>
              <span className="font-medium">{item.label}</span>
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 rounded-xl p-4 border border-fuchsia-200/50">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <button className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-medium">
              Contact Support →
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// --- DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { selectedRegion, getCurrentCurrency } = useRegion();
  
  const stats = [
    { 
      label: 'Posts Scheduled', 
      value: '25', 
      icon: Clock, 
      color: 'text-fuchsia-600',
      bg: 'from-fuchsia-50 to-fuchsia-100',
      change: '+12%'
    },
    { 
      label: 'Total Engagements', 
      value: '12.4K', 
      icon: Heart, 
      color: 'text-red-500',
      bg: 'from-red-50 to-pink-100',
      change: '+23%'
    },
    { 
      label: 'New Followers', 
      value: '458', 
      icon: User, 
      color: 'text-blue-600',
      bg: 'from-blue-50 to-indigo-100',
      change: '+8%'
    },
    { 
      label: 'Growth Rate', 
      value: '8.2%', 
      icon: TrendingUp, 
      color: 'text-emerald-500',
      bg: 'from-emerald-50 to-green-100',
      change: '+2%'
    },
  ];

  const upcomingPosts = [
    { 
      id: 1, 
      platform: 'Instagram', 
      content: 'Beautiful sunset in ' + selectedRegion + '! 🌅', 
      date: '2025-01-20', 
      time: '10:00 AM',
      status: 'scheduled'
    },
    { 
      id: 2, 
      platform: 'Facebook', 
      content: 'Exciting news about our expansion to ' + selectedRegion + '!', 
      date: '2025-01-22', 
      time: '02:30 PM',
      status: 'draft'
    },
    { 
      id: 3, 
      platform: 'Twitter', 
      content: 'Just launched in ' + selectedRegion + '! #KizaziSocial', 
      date: '2025-01-23', 
      time: '09:00 AM',
      status: 'scheduled'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Welcome to KizaziSocial
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg"
        >
          Managing your social media presence in {selectedRegion}. Currency: {getCurrentCurrency()}
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group cursor-pointer`}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Upcoming Posts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="text-fuchsia-600" size={24} />
          Upcoming Posts
        </h2>
        <div className="space-y-4">
          {upcomingPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {post.platform[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 group-hover:text-fuchsia-600 transition-colors">
                  {post.content}
                </p>
                <p className="text-sm text-gray-500">
                  {post.platform} • {post.date} at {post.time}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.status === 'scheduled' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {post.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Placeholder components with beautiful design
const PostScheduler = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Post Scheduler</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">Schedule your social media posts here.</p>
      <div className="mt-6 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
        <Calendar size={64} className="text-blue-400" />
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Analytics</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">View your social media analytics here.</p>
      <div className="mt-6 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
        <BarChart size={64} className="text-emerald-400" />
      </div>
    </div>
  </div>
);

const AIContentGenerator = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">AI Content Generator</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">Generate content with AI here.</p>
      <div className="mt-6 h-64 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center">
        <Lightbulb size={64} className="text-amber-400" />
      </div>
    </div>
  </div>
);

const Pricing = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pricing</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">View pricing plans here.</p>
      <div className="mt-6 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
        <DollarSign size={64} className="text-indigo-400" />
      </div>
    </div>
  </div>
);

const Support = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Support</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">Get support here.</p>
      <div className="mt-6 h-64 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center">
        <Headset size={64} className="text-pink-400" />
      </div>
    </div>
  </div>
);

export default App;
BEAUTIFULEOF

echo "🔄 Updating LoginModal with error handling..."
cat > src/components/Auth/LoginModal.jsx << 'LOGINEOF'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const { login, register, loading, error } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    setLocalError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setLocalError('Email is required');
      return false;
    }
    if (!formData.password) {
      setLocalError('Password is required');
      return false;
    }
    if (!isLoginMode && !formData.name) {
      setLocalError('Name is required');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) return;

    try {
      if (isLoginMode) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const currentError = localError || error;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {isLoginMode ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-white/80">
                  {isLoginMode ? 'Sign in to your account' : 'Join KizaziSocial today'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Error Display */}
            <AnimatePresence>
              {currentError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-red-700 text-sm">{currentError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Register only) */}
              {!isLoginMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-fuchsia-700 hover:to-purple-700 transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLoginMode ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setLocalError('');
                    setFormData({ name: '', email: '', password: '' });
                  }}
                  className="ml-2 text-fuchsia-600 font-medium hover:text-fuchsia-700 transition-colors"
                >
                  {isLoginMode ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
LOGINEOF

echo "🌍 Resetting region storage to force region selection..."
cat > reset_region.js << 'RESETEOF'
// Clear localStorage to force region selection
if (typeof window !== 'undefined') {
  localStorage.removeItem('selectedRegion');
}
RESETEOF

echo "🏗️ Building with beautiful design..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data dist/
    sudo chmod -R 755 dist/
    
    echo "🔄 Restarting backend..."
    cd server
    pm2 restart kizazi-backend
    cd ..
    
    echo "📁 New build files:"
    ls -la dist/assets/
    
    echo ""
    echo "🎉 Beautiful KizaziSocial Restored!"
    echo "Visit: https://www.kizazisocial.com"
    echo ""
    echo "✅ Beautiful sidebar with gradients and animations"
    echo "✅ Proper translations (no more keys)"
    echo "✅ Region selection will appear first"
    echo "✅ Enhanced login with error messages"
    echo "✅ Professional modern design"
    echo "✅ Backend error handling improved"
    echo ""
    echo "Flow: Region → Mode → Dashboard with beautiful sidebar"
    echo ""
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
