import express from 'express';
import axios from 'axios';
// Temporarily use demo auth for development
// import { authenticate } from '../middleware/auth.js';
import { authenticate } from '../middleware/authDemo.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

const router = express.Router();

// Connect social media account
router.post('/connect/:platform', authenticate, async (req, res) => {
  try {
    const { platform } = req.params;
    const { accessToken, accountId, accountName } = req.body;

    if (!['Instagram', 'Facebook', 'X'].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform'
      });
    }

    if (!accessToken || !accountId) {
      return res.status(400).json({
        success: false,
        message: 'Access token and account ID are required'
      });
    }

    // Verify the token with the respective platform
    let isValid = false;
    let accountInfo = {};

    try {
      switch (platform) {
        case 'Facebook':
          const fbResponse = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
          isValid = fbResponse.data.id === accountId;
          accountInfo = fbResponse.data;
          break;
        
        case 'Instagram':
          // Instagram uses Facebook Graph API
          const igResponse = await axios.get(`https://graph.facebook.com/${accountId}?fields=id,username&access_token=${accessToken}`);
          isValid = igResponse.data.id === accountId;
          accountInfo = igResponse.data;
          break;
        
        case 'X':
          // For X (Twitter), you'd use their API v2
          // This is a simplified version - in production, you'd use proper OAuth flow
          isValid = true; // Placeholder - implement proper X API verification
          accountInfo = { id: accountId, name: accountName };
          break;
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid access token or account information'
      });
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Token verification failed'
      });
    }

    // Check if account is already connected
    const existingAccountIndex = req.user.socialAccounts.findIndex(
      account => account.platform === platform && account.accountId === accountId
    );

    const accountData = {
      platform,
      accountId,
      accountName: accountName || accountInfo.name || accountInfo.username,
      accessToken,
      isActive: true,
      connectedAt: new Date()
    };

    if (existingAccountIndex >= 0) {
      // Update existing account
      req.user.socialAccounts[existingAccountIndex] = accountData;
    } else {
      // Add new account
      req.user.socialAccounts.push(accountData);
    }

    await req.user.save();

    res.json({
      success: true,
      message: `${platform} account connected successfully`,
      account: {
        platform,
        accountId,
        accountName: accountData.accountName,
        connectedAt: accountData.connectedAt
      }
    });

  } catch (error) {
    console.error('Connect social media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect social media account'
    });
  }
});

// Disconnect social media account
router.delete('/disconnect/:platform/:accountId', authenticate, async (req, res) => {
  try {
    const { platform, accountId } = req.params;

    const accountIndex = req.user.socialAccounts.findIndex(
      account => account.platform === platform && account.accountId === accountId
    );

    if (accountIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Social media account not found'
      });
    }

    req.user.socialAccounts.splice(accountIndex, 1);
    await req.user.save();

    res.json({
      success: true,
      message: `${platform} account disconnected successfully`
    });

  } catch (error) {
    console.error('Disconnect social media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect social media account'
    });
  }
});

// Get connected accounts
router.get('/accounts', authenticate, async (req, res) => {
  try {
    // For demo mode, return mock accounts if user doesn't have real ones
    if (!req.user.socialAccounts || req.user.socialAccounts.length === 0) {
      // Check if this is a demo user
      if (req.user.email && (req.user.email.includes('demo') || req.user.type === 'demo')) {
        return res.json({
          success: true,
          accounts: [
            {
              id: 'fb_demo_1',
              platform: 'Facebook',
              name: 'Demo Business Page',
              accountId: '123456789',
              followers: 1542,
              accessToken: 'demo_token_fb',
              isActive: true,
              connectedAt: new Date()
            },
            {
              id: 'ig_demo_1', 
              platform: 'Instagram',
              name: '@demo_business',
              accountId: '987654321',
              followers: 3218,
              accessToken: 'demo_token_ig',
              isActive: true,
              connectedAt: new Date()
            }
          ]
        });
      }
    }

    const accounts = req.user.socialAccounts.map(account => ({
      id: `${account.platform.toLowerCase()}_${account.accountId}`,
      platform: account.platform,
      name: account.accountName,
      accountId: account.accountId,
      accountName: account.accountName,
      followers: Math.floor(Math.random() * 5000) + 1000, // Mock follower count
      accessToken: account.accessToken,
      isActive: account.isActive,
      connectedAt: account.connectedAt
    }));

    res.json({
      success: true,
      accounts
    });

  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social media accounts'
    });
  }
});

