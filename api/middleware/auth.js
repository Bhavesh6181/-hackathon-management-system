const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Ignore JWT errors for optional auth
        console.log('Optional auth: Invalid token, continuing without user');
      }
    }
    
    // Check for session-based authentication (fallback)
    if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.isActive) {
      // User is already set from session
    }
    
    return next();
    
  } catch (error) {
    console.error('Optional authentication error:', error);
    return next(); // Continue even if there's an error
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || !user.isActive) {
          return res.status(401).json({ message: 'User not found or inactive' });
        }
        
        req.user = user;
        return next();
      } catch (jwtError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }
    
    // Check for session-based authentication (fallback)
    if (req.isAuthenticated && req.isAuthenticated()) {
      if (!req.user.isActive) {
        return res.status(401).json({ message: 'User account is inactive' });
      }
      return next();
    }
    
    return res.status(401).json({ message: 'Authentication required' });
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Middleware to check if user is organizer or admin
const isOrganizerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (!['organizer', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Organizer or admin access required' });
  }
  
  next();
};

// Middleware to check if user owns resource or is admin
const isOwnerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied' });
  };
};

module.exports = {
  optionalAuth,
  isAuthenticated,
  isAdmin,
  isOrganizerOrAdmin,
  isOwnerOrAdmin
};

