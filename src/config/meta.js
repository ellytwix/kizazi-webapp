/**
 * Meta API Configuration
 * Contains public App IDs that are safe to expose in client-side code
 */

export const META_CONFIG = {
  // Facebook App Configuration
  FACEBOOK_APP_ID: '1254207229501657',
  
  // Instagram App Configuration  
  INSTAGRAM_APP_ID: '1442447900331004',
  
  // OAuth Configuration
  OAUTH_REDIRECT_URI: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173/oauth/callback'
    : 'https://www.kizazisocial.com/oauth/callback',
    
  // API Base URL
  API_BASE_URL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : 'https://www.kizazisocial.com/api',
    
  // Meta Graph API Version
  GRAPH_API_VERSION: 'v18.0',
  
  // Required Permissions
  FACEBOOK_PERMISSIONS: [
    'pages_show_list',
    'pages_read_engagement', 
    'pages_manage_posts',
    'public_profile'
  ],
  
  INSTAGRAM_PERMISSIONS: [
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list'
  ]
};

export default META_CONFIG;
