import express from 'express';
import Post from '../models/Post.js';
// Temporarily use demo auth for development
// import { authenticate, verifyPlan } from '../middleware/auth.js';
import { authenticate } from '../middleware/authDemo.js';

// Mock verifyPlan for demo
const verifyPlan = (req, res, next) => {
  req.user.plan = 'pro'; // Give everyone pro access for demo
  next();
};

const router = express.Router();

// Get all posts for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      platform,
      startDate,
      endDate
    } = req.query;

    const query = { user: req.user._id };

    // Add filters
    if (status) query.status = status;
    if (platform) query.platform = platform;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    const posts = await Post.find(query)
      .sort({ scheduledDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

// Get a single post
router.get('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
});

// Create a new post
router.post('/', authenticate, async (req, res) => {
  try {
    const { platform, content, scheduledDate, media, hashtags } = req.body;

    // Validation
    if (!platform || !content || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Platform, content, and scheduled date are required'
      });
    }

    // Check if scheduled date is in the future
    if (new Date(scheduledDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date must be in the future'
      });
    }

    // Check plan limits
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const monthlyPosts = await Post.countDocuments({
      user: req.user._id,
      createdAt: { $gte: currentMonth, $lt: nextMonth }
    });

    const planLimits = {
      starter: 15,
      pro: Infinity,
      enterprise: Infinity
    };

    if (monthlyPosts >= planLimits[req.user.plan]) {
      return res.status(403).json({
        success: false,
        message: `Monthly post limit reached for ${req.user.plan} plan`
      });
    }

    const post = new Post({
      user: req.user._id,
      platform,
      content,
      scheduledDate: new Date(scheduledDate),
      media: media || [],
      hashtags: hashtags || []
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// Update a post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Don't allow updates to published posts
    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update published posts'
      });
    }

    const updates = {};
    const allowedUpdates = ['platform', 'content', 'scheduledDate', 'media', 'hashtags'];
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate scheduled date if being updated
    if (updates.scheduledDate && new Date(updates.scheduledDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled date must be in the future'
      });
    }

    Object.assign(post, updates);
    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post'
    });
  }
});

// Delete a post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Don't allow deletion of published posts (only cancellation)
    if (post.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete published posts. You can only cancel scheduled posts.'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
});

// Get upcoming posts (next 7 days)
router.get('/upcoming/week', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const posts = await Post.find({
      user: req.user._id,
      status: 'scheduled',
      scheduledDate: {
        $gte: now,
        $lte: nextWeek
      }
    })
    .sort({ scheduledDate: 1 })
    .limit(10);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Get upcoming posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming posts'
    });
  }
});

// Get posts analytics summary
router.get('/analytics/summary', authenticate, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({ user: req.user._id });
    const scheduledPosts = await Post.countDocuments({ 
      user: req.user._id, 
      status: 'scheduled' 
    });
    const publishedPosts = await Post.countDocuments({ 
      user: req.user._id, 
      status: 'published' 
    });

    // Get engagement stats for published posts
    const engagementStats = await Post.aggregate([
      { $match: { user: req.user._id, status: 'published' } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$analytics.likes' },
          totalComments: { $sum: '$analytics.comments' },
          totalShares: { $sum: '$analytics.shares' },
          totalReach: { $sum: '$analytics.reach' },
          totalImpressions: { $sum: '$analytics.impressions' }
        }
      }
    ]);

    const stats = engagementStats[0] || {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalReach: 0,
      totalImpressions: 0
    };

    res.json({
      success: true,
      summary: {
        totalPosts,
        scheduledPosts,
        publishedPosts,
        engagement: {
          likes: stats.totalLikes,
          comments: stats.totalComments,
          shares: stats.totalShares,
          reach: stats.totalReach,
          impressions: stats.totalImpressions,
          totalEngagement: stats.totalLikes + stats.totalComments + stats.totalShares
        }
      }
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary'
    });
  }
});

export default router;