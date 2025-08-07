#!/bin/bash

echo "🔧 KIZAZI Server Fix Script"
echo "=========================="

# Navigate to project directory
cd /var/www/kizazi

echo "📦 Backing up current files..."
cp -r src/contexts src/contexts.backup.$(date +%Y%m%d_%H%M%S)

echo "🔄 Updating AuthContext.jsx..."
cat > src/contexts/AuthContext.jsx << 'AUTHEOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        apiService.setToken(token);
        const response = await apiService.getProfile();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      apiService.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    apiService.setToken(null);
  };

  const value = {
    user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
AUTHEOF

echo "🎭 Creating ModeSelection component..."
mkdir -p src/components
cat > src/components/ModeSelection.jsx << 'MODEEOF'
import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, User, Sparkles } from 'lucide-react';

const ModeSelection = ({ onModeSelect }) => {
  const modes = [
    {
      id: 'demo',
      title: 'Demo Mode',
      description: 'Explore all features with sample data. No account required!',
      icon: PlayCircle,
      color: 'from-purple-500 to-purple-600',
      features: ['Explore all features', 'Sample data included', 'No registration needed', 'Instant access']
    },
    {
      id: 'auth',
      title: 'Full Access',
      description: 'Create an account to save your data and access all features.',
      icon: User,
      color: 'from-fuchsia-500 to-fuchsia-600',
      features: ['Save your data', 'Real integrations', 'Full functionality', 'Personalized experience']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <Sparkles className="text-fuchsia-600 mr-3" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to KIZAZI
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Choose how you'd like to experience our social media management platform
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
              className="relative group cursor-pointer"
              onClick={() => onModeSelect(mode.id)}
            >
              <div className={`bg-gradient-to-br ${mode.color} p-1 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105`}>
                <div className="bg-white rounded-xl p-8 h-full">
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${mode.color} text-white mr-4`}>
                      <mode.icon size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{mode.title}</h3>
                      <p className="text-gray-600">{mode.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mode.color} mr-3`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <button className={`w-full py-4 px-6 bg-gradient-to-r ${mode.color} text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}>
                      {mode.id === 'demo' ? 'Try Demo' : 'Get Started'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            You can switch between modes at any time from the header menu
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModeSelection;
MODEEOF

echo "🏗️ Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data dist/
    sudo chmod -R 755 dist/
    
    echo "📁 New build files:"
    ls -la dist/assets/
    
    echo ""
    echo "🎉 KIZAZI is ready!"
    echo "Visit: https://www.kizazisocial.com"
    echo ""
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
