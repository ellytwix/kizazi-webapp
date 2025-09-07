// Simplified authentication middleware for demo/development
// This version allows demo tokens without JWT verification

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔐 Demo Auth - Token check:', token ? 'Present' : 'Missing');
    
    // For demo, we'll allow any token or even no token
    // In production, this should be replaced with proper JWT verification
    
    if (!token || token.includes('demo') || token.includes('jwt-token-') || token.includes('guest')) {
      // Create a demo user for all requests
      req.user = {
        id: 'demo-user-123',
        email: 'demo@kizazisocial.com', 
        name: 'Demo User',
        type: 'demo',
        isActive: true,
        socialAccounts: []
      };
      
      console.log('✅ Demo authentication successful');
      return next();
    }
    
    // For any other token, still create a demo user
    req.user = {
      id: 'user-' + Date.now(),
      email: 'user@kizazisocial.com',
      name: 'Kizazi User',
      type: 'user',
      isActive: true,
      socialAccounts: []
    };
    
    console.log('✅ User authenticated');
    next();
    
  } catch (error) {
    console.error('Auth error:', error);
    
    // Even on error, allow access with demo user
    req.user = {
      id: 'demo-fallback',
      email: 'demo@kizazisocial.com',
      name: 'Demo User',
      type: 'demo',
      isActive: true,
      socialAccounts: []
    };
    
    next();
  }
};

export const generateToken = (userId) => {
  return 'jwt-token-' + userId + '-' + Date.now();
};

export default authenticate;
