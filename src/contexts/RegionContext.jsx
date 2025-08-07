import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionContext = createContext();

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

// Region configurations
const REGIONS = {
  tanzania: {
    id: 'tanzania',
    name: 'Tanzania',
    flag: '🇹🇿',
    currency: {
      code: 'TSH',
      symbol: 'TSh',
      name: 'Tanzanian Shilling'
    },
    timezone: 'Africa/Dar_es_Salaam',
    locale: 'sw-TZ', // Swahili - Tanzania
    socialPlatforms: {
      facebook: true,
      instagram: true,
      twitter: true,
      tiktok: true,
      whatsapp: true
    }
  },
  kenya: {
    id: 'kenya',
    name: 'Kenya',
    flag: '🇰🇪',
    currency: {
      code: 'KSH',
      symbol: 'KSh',
      name: 'Kenyan Shilling'
    },
    timezone: 'Africa/Nairobi',
    locale: 'sw-KE', // Swahili - Kenya
    socialPlatforms: {
      facebook: true,
      instagram: true,
      twitter: true,
      tiktok: true,
      whatsapp: true
    }
  }
};

export const RegionProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved region from localStorage on app start
  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion && REGIONS[savedRegion]) {
      setSelectedRegion(REGIONS[savedRegion]);
    }
    setLoading(false);
  }, []);

  const selectRegion = (regionId) => {
    if (REGIONS[regionId]) {
      const region = REGIONS[regionId];
      setSelectedRegion(region);
      localStorage.setItem('selectedRegion', regionId);
    }
  };

  const formatCurrency = (amount, showSymbol = true) => {
    if (!selectedRegion) return amount;
    
    const formatted = new Intl.NumberFormat(selectedRegion.locale, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);

    return showSymbol ? `${selectedRegion.currency.symbol} ${formatted}` : formatted;
  };

  const getCurrentDateTime = () => {
    if (!selectedRegion) return new Date();
    
    return new Intl.DateTimeFormat(selectedRegion.locale, {
      timeZone: selectedRegion.timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  };

  const getLocalTime = () => {
    if (!selectedRegion) return new Date().toLocaleTimeString();
    
    return new Intl.DateTimeFormat(selectedRegion.locale, {
      timeZone: selectedRegion.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date());
  };

  const value = {
    selectedRegion,
    selectRegion,
    regions: REGIONS,
    loading,
    formatCurrency,
    getCurrentDateTime,
    getLocalTime,
    isRegionSelected: !!selectedRegion
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

export default RegionContext;