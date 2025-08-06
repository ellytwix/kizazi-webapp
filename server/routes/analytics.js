import express from 'express';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics summary
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Basic stats
    const totalPosts = await Post.countDocuments({ 
      user: req.user._id,
      createdAt: { $gte: startDate }
    });
    
    const scheduledPosts = await Post.countDocuments({ 
      user: req.user._id, 
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    });
    
    const publishedPosts = await Post.countDocuments({ 
      user: req.user._id, 
      status: 'published',
      publishedAt: { $gte: startDate }
    });

    // Engagement analytics
    const engagementData = await Post.aggregate([
      {
        $match: { 
          user: req.user._id,
          status: 'published',
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$analytics.likes' },
          totalComments: { $sum: '$analytics.comments' },
          totalShares: { $sum: '$analytics.shares' },
          totalReach: { $sum: '$analytics.reach' },
          totalImpressions: { $sum: '$analytics.impressions' },
          avgEngagement: { $avg: '$analytics.engagement' }
        }
      }
    ]);

    const engagement = engagementData[0] || {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalReach: 0,
      totalImpressions: 0,
      avgEngagement: 0
    };

    // Platform breakdown
    const platformStats = await Post.aggregate([
      {
        $match: { 
          user: req.user._id,
          status: 'published',
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
          totalLikes: { $sum: '$analytics.likes' },
          totalComments: { $sum: '$analytics.comments' },
          totalShares: { $sum: '$analytics.shares' },
          totalReach: { $sum: '$analytics.reach' }
        }
      }
    ]);

    // Growth rate calculation (comparing with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysBack);
    
    const previousPeriodFollowers = await Post.aggregate([
      {
        $match: { 
          user: req.user._id,
          status: 'published',
          publishedAt: { $gte: previousPeriodStart, $lt: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalReach: { $sum: '$analytics.reach' }
        }
      }
    ]);

    const previousReach = previousPeriodFollowers[0]?.totalReach || 0;
    const growthRate = previousReach > 0 
      ? ((engagement.totalReach - previousReach) / previousReach * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      analytics: {
        overview: {
          totalPosts,
          scheduledPosts,
          publishedPosts,
          period: `${daysBack} days`
        },
        engagement: {
          likes: engagement.totalLikes,
          comments: engagement.totalComments,
          shares: engagement.totalShares,
          reach: engagement.totalReach,
          impressions: engagement.totalImpressions,
          engagementRate: engagement.avgEngagement.toFixed(2),
          growthRate: parseFloat(growthRate)
        },
        platforms: platformStats.map(platform => ({
          name: platform._id,
          posts: platform.count,
          likes: platform.totalLikes,
          comments: platform.totalComments,
          shares: platform.totalShares,
          reach: platform.totalReach
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics'
    });
  }
});

// Get detailed post performance
router.get('/posts/performance', authenticate, async (req, res) => {
  try {
    const { 
      platform, 
      limit = 20, 
      sortBy = 'engagement',
      period = '30' 
    } = req.query;

    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const matchQuery = {
      user: req.user._id,
      status: 'published',
      publishedAt: { $gte: startDate }
    };

    if (platform) {
      matchQuery.platform = platform;
    }

    const sortOptions = {
      engagement: { 'analytics.engagement': -1 },
      likes: { 'analytics.likes': -1 },
      comments: { 'analytics.comments': -1 },
      reach: { 'analytics.reach': -1 },
      recent: { publishedAt: -1 }
    };

    const posts = await Post.find(matchQuery)
      .sort(sortOptions[sortBy] || sortOptions.engagement)
      .limit(parseInt(limit))
      .select('content platform publishedAt analytics');

    const topPosts = posts.map(post => ({
      id: post._id,
      content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      platform: post.platform,
      publishedAt: post.publishedAt,
      analytics: post.analytics,
      engagementRate: post.engagementRate
    }));

    res.json({
      success: true,
      posts: topPosts,
      sortBy,
      period: `${daysBack} days`
    });

  } catch (error) {
    console.error('Post performance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post performance data'
    });
  }
});

