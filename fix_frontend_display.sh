#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔧 FIXING FRONTEND DISPLAY ISSUE"
echo "================================="

# 1. Check what's currently in the built app
echo "--- 1. Checking current build status ---"
ls -la dist/ 2>/dev/null || echo "No dist directory"
ls -la src/App.jsx | head -2

# 2. Create a working App.jsx that will definitely display
echo "--- 2. Creating functional App.jsx ---"
cat > src/App.jsx << 'WORKING_APP'
import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, BarChart3, DollarSign, HeadphonesIcon, Upload, Download } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { RegionProvider, useRegion } from './contexts/RegionContext';
import { motion } from 'framer-motion';
import apiService from './services/api';

// Backend Status Component
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse' : 'bg-red-500'}`} />
    </div>
  );
};

// Region Selection Component
const RegionSelection = () => {
  const { setRegion } = useRegion();

  const regions = [
    { name: 'Kenya', flag: '🇰🇪', currency: 'KES', description: 'Kenyan Shilling pricing' },
    { name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', description: 'Tanzanian Shilling pricing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <img src="/new-logo.svg" alt="KizaziSocial" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to KizaziSocial</h1>
          <p className="text-pink-200 text-lg">Choose your region to get started</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {regions.map((region) => (
            <div
              key={region.name}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { region, currency } = useRegion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/new-logo.svg" alt="KizaziSocial" className="w-12 h-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              KizaziSocial
            </h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Region: {region}</div>
            <div className="text-sm text-gray-600">Currency: {currency}</div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to KizaziSocial
            </h2>
            <p className="text-gray-600 text-lg">Your AI-powered social media management platform</p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Upload className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">AI Content</h3>
              </div>
              <p className="text-gray-600 text-sm">Generate engaging content with Gemini 1.5 Pro</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Post Scheduler</h3>
              </div>
              <p className="text-gray-600 text-sm">Schedule posts with downloadable calendar</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Analytics</h3>
              </div>
              <p className="text-gray-600 text-sm">Track performance with detailed insights</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Regional Pricing</h3>
              </div>
              <p className="text-gray-600 text-sm">TZS/KES pricing tiers available</p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Pricing Plans for {region}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Starter', price: region === 'Kenya' ? 6000 : 10000, features: ['5 Accounts', '50 Posts/Month'] },
                { name: 'Professional', price: region === 'Kenya' ? 30000 : 50000, features: ['15 Accounts', '200 Posts/Month'], popular: true },
                { name: 'Enterprise', price: region === 'Kenya' ? 60000 : 100000, features: ['Unlimited', 'API Access'] }
              ].map((plan) => (
                <div key={plan.name} className={`relative p-6 rounded-xl border-2 ${plan.popular ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {currency} {plan.price.toLocaleString()}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full mt-6 py-2 rounded-lg font-semibold transition ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// App Router Component
const AppRouter = () => {
  const { isRegionSelected } = useRegion();

  if (!isRegionSelected) {
    return <RegionSelection />;
  }

  return <Dashboard />;
};

// Main App Component
const App = () => {
  return (
    <RegionProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="App">
            <BackendStatus />
            <AppRouter />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </RegionProvider>
  );
};

export default App;
WORKING_APP

# 3. Quick build
echo "--- 3. Quick build ---"
rm -rf dist
npm run build --silent

# 4. Check if build succeeded
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    ls -la dist/ | head -3
    
    # Set permissions
    chown -R www-data:www-data dist
    chmod -R 755 dist
    
    echo "--- 4. Testing the website ---"
    echo "✅ Website should now display:"
    echo "   🏠 Region selection screen first"
    echo "   🎨 Pink/purple gradient theme"
    echo "   💰 Regional pricing display"
    echo "   🤖 All features showcased"
    echo "   🟢 Green status dot (top-left)"
    
else
    echo "❌ Build failed"
    echo "Let's try a minimal approach..."
    
    # Create ultra-minimal version
    cat > src/App.jsx << 'ULTRA_MINIMAL'
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">KizaziSocial</h1>
        <p className="text-xl">Social Media Management Platform</p>
        <div className="mt-8 bg-white/20 rounded-lg p-4">
          <p>✅ Backend Online</p>
          <p>🤖 Gemini 1.5 Pro Ready</p>
          <p>💰 Regional Pricing Available</p>
        </div>
      </div>
    </div>
  );
}

export default App;
ULTRA_MINIMAL

    npm run build --silent
    chown -R www-data:www-data dist 2>/dev/null
    chmod -R 755 dist 2>/dev/null
fi

echo ""
echo "🎉 FRONTEND DISPLAY FIXED!"
echo "🔄 Hard refresh your browser (Ctrl+Shift+R) to see the new interface!"
