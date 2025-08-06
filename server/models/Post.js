import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Facebook', 'X'],
    required: [true, 'Platform is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2200, 'Content cannot exceed 2200 characters']
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: String,
    size: Number,
    format: String
  }],
  hashtags: [String],
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed', 'cancelled'],
    default: 'scheduled'
  },
  publishedAt: Date,
  socialMediaPostId: String, // ID from the social media platform
  analytics: {
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    },
    clickThroughRate: {
      type: Number,
      default: 0
    },
    lastUpdated: Date
  },
  aiGenerated: {
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    prompt: String,
    generatedAt: Date
  },
  retryCount: {
    type: Number,
    default: 0
  },
  lastError: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ user: 1, scheduledDate: 1 });
postSchema.index({ status: 1, scheduledDate: 1 });
postSchema.index({ platform: 1, scheduledDate: 1 });

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  if (this.analytics.impressions === 0) return 0;
  return ((this.analytics.likes + this.analytics.comments + this.analytics.shares) / this.analytics.impressions) * 100;
});

// Methods
postSchema.methods.updateAnalytics = function(analyticsData) {
  this.analytics = { ...this.analytics, ...analyticsData, lastUpdated: new Date() };
  return this.save();
};

postSchema.methods.markAsPublished = function(socialMediaPostId) {
  this.status = 'published';
  this.publishedAt = new Date();
  this.socialMediaPostId = socialMediaPostId;
  return this.save();
};

postSchema.methods.markAsFailed = function(error) {
  this.status = 'failed';
  this.lastError = error;
  this.retryCount += 1;
  return this.save();
};

const Post = mongoose.model('Post', postSchema);
export default Post;