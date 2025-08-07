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