// Publish post to social media
router.post('/publish/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findOne({
      _id: postId,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Only scheduled posts can be published'
      });
    }

    // Find the connected account for this platform
    const socialAccount = req.user.socialAccounts.find(
      account => account.platform === post.platform && account.isActive
    );

    if (!socialAccount) {
      return res.status(400).json({
        success: false,
        message: `No active ${post.platform} account connected`
      });
    }

    let publishResult = {};

    try {
      switch (post.platform) {
        case 'Facebook':
          publishResult = await publishToFacebook(post, socialAccount);
          break;
        
        case 'Instagram':
          publishResult = await publishToInstagram(post, socialAccount);
          break;
        
        case 'X':
          publishResult = await publishToX(post, socialAccount);
          break;
        
        default:
          throw new Error('Unsupported platform');
      }

      // Update post status
      await post.markAsPublished(publishResult.id);

      res.json({
        success: true,
        message: 'Post published successfully',
        publishResult,
        post: {
          id: post._id,
          status: post.status,
          publishedAt: post.publishedAt,
          socialMediaPostId: post.socialMediaPostId
        }
      });

    } catch (publishError) {
      console.error(`Failed to publish to ${post.platform}:`, publishError);
      
      await post.markAsFailed(publishError.message);
      
      res.status(400).json({
        success: false,
        message: `Failed to publish to ${post.platform}`,
        error: publishError.message
      });
    }

  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish post'
    });
  }
});

// Helper functions for publishing to different platforms
async function publishToFacebook(post, account) {
  const content = post.content + (post.hashtags.length > 0 ? '\n\n' + post.hashtags.join(' ') : '');
  
  const response = await axios.post(
    `https://graph.facebook.com/${account.accountId}/feed`,
    {
      message: content,
      access_token: account.accessToken
    }
  );

  return { id: response.data.id, platform: 'Facebook' };
}

async function publishToInstagram(post, account) {
  // Instagram requires media for posts
  if (!post.media || post.media.length === 0) {
    throw new Error('Instagram posts require media (image or video)');
  }

  const content = post.content + (post.hashtags.length > 0 ? '\n\n' + post.hashtags.join(' ') : '');
  
  // Step 1: Create media container
  const mediaResponse = await axios.post(
    `https://graph.facebook.com/${account.accountId}/media`,
    {
      image_url: post.media[0].url,
      caption: content,
      access_token: account.accessToken
    }
  );

  // Step 2: Publish the media
  const publishResponse = await axios.post(
    `https://graph.facebook.com/${account.accountId}/media_publish`,
    {
      creation_id: mediaResponse.data.id,
      access_token: account.accessToken
    }
  );

  return { id: publishResponse.data.id, platform: 'Instagram' };
}

async function publishToX(post, account) {
  // This is a simplified version - in production, you'd use proper X API v2
  // For now, we'll simulate the publication
  
  const content = post.content + (post.hashtags.length > 0 ? ' ' + post.hashtags.join(' ') : '');
  
  if (content.length > 280) {
    throw new Error('Tweet content exceeds 280 characters');
  }

  // In a real implementation, you'd use the X API
  // const response = await axios.post('https://api.twitter.com/2/tweets', {
  //   text: content
  // }, {
  //   headers: {
  //     'Authorization': `Bearer ${account.accessToken}`,
  //     'Content-Type': 'application/json'
  //   }
  // });

  // For now, return a simulated response
  return { 
    id: `simulated_x_${Date.now()}`, 
    platform: 'X',
    note: 'This is a simulated publication - integrate with X API for real publishing'
  };
}

