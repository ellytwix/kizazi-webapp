import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/LoginModal';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated && !loading);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fuchsia-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading KIZAZI...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the children
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show login modal with backdrop
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Welcome content behind the modal */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent mb-6">
            KIZAZI
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Your Social Media Management Platform for Africa
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Platform</h3>
              <p className="text-gray-600">Manage Instagram, Facebook, and X from one dashboard</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered</h3>
              <p className="text-gray-600">Generate engaging content with our AI assistant</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-gray-600">Track performance and grow your audience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      {/* Sign in button if modal is closed */}
      {!showLoginModal && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">🚀</span>
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default ProtectedRoute;