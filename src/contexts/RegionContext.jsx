import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionContext = createContext();

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

const regions = {
  Tanzania: { currency: 'TZS', code: 'TZ', symbol: 'TSh' },
  Kenya: { currency: 'KES', code: 'KE', symbol: 'KSh' },
};

export const RegionProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedRegion = localStorage.getItem('app_region');
    if (savedRegion && regions[savedRegion]) {
      setSelectedRegion(savedRegion);
    }
  }, []);

  const setRegion = (regionName) => {
    console.log('🌍 RegionContext: Setting region to', regionName);
    setIsProcessing(true);
    
    setTimeout(() => {
      if (regions[regionName]) {
        localStorage.setItem('app_region', regionName);
        setSelectedRegion(regionName);
        console.log('🌍 RegionContext: Region set successfully to', regionName);
      }
      setIsProcessing(false);
    }, 1000); // Simulate processing time
  };

  const resetRegion = () => {
    localStorage.removeItem('app_region');
    setSelectedRegion(null);
    setIsProcessing(false);
  };

  const getCurrentRegion = () => {
    if (!selectedRegion) return null;
    return { name: selectedRegion, ...regions[selectedRegion] };
  };

  const value = {
    region: selectedRegion,
    currency: selectedRegion ? regions[selectedRegion].symbol : '',
    setRegion,
    resetRegion,
    isRegionSelected: !!selectedRegion && !isProcessing,
    isProcessing,
    getCurrentRegion,
    regions
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};