// Fetch post analytics from social media platforms
router.get('/analytics/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findOne({
      _id: postId,
      user: req.user._id,
      status: 'published'
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Published post not found'
      });
    }

    const socialAccount = req.user.socialAccounts.find(
      account => account.platform === post.platform && account.isActive
    );

    if (!socialAccount) {
      return res.status(400).json({
        success: false,
        message: `No active ${post.platform} account connected`
      });
    }

    let analytics = {};

    try {
      switch (post.platform) {
        case 'Facebook':
          analytics = await fetchFacebookAnalytics(post, socialAccount);
          break;
        
        case 'Instagram':
          analytics = await fetchInstagramAnalytics(post, socialAccount);
          break;
        
        case 'X':
          analytics = await fetchXAnalytics(post, socialAccount);
          break;
      }

      // Update post analytics
      await post.updateAnalytics(analytics);

      res.json({
        success: true,
        analytics
      });

    } catch (analyticsError) {
      console.error(`Failed to fetch analytics from ${post.platform}:`, analyticsError);
      res.status(400).json({
        success: false,
        message: `Failed to fetch analytics from ${post.platform}`,
        error: analyticsError.message
      });
    }

  } catch (error) {
    console.error('Fetch analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post analytics'
    });
  }
});

// Helper functions for fetching analytics
async function fetchFacebookAnalytics(post, account) {
  const response = await axios.get(
    `https://graph.facebook.com/${post.socialMediaPostId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${account.accessToken}`
  );

  return {
    likes: response.data.likes?.summary?.total_count || 0,
    comments: response.data.comments?.summary?.total_count || 0,
    shares: response.data.shares?.count || 0,
    reach: 0, // Requires additional API call with proper permissions
    impressions: 0 // Requires additional API call with proper permissions
  };
}

async function fetchInstagramAnalytics(post, account) {
  const response = await axios.get(
    `https://graph.facebook.com/${post.socialMediaPostId}?fields=like_count,comments_count&access_token=${account.accessToken}`
  );

  return {
    likes: response.data.like_count || 0,
    comments: response.data.comments_count || 0,
    shares: 0, // Instagram doesn't have traditional shares
    reach: 0, // Requires Instagram Business account and proper permissions
    impressions: 0 // Requires Instagram Business account and proper permissions
  };
}

async function fetchXAnalytics(post, account) {
  // Simulated analytics - integrate with X API for real data
  return {
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 20),
    shares: Math.floor(Math.random() * 10),
    reach: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 2000)
  };
}

// Bulk update analytics for all published posts
router.post('/sync-analytics', authenticate, async (req, res) => {
  try {
    const publishedPosts = await Post.find({
      user: req.user._id,
      status: 'published',
      socialMediaPostId: { $exists: true }
    }).limit(50); // Limit to avoid rate limits

    let updated = 0;
    let failed = 0;

    for (const post of publishedPosts) {
      try {
        const socialAccount = req.user.socialAccounts.find(
          account => account.platform === post.platform && account.isActive
        );

        if (!socialAccount) continue;

        let analytics = {};
        
        switch (post.platform) {
          case 'Facebook':
            analytics = await fetchFacebookAnalytics(post, socialAccount);
            break;
          case 'Instagram':
            analytics = await fetchInstagramAnalytics(post, socialAccount);
            break;
          case 'X':
            analytics = await fetchXAnalytics(post, socialAccount);
            break;
        }

        await post.updateAnalytics(analytics);
        updated++;
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to sync analytics for post ${post._id}:`, error);
        failed++;
      }
    }

    res.json({
      success: true,
      message: 'Analytics sync completed',
      results: {
        updated,
        failed,
        total: publishedPosts.length
      }
    });

  } catch (error) {
    console.error('Sync analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync analytics'
    });
  }
});

export default router;