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
      welcome: 'Welcome to KIZAZI',
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
    },
    sw: {
      welcome: 'Karibu KIZAZI',
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
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
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
