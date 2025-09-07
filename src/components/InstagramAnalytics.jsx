import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Calendar,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Award,
  Clock
} from 'lucide-react';

const InstagramAnalytics = ({ accountId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(accountId || '');

  // Mock data for demonstration
  const mockData = {
    overview: {
      followers: { current: 12543, change: 12.5, trend: 'up' },
      reach: { current: 45678, change: 8.3, trend: 'up' },
      impressions: { current: 78901, change: -2.1, trend: 'down' },
      engagement: { current: 4.2, change: 15.7, trend: 'up' }
    },
    engagement: {
      likes: { current: 2341, change: 8.2, trend: 'up' },
      comments: { current: 156, change: 12.1, trend: 'up' },
      shares: { current: 89, change: -3.4, trend: 'down' },
      saves: { current: 234, change: 22.1, trend: 'up' }
    },
    content: {
      posts: { current: 24, change: 0, trend: 'neutral' },
      stories: { current: 12, change: 50, trend: 'up' },
      reels: { current: 8, change: 33.3, trend: 'up' },
      igtv: { current: 2, change: -50, trend: 'down' }
    },
    audience: {
      ageGroups: [
        { range: '18-24', percentage: 35, count: 4390 },
        { range: '25-34', percentage: 42, count: 5263 },
        { range: '35-44', percentage: 18, count: 2258 },
        { range: '45+', percentage: 5, count: 632 }
      ],
      topCities: [
        { city: 'Dar es Salaam', percentage: 28, count: 3512 },
        { city: 'Nairobi', percentage: 22, count: 2759 },
        { city: 'Kampala', percentage: 15, count: 1881 },
        { city: 'Kigali', percentage: 12, count: 1505 },
        { city: 'Other', percentage: 23, count: 2886 }
      ],
      gender: [
        { gender: 'Female', percentage: 58, count: 7275 },
        { gender: 'Male', percentage: 42, count: 5268 }
      ]
    },
    topPosts: [
      {
        id: 1,
        type: 'photo',
        content: 'Beautiful sunset over Mount Kilimanjaro 🌅',
        thumbnail: '/api/placeholder/300/300',
        metrics: {
          likes: 1234,
          comments: 89,
          shares: 45,
          reach: 5678,
          engagement: 8.2
        },
        publishedAt: '2025-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'reel',
        content: 'Quick tutorial on social media marketing tips',
        thumbnail: '/api/placeholder/300/300',
        metrics: {
          likes: 2156,
          comments: 156,
          shares: 78,
          reach: 12345,
          engagement: 12.4
        },
        publishedAt: '2025-01-12T14:20:00Z'
      },
      {
        id: 3,
        type: 'story',
        content: 'Behind the scenes of our latest campaign',
        thumbnail: '/api/placeholder/300/300',
        metrics: {
          likes: 567,
          comments: 23,
          shares: 12,
          reach: 2345,
          engagement: 6.8
        },
        publishedAt: '2025-01-10T16:45:00Z'
      }
    ],
    insights: [
      {
        title: 'Best Time to Post',
        description: 'Your audience is most active on Tuesday at 2 PM',
        icon: Clock,
        color: 'from-blue-500 to-blue-600',
        value: 'Tuesday 2 PM'
      },
      {
        title: 'Top Hashtag',
        description: '#TanzaniaTech is your most engaging hashtag',
        icon: Target,
        color: 'from-green-500 to-green-600',
        value: '#TanzaniaTech'
      },
      {
        title: 'Growth Rate',
        description: 'You gained 1,234 new followers this month',
        icon: TrendingUp,
        color: 'from-purple-500 to-purple-600',
        value: '+1,234'
      },
      {
        title: 'Engagement Score',
        description: 'Your content performs 23% better than average',
        icon: Award,
        color: 'from-pink-500 to-pink-600',
        value: '8.2/10'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getMetricIcon = (metric) => {
    const icons = {
      followers: Users,
      reach: Eye,
      impressions: BarChart3,
      engagement: Heart,
      likes: Heart,
      comments: MessageCircle,
      shares: Share,
      saves: Bookmark,
      posts: Instagram,
      stories: Zap,
      reels: Play,
      igtv: Video
    };
    return icons[metric] || BarChart3;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderMetricCard = (key, metric, index) => {
    const IconComponent = getMetricIcon(key);
    
    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon(metric.trend)}
            <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatNumber(metric.current)}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </p>
        </div>
      </motion.div>
    );
  };

  const renderAudienceChart = () => (
    <div className="space-y-6">
      {/* Age Groups */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h4>
        <div className="space-y-3">
          {analyticsData.audience.ageGroups.map((group, index) => (
            <motion.div
              key={group.range}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 text-sm font-medium text-gray-600">{group.range}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${group.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                />
              </div>
              <div className="w-20 text-right text-sm font-medium text-gray-900">
                {group.percentage}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gender Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h4>
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.audience.gender.map((item, index) => (
            <motion.div
              key={item.gender}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gray-50 rounded-xl"
            >
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.percentage}%
              </div>
              <div className="text-sm text-gray-600">{item.gender}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Cities */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h4>
        <div className="space-y-2">
          {analyticsData.audience.topCities.map((city, index) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">{city.city}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{city.percentage}%</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${city.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTopPosts = () => (
    <div className="space-y-4">
      {analyticsData.topPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={post.thumbnail} 
                alt="Post thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                {post.type === 'photo' ? '📷' : post.type === 'reel' ? '🎬' : '📱'}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{post.content}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(post.publishedAt).toLocaleDateString()} • {post.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {post.metrics.engagement}%
                  </div>
                  <div className="text-xs text-gray-600">Engagement</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(post.metrics.likes)}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3" />
                    Likes
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(post.metrics.comments)}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Comments
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(post.metrics.shares)}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Share className="w-3 h-3" />
                    Shares
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(post.metrics.reach)}
                  </div>
                  <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    Reach
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderInsights = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {analyticsData.insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="text-lg font-bold text-gray-900">{insight.value}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instagram Analytics</h1>
          <p className="text-gray-600">Track your Instagram performance with detailed insights</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
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

      {/* Metric Tabs */}
      <div className="flex gap-2 mb-8">
        {['overview', 'engagement', 'content', 'audience'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedMetric(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              selectedMetric === tab
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMetric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedMetric === 'overview' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(analyticsData.overview).map(([key, metric], index) =>
                  renderMetricCard(key, metric, index)
                )}
              </div>
              {renderInsights()}
            </div>
          )}

          {selectedMetric === 'engagement' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(analyticsData.engagement).map(([key, metric], index) =>
                  renderMetricCard(key, metric, index)
                )}
              </div>
              {renderTopPosts()}
            </div>
          )}

          {selectedMetric === 'content' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(analyticsData.content).map(([key, metric], index) =>
                  renderMetricCard(key, metric, index)
                )}
              </div>
              {renderTopPosts()}
            </div>
          )}

          {selectedMetric === 'audience' && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  {renderAudienceChart()}
                </div>
                <div className="space-y-6">
                  {renderInsights()}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InstagramAnalytics;