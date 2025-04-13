const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token with additional security checks
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: config.JWT_EXPIRE
    });

    // Check token revocation
    if (decoded.iat < (req.user?.tokenRevokedAt || 0)) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    req.user = await User.findById(decoded.id).select('+tokenRevokedAt');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found with this token'
      });
    }

    // Add security headers
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    });
    
    next();
  } catch (err) {
    let message = 'Not authorized to access this route';
    if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }
    return res.status(401).json({
      success: false,
      message
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Apply rate limiting to auth routes
exports.authLimiter = authLimiter;
