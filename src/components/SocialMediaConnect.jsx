import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Plus, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

const SocialMediaConnect = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('kizazi_token')}`
        }
      });
      const data = await response.json();
      setConnectedAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    }
  };

  const connectMetaAccount = () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    window.location.href = `https://kizazisocial.com/api/meta/oauth/login?user_id=${userId}`;
  };

  const disconnectAccount = async (accountId) => {
    try {
      await fetch(`/api/social/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('kizazi_token')}`
        }
      });
      await loadConnectedAccounts();
    } catch (error) {
      console.error('Failed to disconnect account:', error);
    }
  };

  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-blue-600',
      description: 'Connect your Facebook Pages'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      description: 'Connect your Instagram Business accounts'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect Social Media Accounts</h2>
        <p className="text-gray-600">Connect your Facebook and Instagram accounts to start posting and analyzing your content.</p>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h3>
          <div className="grid gap-4">
            {connectedAccounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-600">{account.platform} • {account.followers} followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.location.href = `/analytics/${account.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <BarChart3 size={16} />
                    <span className="text-sm">Analytics</span>
                  </button>
                  <button
                    onClick={() => disconnectAccount(account.id)}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Connect New Accounts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Accounts</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <motion.div
              key={platform.name}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{platform.name}</h4>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
              </div>
              
              <button
                onClick={connectMetaAccount}
                disabled={loading}
                className={`w-full bg-gradient-to-r ${platform.color} text-white py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Connect {platform.name}</span>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">What you can do after connecting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Post content directly to Facebook Pages and Instagram Business accounts</li>
              <li>Schedule posts for optimal engagement times</li>
              <li>View detailed analytics and insights</li>
              <li>Manage multiple accounts from one dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaConnect;
