#!/bin/bash

echo "🎨 Complete KIZAZI UI Fix Script"
echo "==============================="

cd /var/www/kizazi

echo "🔧 Fixing backend trust proxy settings..."
sed -i '/const app = express();/a app.set("trust proxy", 1);' server/server.js

echo "🌍 Creating proper RegionSelection component..."
cat > src/components/RegionSelection.jsx << 'REGIONEOF'
import React from 'react';
import { motion } from 'framer-motion';
import { useRegion } from '../contexts/RegionContext';

const RegionSelection = () => {
  const { selectRegion } = useRegion();

  const regions = [
    {
      name: 'Kenya',
      flag: '🇰🇪',
      currency: 'Kenyan Shilling (KSh)',
      description: 'Select Kenya as your region',
      gradient: 'from-green-500 to-red-500'
    },
    {
      name: 'Tanzania',
      flag: '🇹🇿',
      currency: 'Tanzanian Shilling (TSh)',
      description: 'Select Tanzania as your region',
      gradient: 'from-blue-500 to-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-xl mr-4">
              <img 
                src="/logo.jpg" 
                alt="KizaziSocial" 
                className="w-12 h-12 object-contain rounded-lg"
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-2xl hidden">K</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              KizaziSocial
            </h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
          >
            Select Your Region
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Choose your country to get started with KizaziSocial
          </motion.p>
        </div>

        {/* Region Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={() => selectRegion(region.name)}
            >
              <div className={`bg-gradient-to-br ${region.gradient} p-1 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105`}>
                <div className="bg-white rounded-2xl p-8 h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{region.flag}</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{region.name}</h3>
                    <p className="text-gray-600 mb-4">{region.description}</p>
                    <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${region.gradient} text-white rounded-xl text-sm font-medium`}>
                      💰 {region.currency}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button className={`w-full py-4 px-6 bg-gradient-to-r ${region.gradient} text-white font-bold text-lg rounded-2xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl`}>
                      Select {region.name} →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RegionSelection;
REGIONEOF

echo "🔄 Updating RegionContext to work properly..."
cat > src/contexts/RegionContext.jsx << 'REGIONCTXEOF'
import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionContext = createContext();

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

export const RegionProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isRegionSelected, setIsRegionSelected] = useState(false);

  const regions = {
    Kenya: {
      currency: 'KSh',
      currencySymbol: 'KSh',
      fullName: 'Kenyan Shilling',
      flag: '🇰🇪'
    },
    Tanzania: {
      currency: 'TSh',
      currencySymbol: 'TSh', 
      fullName: 'Tanzanian Shilling',
      flag: '🇹🇿'
    }
  };

  // Load saved region on component mount
  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion && regions[savedRegion]) {
      setSelectedRegion(savedRegion);
      setIsRegionSelected(true);
    }
  }, []);

  const selectRegion = (regionName) => {
    if (regions[regionName]) {
      setSelectedRegion(regionName);
      setIsRegionSelected(true);
      localStorage.setItem('selectedRegion', regionName);
    }
  };

  const resetRegion = () => {
    setSelectedRegion(null);
    setIsRegionSelected(false);
    localStorage.removeItem('selectedRegion');
  };

  const getCurrentCurrency = () => {
    return selectedRegion ? regions[selectedRegion].currency : 'USD';
  };

  const value = {
    selectedRegion,
    isRegionSelected,
    regions,
    selectRegion,
    resetRegion,
    getCurrentCurrency,
    currentRegionData: selectedRegion ? regions[selectedRegion] : null
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

export default RegionContext;
REGIONCTXEOF

echo "🗣️ Fixing LanguageContext translations..."
cat > src/contexts/LanguageContext.jsx << 'LANGEOF'
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      welcome: 'Welcome to KizaziSocial',
      selectRegion: 'Select Your Region',
      kenya: 'Kenya',
      tanzania: 'Tanzania',
      currency: 'Currency',
      ksh: 'Kenyan Shilling (KSh)',
      tsh: 'Tanzanian Shilling (TSh)',
      continue: 'Continue',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      posts: 'Posts',
      analytics: 'Analytics',
      schedule: 'Schedule',
      settings: 'Settings',
      logout: 'Logout',
      menu: {
        dashboard: 'Dashboard',
        scheduler: 'Post Scheduler',
        analytics: 'Analytics',
        aiContent: 'AI Content',
        pricing: 'Pricing',
        support: 'Support'
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back! Here\'s your social media overview.',
        summary: 'Performance Summary',
        postsScheduled: 'Posts Scheduled',
        engagements: 'Total Engagements',
        newFollowers: 'New Followers',
        growthRate: 'Growth Rate'
      }
    },
    sw: {
      welcome: 'Karibu KizaziSocial',
      selectRegion: 'Chagua Mkoa Wako',
      kenya: 'Kenya',
      tanzania: 'Tanzania',
      currency: 'Sarafu',
      ksh: 'Shilingi ya Kenya (KSh)',
      tsh: 'Shilingi ya Tanzania (TSh)',
      continue: 'Endelea',
      login: 'Ingia',
      register: 'Jisajili',
      dashboard: 'Dashibodi',
      posts: 'Machapisho',
      analytics: 'Uchambuzi',
      schedule: 'Ratiba',
      settings: 'Mipangilio',
      logout: 'Toka',
      menu: {
        dashboard: 'Dashibodi',
        scheduler: 'Mpangaji wa Machapisho',
        analytics: 'Uchambuzi',
        aiContent: 'Maudhui ya AI',
        pricing: 'Bei',
        support: 'Msaada'
      },
      dashboard: {
        title: 'Dashibodi',
        welcome: 'Karibu tena! Hii ni muhtasari wa mitandao yako ya kijamii.',
        summary: 'Muhtasari wa Utendaji',
        postsScheduled: 'Machapisho Yaliyopangwa',
        engagements: 'Jumla ya Mahusiano',
        newFollowers: 'Wafuasi Wapya',
        growthRate: 'Kiwango cha Ukuaji'
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // Fallback to English if translation not found
    if (value === undefined) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'sw' : 'en');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage,
    isSwahili: language === 'sw'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
LANGEOF

echo "🏗️ Building with all fixes..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data dist/
    sudo chmod -R 755 dist/
    
    echo "🔄 Restarting backend with trust proxy fix..."
    cd server
    pm2 restart kizazi-backend
    cd ..
    
    echo "📁 New build files:"
    ls -la dist/assets/
    
    echo ""
    echo "🎉 KizaziSocial Complete Fix Applied!"
    echo "Visit: https://www.kizazisocial.com"
    echo ""
    echo "Fixed issues:"
    echo "✅ Backend trust proxy (fixes rate limit error)"
    echo "✅ Region selection restored (Kenya/Tanzania)"
    echo "✅ Translation system fixed"
    echo "✅ Sidebar should now be visible"
    echo "✅ Modern professional design"
    echo ""
    echo "Expected flow:"
    echo "1. Region Selection (Kenya 🇰🇪 / Tanzania 🇹🇿)"
    echo "2. Mode Selection (Demo / Full Access)"
    echo "3. Dashboard with left sidebar"
    echo ""
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