// Get engagement trends over time
router.get('/trends', authenticate, async (req, res) => {
  try {
    const { period = '30', granularity = 'daily' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Group by day or week based on granularity
    const groupFormat = granularity === 'weekly' 
      ? { $dateToString: { format: "%Y-%U", date: "$publishedAt" } }
      : { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" } };

    const trends = await Post.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
          publishedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupFormat,
          posts: { $sum: 1 },
          totalLikes: { $sum: '$analytics.likes' },
          totalComments: { $sum: '$analytics.comments' },
          totalShares: { $sum: '$analytics.shares' },
          totalReach: { $sum: '$analytics.reach' },
          avgEngagement: { $avg: '$analytics.engagement' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      trends: trends.map(trend => ({
        date: trend._id,
        posts: trend.posts,
        likes: trend.totalLikes,
        comments: trend.totalComments,
        shares: trend.totalShares,
        reach: trend.totalReach,
        engagement: parseFloat(trend.avgEngagement.toFixed(2))
      })),
      period: `${daysBack} days`,
      granularity
    });

  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trends data'
    });
  }
});

// Get best posting times analysis
router.get('/best-times', authenticate, async (req, res) => {
  try {
    const { platform, period = '90' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const matchQuery = {
      user: req.user._id,
      status: 'published',
      publishedAt: { $gte: startDate }
    };

    if (platform) {
      matchQuery.platform = platform;
    }

    const timeAnalysis = await Post.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            hour: { $hour: '$publishedAt' },
            dayOfWeek: { $dayOfWeek: '$publishedAt' }
          },
          posts: { $sum: 1 },
          avgLikes: { $avg: '$analytics.likes' },
          avgComments: { $avg: '$analytics.comments' },
          avgEngagement: { $avg: '$analytics.engagement' }
        }
      },
      {
        $sort: { avgEngagement: -1 }
      }
    ]);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const bestTimes = timeAnalysis.map(time => ({
      hour: time._id.hour,
      dayOfWeek: dayNames[time._id.dayOfWeek - 1],
      posts: time.posts,
      avgLikes: parseFloat(time.avgLikes.toFixed(1)),
      avgComments: parseFloat(time.avgComments.toFixed(1)),
      avgEngagement: parseFloat(time.avgEngagement.toFixed(2))
    }));

    res.json({
      success: true,
      bestTimes: bestTimes.slice(0, 10), // Top 10 best times
      period: `${daysBack} days`,
      platform: platform || 'all'
    });

  } catch (error) {
    console.error('Best times analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch best times analysis'
    });
  }
});

// Get hashtag performance
router.get('/hashtags', authenticate, async (req, res) => {
  try {
    const { limit = 20, period = '30' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const hashtagAnalysis = await Post.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
          publishedAt: { $gte: startDate },
          hashtags: { $exists: true, $ne: [] }
        }
      },
      { $unwind: '$hashtags' },
      {
        $group: {
          _id: '$hashtags',
          usage: { $sum: 1 },
          avgLikes: { $avg: '$analytics.likes' },
          avgComments: { $avg: '$analytics.comments' },
          avgEngagement: { $avg: '$analytics.engagement' },
          totalReach: { $sum: '$analytics.reach' }
        }
      },
      {
        $sort: { avgEngagement: -1 }
      },
      { $limit: parseInt(limit) }
    ]);

    const topHashtags = hashtagAnalysis.map(hashtag => ({
      tag: hashtag._id,
      usage: hashtag.usage,
      avgLikes: parseFloat(hashtag.avgLikes.toFixed(1)),
      avgComments: parseFloat(hashtag.avgComments.toFixed(1)),
      avgEngagement: parseFloat(hashtag.avgEngagement.toFixed(2)),
      totalReach: hashtag.totalReach
    }));

    res.json({
      success: true,
      hashtags: topHashtags,
      period: `${daysBack} days`
    });

  } catch (error) {
    console.error('Hashtag analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hashtag performance'
    });
  }
});

// Export analytics data
router.get('/export', authenticate, async (req, res) => {
  try {
    const { format = 'json', period = '30' } = req.query;
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const posts = await Post.find({
      user: req.user._id,
      status: 'published',
      publishedAt: { $gte: startDate }
    }).select('content platform publishedAt analytics hashtags');

    const exportData = posts.map(post => ({
      id: post._id,
      content: post.content,
      platform: post.platform,
      publishedAt: post.publishedAt,
      hashtags: post.hashtags,
      likes: post.analytics.likes,
      comments: post.analytics.comments,
      shares: post.analytics.shares,
      reach: post.analytics.reach,
      impressions: post.analytics.impressions,
      engagement: post.analytics.engagement
    }));

    if (format === 'csv') {
      // Convert to CSV format
      const headers = Object.keys(exportData[0] || {}).join(',');
      const rows = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="kizazi-analytics-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else {
      res.json({
        success: true,
        data: exportData,
        exportedAt: new Date().toISOString(),
        period: `${daysBack} days`,
        totalRecords: exportData.length
      });
    }

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics data'
    });
  }
});

export default router;