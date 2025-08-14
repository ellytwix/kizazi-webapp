# Meta API Callback URLs Setup Guide

## Required Callback URLs for Meta Developer App

### 1. OAuth Redirect URI
**URL**: `https://kizazisocial.com/api/meta/oauth/callback`
**Purpose**: Handles Facebook/Instagram login authentication
**Configure in**: Meta Developer App → App Settings → Basic → App Domains

### 2. Webhook URL
**URL**: `https://kizazisocial.com/api/meta/webhooks`
**Purpose**: Receives real-time updates from Facebook/Instagram
**Configure in**: Meta Developer App → Products → Webhooks

### 3. Deauthorization Callback
**URL**: `https://kizazisocial.com/api/meta/deauth`
**Purpose**: Handles user data deletion requests
**Configure in**: Meta Developer App → App Settings → Basic → Data Deletion Instructions URL

### 4. Privacy Policy URL
**URL**: `https://kizazisocial.com/privacy`
**Purpose**: Required for app review
**Configure in**: Meta Developer App → App Settings → Basic → Privacy Policy URL

### 5. Terms of Service URL
**URL**: `https://kizazisocial.com/terms`
**Purpose**: Required for app review
**Configure in**: Meta Developer App → App Settings → Basic → Terms of Service URL

## Environment Variables Required

Add these to your server/.env file:

```env
# Meta API Configuration
META_APP_ID=your_facebook_app_id_here
META_APP_SECRET=your_facebook_app_secret_here
META_WEBHOOK_VERIFY_TOKEN=kizazi_webhook_token_2025

# Server URLs
BACKEND_URL=https://kizazisocial.com
FRONTEND_URL=https://kizazisocial.com
```

## Meta Developer App Configuration Steps

### Step 1: Basic Settings
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Select your app → Settings → Basic
3. Add these URLs:
   - **App Domains**: `kizazisocial.com`
   - **Privacy Policy URL**: `https://kizazisocial.com/privacy`
   - **Terms of Service URL**: `https://kizazisocial.com/terms`
   - **Data Deletion Instructions URL**: `https://kizazisocial.com/api/meta/deauth`

### Step 2: Facebook Login Product
1. Add Facebook Login product to your app
2. Go to Facebook Login → Settings
3. Add Valid OAuth Redirect URIs:
   - `https://kizazisocial.com/api/meta/oauth/callback`
   - `https://kizazisocial.com/dashboard` (for frontend redirects)

### Step 3: Instagram Basic Display (if using)
1. Add Instagram Basic Display product
2. Configure redirect URIs same as Facebook Login

### Step 4: Webhooks Configuration
1. Add Webhooks product to your app
2. Create a webhook subscription:
   - **Callback URL**: `https://kizazisocial.com/api/meta/webhooks`
   - **Verify Token**: `kizazi_webhook_token_2025`
   - **Fields**: Select the events you want to receive

### Step 5: Permissions to Request
For social media management, request these permissions:
- `pages_manage_posts`
- `pages_read_engagement`
- `pages_show_list`
- `instagram_basic`
- `instagram_content_publish`
- `publish_video` (if posting videos)

## Testing the Callbacks

### Test OAuth Callback
```bash
# Visit this URL to test Facebook login
https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=https://kizazisocial.com/api/meta/oauth/callback&scope=pages_manage_posts,pages_read_engagement,pages_show_list&response_type=code
```

### Test Webhook
```bash
# Meta will call this during setup
GET https://kizazisocial.com/api/meta/webhooks?hub.mode=subscribe&hub.challenge=CHALLENGE_STRING&hub.verify_token=kizazi_webhook_token_2025
```

### Test Analytics Endpoint
```bash
curl https://kizazisocial.com/api/meta/analytics
```

## Security Considerations

1. **HTTPS Required**: All callback URLs must use HTTPS
2. **Signature Verification**: Webhook payloads are signed and verified
3. **Environment Variables**: Keep API secrets secure in environment variables
4. **Rate Limiting**: Implement rate limiting for public endpoints
5. **Error Handling**: Proper error responses for all scenarios

## Deployment Notes

1. Deploy the server code to your VPS
2. Ensure all environment variables are set
3. Test each callback URL manually
4. Submit for Meta App Review with all URLs working

## Troubleshooting

### Common Issues:
- **SSL Certificate**: Ensure your domain has valid SSL
- **CORS**: Make sure CORS is configured for Meta domains
- **Webhook Verification**: Double-check verify token matches
- **Permissions**: Ensure all required permissions are requested
- **Rate Limits**: Handle Meta API rate limiting gracefully
