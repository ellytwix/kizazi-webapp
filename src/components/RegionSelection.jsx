import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { useRegion } from '../contexts/RegionContext';

const RegionSelection = () => {
  const { regions, selectRegion, getLocalTime } = useRegion();
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  const handleRegionSelect = (regionId) => {
    setSelectedRegionId(regionId);
    setTimeout(() => {
      selectRegion(regionId);
    }, 500);
  };

  const regionArray = Object.values(regions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <Globe className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Welcome to KIZAZI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl text-white/80 mb-2"
            >
              Social Media Management for East Africa
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg text-white/60"
            >
              Choose your region to get started
            </motion.p>
          </div>

          {/* Region Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {regionArray.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <div
                  onClick={() => handleRegionSelect(region.id)}
                  className={`relative overflow-hidden bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-white/15 ${
                    selectedRegionId === region.id
                      ? 'border-yellow-400 bg-white/20 scale-105'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedRegionId === region.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-yellow-400 rounded-full p-2"
                    >
                      <ArrowRight className="h-4 w-4 text-black" />
                    </motion.div>
                  )}

                  {/* Flag and Country */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{region.flag}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
                  </div>

                  {/* Currency Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-white font-medium">Currency</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{region.currency.symbol}</div>
                        <div className="text-white/60 text-sm">{region.currency.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-white font-medium">Local Time</span>
                      </div>
                      <div className="text-white font-mono">{getLocalTime()}</div>
                    </div>

                    <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-white font-medium">Timezone</span>
                      </div>
                      <div className="text-white/80 text-sm">{region.timezone}</div>
                    </div>
                  </div>

                  {/* Social Platforms */}
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="text-white font-medium mb-3">Supported Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(region.socialPlatforms)
                        .filter(([platform, supported]) => supported)
                        .map(([platform]) => (
                          <span
                            key={platform}
                            className="bg-white/20 text-white text-xs px-3 py-1 rounded-full capitalize"
                          >
                            {platform}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm">
              You can change your region later in settings
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {selectedRegionId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
          >
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Setting up your region...</h3>
            <p className="text-gray-600">
              Configuring KIZAZI for {regions[selectedRegionId]?.name}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RegionSelection;