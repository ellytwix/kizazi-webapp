// Simplified authentication middleware for demo/development
// This version allows demo tokens without JWT verification

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔐 Demo Auth - Token check:', token ? 'Present' : 'Missing');
    
    // For demo, we'll allow any token or even no token
    // In production, this should be replaced with proper JWT verification
    
    // Determine user type based on token
    if (!token) {
      // No token - anonymous demo user
      req.user = {
        id: 'demo-user-123',
        email: 'demo@kizazisocial.com', 
        name: 'Demo User',
        type: 'demo',
        isActive: true,
        socialAccounts: []
      };
      
      console.log('✅ Anonymous demo authentication');
      return next();
    }
    
    if (token.includes('demo') || token.includes('jwt-demo-')) {
      // Explicit demo token
      req.user = {
        id: 'demo-user-123',
        email: 'demo@kizazisocial.com', 
        name: 'Demo User',
        type: 'demo',
        isActive: true,
        socialAccounts: []
      };
      
      console.log('✅ Demo user authentication');
      return next();
    }
    
    if (token.includes('jwt-token-') || token.includes('guest')) {
      // Regular user token
      req.user = {
        id: 'user-' + Date.now(),
        email: 'user@kizazisocial.com',
        name: 'Kizazi User',
        type: 'user',
        isActive: true,
        socialAccounts: [] // Real users start with no connected accounts
      };
      
      console.log('✅ Real user authentication');
      return next();
    }
    
    // Fallback - treat as real user
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
