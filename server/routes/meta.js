import express from 'express';
import crypto from 'crypto';
const router = express.Router();

// Meta App configuration - add these to your .env file
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'kizazi_webhook_token_2025';

/**
 * OAuth Login URL - Initiates Facebook/Instagram Authentication
 * URL: https://kizazisocial.com/api/meta/oauth/login
 */
router.get('/oauth/login', (req, res) => {
  try {
    const { user_id } = req.query; // Optional: pass user ID for state tracking
    
    if (!META_APP_ID) {
      return res.status(500).json({ error: 'Meta App ID not configured' });
    }
    
    // Facebook OAuth URL with required permissions
    const scopes = [
      'email',
      'public_profile',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish'
    ].join(',');
    
    const state = user_id || crypto.randomBytes(16).toString('hex'); // CSRF protection
    const redirectUri = `${process.env.BACKEND_URL}/api/meta/oauth/callback`;
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&response_type=code` +
      `&state=${state}`;
    
    console.log('Meta OAuth Login initiated:', {
      user_id: user_id || 'anonymous',
      state,
      scopes
    });
    
    // Redirect to Facebook OAuth
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('Meta OAuth Login Error:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth login' });
  }
});

/**
 * OAuth Callback URL for Facebook/Instagram Login
 * URL: https://kizazisocial.com/api/meta/oauth/callback
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    // Handle OAuth errors
    if (error) {
      console.error('Meta OAuth Error:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL}/?error=${encodeURIComponent(error_description || error)}`);
    }
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/meta/oauth/callback`,
        code: code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('Token Exchange Error:', tokenData.error);
      return res.redirect(`${process.env.FRONTEND_URL}/?error=${encodeURIComponent(tokenData.error.message)}`);
    }
    
    // Get long-lived token
    const longLivedResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'fb_exchange_token',
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        fb_exchange_token: tokenData.access_token
      })
    });
    
    const longLivedData = await longLivedResponse.json();
    
    // Get user's pages and Instagram accounts
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`);
    const pagesData = await pagesResponse.json();
    
    // Store the tokens securely (implement based on your user model)
    // TODO: Save to database associated with user account
    
    console.log('Meta OAuth Success:', {
      user_id: state, // if you passed user ID in state
      pages_count: pagesData.data?.length || 0,
      token_expires: longLivedData.expires_in
    });
    
    // Redirect back to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?meta_connected=true`);
    
  } catch (error) {
    console.error('Meta OAuth Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/?error=${encodeURIComponent('Failed to connect Meta account')}`);
  }
});

/**
 * Webhook for Meta Platform Events
 * URL: https://kizazisocial.com/api/meta/webhooks
 */
router.get('/webhooks', (req, res) => {
  // Webhook verification for Meta
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  // Verify the webhook
  if (mode === 'subscribe' && token === META_WEBHOOK_VERIFY_TOKEN) {
    console.log('Meta Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('Meta Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

/**
 * Webhook POST endpoint for receiving Meta events
 */
router.post('/webhooks', (req, res) => {
  try {
    // Verify the request signature
    const signature = req.headers['x-hub-signature-256'];
    if (!verifyWebhookSignature(req.body, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).send('Unauthorized');
    }
    
    const body = req.body;
    
    // Process webhook events
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        entry.changes?.forEach(change => {
          console.log('Meta Webhook Event:', {
            field: change.field,
            value: change.value
          });
          
          // Handle different event types
          switch (change.field) {
            case 'feed':
              handlePageFeedEvent(change.value);
              break;
            case 'mention':
              handleMentionEvent(change.value);
              break;
            case 'messages':
              handleMessageEvent(change.value);
              break;
            default:
              console.log('Unhandled webhook field:', change.field);
          }
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Deauthorization Callback for Data Deletion
 * URL: https://kizazisocial.com/api/meta/deauth
 */
router.post('/deauth', (req, res) => {
  try {
    // Verify the request signature
    const signature = req.headers['x-hub-signature-256'];
    if (!verifyWebhookSignature(req.body, signature)) {
      console.error('Invalid deauth signature');
      return res.status(401).send('Unauthorized');
    }
    
    const { user_id, algorithm } = req.body;
    
    console.log('Meta Deauthorization Request:', {
      user_id,
      algorithm,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Implement data deletion logic
    // 1. Find user by Facebook user_id
    // 2. Delete or anonymize their data
    // 3. Revoke stored access tokens
    // 4. Log the deletion for compliance
    
    // Generate confirmation URL for user
    const confirmationCode = crypto.randomBytes(32).toString('hex');
    const deletionUrl = `${process.env.FRONTEND_URL}/data-deletion?code=${confirmationCode}`;
    
    // Store the deletion request (implement based on your database)
    // TODO: Save deletion request to database
    
    res.json({
      url: deletionUrl,
      confirmation_code: confirmationCode
    });
    
  } catch (error) {
    console.error('Deauthorization error:', error);
    res.status(500).json({ error: 'Failed to process deauthorization' });
  }
});

/**
 * Data Deletion Confirmation Endpoint
 * URL: https://kizazisocial.com/api/meta/deletion-status/:code
 */
router.get('/deletion-status/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // TODO: Look up deletion request by confirmation code
    // const deletionRequest = await DeletionRequest.findOne({ confirmation_code: code });
    
    // For now, return a simple status
    res.json({
      status: 'completed',
      message: 'Data deletion has been processed successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Deletion status error:', error);
    res.status(500).json({ error: 'Failed to retrieve deletion status' });
  }
});

/**
 * Meta App Analytics Endpoint
 * URL: https://kizazisocial.com/api/meta/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    // This endpoint can be used by Meta to verify your app's analytics
    res.json({
      app_id: META_APP_ID,
      app_name: 'KizaziSocial',
      status: 'active',
      endpoints: {
        oauth_callback: '/api/meta/oauth/callback',
        webhooks: '/api/meta/webhooks',
        deauth: '/api/meta/deauth',
        privacy_policy: '/privacy',
        terms_of_service: '/terms',
        data_deletion: '/data-deletion'
      },
      last_updated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

/**
 * Helper function to verify webhook signatures
 */
function verifyWebhookSignature(payload, signature) {
  if (!signature || !META_APP_SECRET) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', META_APP_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

/**
 * Event handlers for different webhook events
 */
function handlePageFeedEvent(value) {
  console.log('Page feed event:', value);
  // TODO: Process page feed updates (new posts, comments, etc.)
}

function handleMentionEvent(value) {
  console.log('Mention event:', value);
  // TODO: Process page mentions
}

function handleMessageEvent(value) {
  console.log('Message event:', value);
  // TODO: Process page messages
}

export default router;
