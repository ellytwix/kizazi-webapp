import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    console.log('🔐 Auth middleware - token received:', token.substring(0, 20) + '...');

    // Handle demo tokens (jwt-token-* format)
    if (token.startsWith('jwt-token-') || token.startsWith('jwt-demo-') || token.startsWith('jwt-guest-')) {
      console.log('🎭 Demo token detected, creating demo user');
      
      // Create a demo user for demo tokens
      req.user = {
        id: 'demo-user',
        email: 'demo@kizazisocial.com',
        name: 'Demo User',
        type: 'demo',
        isActive: true,
        socialAccounts: [] // Will be handled in socialMedia route
      };
      
      console.log('✅ Demo user authenticated');
      return next();
    }

    // Handle real JWT tokens
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid - user not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyPlan = (requiredPlan) => {
  const planHierarchy = {
    'starter': 1,
    'pro': 2,
    'enterprise': 3
  };

  return (req, res, next) => {
    const userPlanLevel = planHierarchy[req.user.plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${requiredPlan} plan or higher`,
        currentPlan: req.user.plan,
        requiredPlan
      });
    }

    next();
  };
};