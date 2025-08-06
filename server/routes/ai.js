import express from 'express';
import OpenAI from 'openai';
import { authenticate, verifyPlan } from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = express.Router();

// Initialize OpenAI (with fallback for development)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Generate social media content using AI
router.post('/generate-content', authenticate, verifyPlan('pro'), async (req, res) => {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please contact administrator.',
        note: 'OpenAI API key is required for this feature'
      });
    }

    const { prompt, platform = 'Instagram', tone = 'engaging', language = 'en' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    // Platform-specific character limits and guidelines
    const platformLimits = {
      'Instagram': { maxLength: 2200, hashtagLimit: 30 },
      'Facebook': { maxLength: 63206, hashtagLimit: 10 },
      'X': { maxLength: 280, hashtagLimit: 5 }
    };

    const limit = platformLimits[platform];
    
    // Tone mapping
    const toneDescriptions = {
      professional: 'professional and formal',
      casual: 'casual and friendly',
      engaging: 'engaging and enthusiastic',
      informative: 'informative and educational',
      funny: 'humorous and entertaining'
    };

    // Language mapping for prompts
    const languageInstructions = {
      en: 'in English',
      sw: 'in Swahili',
      fr: 'in French',
      ar: 'in Arabic',
      pt: 'in Portuguese'
    };

    const systemPrompt = `You are a professional social media content creator specializing in ${platform} posts. 
Create engaging content that is ${toneDescriptions[tone]} and follows ${platform}'s best practices.
Keep the main content under ${limit.maxLength} characters.
Generate content ${languageInstructions[language]}.
Focus on African markets and culture when relevant.
Always include relevant hashtags (maximum ${limit.hashtagLimit}) that are popular and relevant.`;

    const userPrompt = `Create a ${platform} post about: ${prompt}

Please provide:
1. Main caption/content
2. Relevant hashtags (${limit.hashtagLimit} maximum)
3. Brief explanation of the content strategy

Make it suitable for African audiences and include cultural relevance where appropriate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Parse the response to extract caption and hashtags
    const lines = aiResponse.split('\n').filter(line => line.trim());
    let caption = '';
    let hashtags = [];
    let strategy = '';
    
    let currentSection = '';
    
    for (const line of lines) {
      if (line.toLowerCase().includes('caption') || line.toLowerCase().includes('content')) {
        currentSection = 'caption';
        continue;
      } else if (line.toLowerCase().includes('hashtag')) {
        currentSection = 'hashtags';
        continue;
      } else if (line.toLowerCase().includes('strategy') || line.toLowerCase().includes('explanation')) {
        currentSection = 'strategy';
        continue;
      }
      
      if (currentSection === 'caption' && line.trim()) {
        caption += line.trim() + ' ';
      } else if (currentSection === 'hashtags' && line.includes('#')) {
        const extractedHashtags = line.match(/#\w+/g);
        if (extractedHashtags) {
          hashtags.push(...extractedHashtags);
        }
      } else if (currentSection === 'strategy' && line.trim()) {
        strategy += line.trim() + ' ';
      }
    }

    // Fallback: if parsing fails, use the whole response as caption
    if (!caption.trim()) {
      caption = aiResponse;
      // Extract hashtags from the full response
      const hashtagMatches = aiResponse.match(/#\w+/g);
      if (hashtagMatches) {
        hashtags = hashtagMatches.slice(0, limit.hashtagLimit);
      }
    }

    // Clean up and limit hashtags
    hashtags = [...new Set(hashtags)].slice(0, limit.hashtagLimit);
    
    // Remove hashtags from caption if they're included
    hashtags.forEach(tag => {
      caption = caption.replace(tag, '').trim();
    });

    caption = caption.trim();
    strategy = strategy.trim();

    // Ensure caption is within platform limits
    if (caption.length > limit.maxLength) {
      caption = caption.substring(0, limit.maxLength - 3) + '...';
    }

    const generatedContent = {
      caption: caption,
      hashtags: hashtags,
      platform: platform,
      strategy: strategy || 'AI-generated content optimized for engagement',
      characterCount: caption.length,
      hashtagCount: hashtags.length,
      generatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Content generated successfully',
      content: generatedContent,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      }
    });

  } catch (error) {
    console.error('AI content generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        message: 'AI service quota exceeded. Please try again later.'
      });
    }
    
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Generate hashtags for existing content
router.post('/generate-hashtags', authenticate, async (req, res) => {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please contact administrator.',
        note: 'OpenAI API key is required for this feature'
      });
    }

    const { content, platform = 'Instagram', niche } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const platformLimits = {
      'Instagram': 30,
      'Facebook': 10,
      'X': 5
    };

    const hashtagLimit = platformLimits[platform];

    const prompt = `Generate relevant hashtags for this ${platform} post content: "${content}"
    
${niche ? `The content is related to: ${niche}` : ''}

Please provide ${hashtagLimit} highly relevant hashtags that will help with discoverability.
Focus on:
- Popular and trending hashtags
- Niche-specific hashtags
- Location-based hashtags for Africa/Kenya when relevant
- Mix of broad and specific hashtags

Return only the hashtags, one per line, starting with #`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    const hashtags = response.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('#'))
      .slice(0, hashtagLimit);

    res.json({
      success: true,
      message: 'Hashtags generated successfully',
      hashtags,
      platform,
      count: hashtags.length
    });

  } catch (error) {
    console.error('Hashtag generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate hashtags'
    });
  }
});

// Improve existing content
router.post('/improve-content', authenticate, verifyPlan('pro'), async (req, res) => {
  try {
    // Check if OpenAI is configured
    if (!openai) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please contact administrator.',
        note: 'OpenAI API key is required for this feature'
      });
    }

    const { content, platform = 'Instagram', improvementType = 'engagement' } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const improvementTypes = {
      engagement: 'more engaging and likely to get likes, comments, and shares',
      clarity: 'clearer and easier to understand',
      professional: 'more professional and polished',
      concise: 'more concise while maintaining the key message',
      emotional: 'more emotionally compelling and relatable'
    };

    const prompt = `Please improve this ${platform} post to make it ${improvementTypes[improvementType]}:

"${content}"

Keep the core message but enhance it for better performance on ${platform}. 
Consider African audience preferences and cultural context.
Maintain authenticity while optimizing for social media success.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const improvedContent = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      message: 'Content improved successfully',
      original: content,
      improved: improvedContent,
      improvementType,
      platform
    });

  } catch (error) {
    console.error('Content improvement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to improve content'
    });
  }
});

// Get AI usage statistics
router.get('/usage-stats', authenticate, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const aiGeneratedPosts = await Post.countDocuments({
      user: req.user._id,
      'aiGenerated.isAiGenerated': true,
      createdAt: { $gte: currentMonth, $lt: nextMonth }
    });

    // In a real implementation, you'd track API calls in a separate collection
    const monthlyLimit = req.user.plan === 'pro' ? 100 : req.user.plan === 'enterprise' ? 500 : 10;

    res.json({
      success: true,
      usage: {
        monthlyGenerations: aiGeneratedPosts,
        monthlyLimit,
        remaining: Math.max(0, monthlyLimit - aiGeneratedPosts),
        plan: req.user.plan
      }
    });

  } catch (error) {
    console.error('AI usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage statistics'
    });
  }
});

export default router;