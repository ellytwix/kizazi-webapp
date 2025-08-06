import cron from 'node-cron';
import Post from '../models/Post.js';
import User from '../models/User.js';
import axios from 'axios';

class PostSchedulerService {
  constructor() {
    this.isRunning = false;
    this.maxRetries = 3;
  }

  start() {
    if (this.isRunning) {
      console.log('📅 Post scheduler is already running');
      return;
    }

    // Run every minute to check for posts to publish
    cron.schedule('* * * * *', async () => {
      await this.checkAndPublishPosts();
    });

    // Run analytics sync every hour
    cron.schedule('0 * * * *', async () => {
      await this.syncAnalytics();
    });

    this.isRunning = true;
    console.log('📅 Post scheduler started successfully');
  }

  async checkAndPublishPosts() {
    try {
      const now = new Date();
      
      // Find posts that should be published now
      const postsToPublish = await Post.find({
        status: 'scheduled',
        scheduledDate: { $lte: now },
        retryCount: { $lt: this.maxRetries }
      }).populate('user');

      console.log(`📋 Found ${postsToPublish.length} posts to publish`);

      for (const post of postsToPublish) {
        try {
          await this.publishPost(post);
        } catch (error) {
          console.error(`❌ Failed to publish post ${post._id}:`, error);
          await this.handlePublishError(post, error);
        }
      }
    } catch (error) {
      console.error('📅 Scheduler error:', error);
    }
  }

  async publishPost(post) {
    const user = post.user;
    
    // Find the connected social account
    const socialAccount = user.socialAccounts.find(
      account => account.platform === post.platform && account.isActive
    );

    if (!socialAccount) {
      throw new Error(`No active ${post.platform} account connected for user ${user._id}`);
    }

    let publishResult = {};

    switch (post.platform) {
      case 'Facebook':
        publishResult = await this.publishToFacebook(post, socialAccount);
        break;
      
      case 'Instagram':
        publishResult = await this.publishToInstagram(post, socialAccount);
        break;
      
      case 'X':
        publishResult = await this.publishToX(post, socialAccount);
        break;
      
      default:
        throw new Error(`Unsupported platform: ${post.platform}`);
    }

    // Mark post as published
    await post.markAsPublished(publishResult.id);
    
    console.log(`✅ Published post ${post._id} to ${post.platform}: ${publishResult.id}`);
    
    return publishResult;
  }

  async publishToFacebook(post, account) {
    const content = post.content + (post.hashtags.length > 0 ? '\n\n' + post.hashtags.join(' ') : '');
    
    const requestData = {
      message: content,
      access_token: account.accessToken
    };

    // Add media if present
    if (post.media && post.media.length > 0) {
      requestData.link = post.media[0].url;
    }

    const response = await axios.post(
      `https://graph.facebook.com/${account.accountId}/feed`,
      requestData
    );

    return { id: response.data.id, platform: 'Facebook' };
  }

  async publishToInstagram(post, account) {
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

  async publishToX(post, account) {
    const content = post.content + (post.hashtags.length > 0 ? ' ' + post.hashtags.join(' ') : '');
    
    if (content.length > 280) {
      throw new Error('Tweet content exceeds 280 characters');
    }

    // For production, implement proper X API v2 integration
    // This is a placeholder implementation
    console.log(`📱 Would publish to X: ${content.substring(0, 50)}...`);
    
    return { 
      id: `simulated_x_${Date.now()}`, 
      platform: 'X',
      note: 'Simulated publication - integrate with X API for real publishing'
    };
  }

  async handlePublishError(post, error) {
    post.retryCount += 1;
    post.lastError = error.message;

    if (post.retryCount >= this.maxRetries) {
      post.status = 'failed';
      console.error(`❌ Post ${post._id} failed after ${this.maxRetries} attempts: ${error.message}`);
    } else {
      // Schedule retry in 5 minutes
      post.scheduledDate = new Date(Date.now() + 5 * 60 * 1000);
      console.log(`🔄 Retrying post ${post._id} in 5 minutes (attempt ${post.retryCount}/${this.maxRetries})`);
    }

    await post.save();
  }

  async syncAnalytics() {
    try {
      console.log('📊 Starting analytics sync...');
      
      // Get posts published in the last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const postsToSync = await Post.find({
        status: 'published',
        publishedAt: { $gte: weekAgo },
        socialMediaPostId: { $exists: true }
      }).populate('user').limit(100);

      let synced = 0;
      let failed = 0;

      for (const post of postsToSync) {
        try {
          const socialAccount = post.user.socialAccounts.find(
            account => account.platform === post.platform && account.isActive
          );

          if (!socialAccount) continue;

          let analytics = {};
          
          switch (post.platform) {
            case 'Facebook':
              analytics = await this.fetchFacebookAnalytics(post, socialAccount);
              break;
            case 'Instagram':
              analytics = await this.fetchInstagramAnalytics(post, socialAccount);
              break;
            case 'X':
              analytics = await this.fetchXAnalytics(post, socialAccount);
              break;
          }

          await post.updateAnalytics(analytics);
          synced++;
          
          // Respect rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Failed to sync analytics for post ${post._id}:`, error);
          failed++;
        }
      }

      console.log(`📊 Analytics sync completed: ${synced} synced, ${failed} failed`);
      
    } catch (error) {
      console.error('📊 Analytics sync error:', error);
    }
  }

  async fetchFacebookAnalytics(post, account) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${post.socialMediaPostId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${account.accessToken}`
      );

      return {
        likes: response.data.likes?.summary?.total_count || 0,
        comments: response.data.comments?.summary?.total_count || 0,
        shares: response.data.shares?.count || 0,
        reach: 0,
        impressions: 0,
        engagement: (response.data.likes?.summary?.total_count || 0) + (response.data.comments?.summary?.total_count || 0) + (response.data.shares?.count || 0)
      };
    } catch (error) {
      console.error('Failed to fetch Facebook analytics:', error);
      return {};
    }
  }

  async fetchInstagramAnalytics(post, account) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${post.socialMediaPostId}?fields=like_count,comments_count&access_token=${account.accessToken}`
      );

      return {
        likes: response.data.like_count || 0,
        comments: response.data.comments_count || 0,
        shares: 0,
        reach: 0,
        impressions: 0,
        engagement: (response.data.like_count || 0) + (response.data.comments_count || 0)
      };
    } catch (error) {
      console.error('Failed to fetch Instagram analytics:', error);
      return {};
    }
  }

  async fetchXAnalytics(post, account) {
    // Simulated analytics for X - implement real API integration
    return {
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10),
      reach: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 2000),
      engagement: Math.floor(Math.random() * 80)
    };
  }

  stop() {
    this.isRunning = false;
    console.log('📅 Post scheduler stopped');
  }
}

export default PostSchedulerService;