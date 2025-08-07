import React from 'react';
import { useRegion } from '../contexts/RegionContext';

const RegionSelection = () => {
  const { selectRegion, regions } = useRegion();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Select Your Region</h1>
        <p className="text-gray-600 mb-6">Please select your country to continue.</p>
        <div className="space-y-4">
          {Object.keys(regions).map((regionName) => (
            <button
              key={regionName}
              onClick={() => selectRegion(regionName)}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white p-3 rounded-xl font-semibold hover:from-fuchsia-700 hover:to-purple-700 transition-all duration-200"
            >
              {regionName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionSelection;
