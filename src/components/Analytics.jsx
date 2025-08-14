import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Calendar } from 'lucide-react';

const Analytics = ({ accountId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedAccount, setSelectedAccount] = useState(accountId || '');
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadAnalytics();
    }
  }, [selectedAccount, selectedPeriod]);

  const loadConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setConnectedAccounts(data.accounts || []);
      
      if (!selectedAccount && data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0].id);
      }
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const account = connectedAccounts.find(acc => acc.id === selectedAccount);
      if (!account) return;

      const response = await fetch(
        `/api/meta/analytics/${account.accountId}?accessToken=${account.accessToken}&platform=${account.platform}&period=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (metric) => {
    const iconMap = {
      impressions: Eye,
      reach: Users,
      engagement: Heart,
      profile_views: Users,
      page_impressions: Eye,
      page_reach: Users,
      page_actions: MessageCircle
    };
    return iconMap[metric] || BarChart3;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const selectedAccountData = connectedAccounts.find(acc => acc.id === selectedAccount);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your social media performance and engagement</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          {/* Account Selector */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Account</option>
            {connectedAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.platform})
              </option>
            ))}
          </select>
          
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {selectedAccountData && (
        <>
          {/* Account Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                selectedAccountData.platform === 'Facebook' ? 'bg-blue-600' : 'bg-gradient-to-r from-pink-500 to-purple-600'
              }`}>
                {selectedAccountData.platform === 'Facebook' ? 'FB' : 'IG'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedAccountData.name}</h2>
                <p className="text-gray-600">{selectedAccountData.platform} • {formatNumber(selectedAccountData.followers)} followers</p>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          {analyticsData?.data && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {analyticsData.data.map((metric, index) => {
                const IconComponent = getMetricIcon(metric.name);
                const value = metric.values?.[0]?.value || 0;
                
                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                        <p className="text-sm text-gray-600 capitalize">{metric.name.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">+12% vs last period</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Chart visualization coming soon</p>
                <p className="text-sm">Real-time data from Meta Graph API</p>
              </div>
            </div>
          </div>

          {/* Recent Posts Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts Performance</h3>
            <div className="space-y-4">
              {/* Placeholder for recent posts */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Post content preview...</p>
                    <p className="text-sm text-gray-600">Published 2 days ago</p>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>1.2K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>84</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>12</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedAccount && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Account Selected</h3>
          <p className="text-gray-600">Select a connected account to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
