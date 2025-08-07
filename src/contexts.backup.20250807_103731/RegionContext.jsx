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
  Tanzania: { currency: 'TSh', code: 'TZ' },
  Kenya: { currency: 'KSh', code: 'KE' },
};

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRegion = localStorage.getItem('app_region');
    if (savedRegion && regions[savedRegion]) {
      setRegion({ name: savedRegion, ...regions[savedRegion] });
    }
    setLoading(false);
  }, []);

  const selectRegion = (regionName) => {
    if (regions[regionName]) {
      localStorage.setItem('app_region', regionName);
      setRegion({ name: regionName, ...regions[regionName] });
    }
  };

  const value = {
    region,
    regions,
    loading,
    selectRegion,
    isRegionSelected: !!region,
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};
