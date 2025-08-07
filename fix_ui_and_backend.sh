#!/bin/bash

echo "🎨 KIZAZI UI & Backend Fix Script"
echo "================================"

cd /var/www/kizazi

echo "📦 Backing up current App.jsx..."
cp src/App.jsx src/App.jsx.backup.$(date +%Y%m%d_%H%M%S)

echo "🔧 Updating App.jsx with logo, name fixes, and clean UI..."
cat > src/App.jsx << 'APPEOF'
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
  Zap
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
    <AuthProvider>
      <RegionProvider>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </RegionProvider>
    </AuthProvider>
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
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          <Header setIsSidebarOpen={setIsSidebarOpen} currentPage={currentPage} isDemoMode={isDemoMode} onBackToHome={onBackToHome} onShowModeSelection={onShowModeSelection} />
          <main className={`flex-1 p-4 md:p-8 overflow-y-auto ${isDashboard ? 'bg-gradient-to-br from-fuchsia-50/80 via-white to-purple-50/80' : 'bg-gradient-to-br from-white to-slate-50/50'}`}>
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

  const pageTitle = t(`menu.${currentPage}`);
  const isDashboard = currentPage === 'dashboard';

  return (
    <header className={`sticky top-0 shadow-lg backdrop-blur-md z-20 ${isDashboard ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 border-b border-fuchsia-500/30' : 'bg-white/90 border-b border-gray-200/50'}`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg transition-all duration-200 md:hidden ${isDashboard ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100'}`}
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
              <h1 className={`text-xl font-bold ${isDashboard ? 'text-white' : 'text-gray-800'}`}>
                KizaziSocial
              </h1>
              <p className={`text-sm ${isDashboard ? 'text-white/80' : 'text-gray-500'}`}>
                {pageTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDemoMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={onShowModeSelection}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                🏠 Switch Mode
              </button>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${isDashboard ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                ✨ Demo Mode
              </div>
            </div>
          )}

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
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
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'en' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇺🇸</span> English
                </button>
                <button
                  onClick={() => handleLanguageChange('sw')}
                  className={`flex w-full items-center p-3 text-sm text-left hover:bg-gray-100 hover:text-blue-600 ${language === 'sw' ? 'bg-gray-100 text-blue-600 font-bold' : 'text-gray-700'}`}
                >
                  <span className="inline-block w-6 text-center mr-2">🇹🇿</span> Kiswahili
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          {!isDemoMode && user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isDashboard ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
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
                    className="flex w-full items-center p-3 text-sm text-left hover:bg-red-50 hover:text-red-600 text-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    {t('logout')}
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
  const { t } = useContext(LanguageContext);
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
    { id: 'dashboard', icon: Rocket, label: t('menu.dashboard') },
    { id: 'scheduler', icon: Calendar, label: t('menu.scheduler') },
    { id: 'analytics', icon: BarChart, label: t('menu.analytics') },
    { id: 'aiContent', icon: Lightbulb, label: t('menu.aiContent') },
    { id: 'pricing', icon: DollarSign, label: t('menu.pricing') },
    { id: 'support', icon: Headset, label: t('menu.support') },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
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

      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:relative md:translate-x-0 md:shadow-lg border-r border-gray-200/50"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
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
              <h2 className="text-xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                KizaziSocial
              </h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-fuchsia-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon 
                size={22} 
                className={`transition-transform duration-200 ${
                  currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

// Dashboard Page (Simplified - no menu items)
const Dashboard = () => {
  const { t } = useContext(LanguageContext);
  const stats = [
    { label: t('dashboard.postsScheduled'), value: '25', icon: Clock, color: 'text-fuchsia-600' },
    { label: t('dashboard.engagements'), value: '12.4K', icon: CheckCircle, color: 'text-green-500' },
    { label: t('dashboard.newFollowers'), value: '458', icon: PlusCircle, color: 'text-purple-600' },
    { label: t('dashboard.growthRate'), value: '8.2%', icon: BarChart, color: 'text-orange-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
      <p className="text-gray-600 mb-6">{t('dashboard.welcome')}</p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-fuchsia-200/50"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">{t('dashboard.summary')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center bg-gradient-to-br from-white to-fuchsia-50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-fuchsia-200 group"
            >
              <div className={`p-4 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-fuchsia-600 transition-colors duration-300">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Placeholder components
const PostScheduler = () => <div className="p-8"><h2 className="text-2xl font-bold">Post Scheduler</h2><p>Schedule your social media posts here.</p></div>;
const Analytics = () => <div className="p-8"><h2 className="text-2xl font-bold">Analytics</h2><p>View your social media analytics here.</p></div>;
const AIContentGenerator = () => <div className="p-8"><h2 className="text-2xl font-bold">AI Content Generator</h2><p>Generate content with AI here.</p></div>;
const Pricing = () => <div className="p-8"><h2 className="text-2xl font-bold">Pricing</h2><p>View pricing plans here.</p></div>;
const Support = () => <div className="p-8"><h2 className="text-2xl font-bold">Support</h2><p>Get support here.</p></div>;

export default App;
APPEOF

echo "🔧 Fixing API service for better account persistence..."
cat > src/services/api.js << 'APIEOF'
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status-based messages
          switch (response.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Authentication failed. Please check your credentials.';
              break;
            case 403:
              errorMessage = 'Access denied. You do not have permission.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = `Request failed with status ${response.status}`;
          }
        }
        
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Success:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.setToken(null);
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
APIEOF

echo "🏗️ Building frontend with fixes..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data dist/
    sudo chmod -R 755 dist/
    
    echo "📁 New build files:"
    ls -la dist/assets/
    
    echo ""
    echo "🎉 KizaziSocial UI fixes applied!"
    echo "Visit: https://www.kizazisocial.com"
    echo ""
    echo "Fixes applied:"
    echo "✅ App name changed to KizaziSocial"
    echo "✅ Logo integration improved"
    echo "✅ Dashboard menu cleaned up"
    echo "✅ API service enhanced for better account persistence"
    echo "✅ Language selection available (EN/Swahili)"
    echo ""
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
