const jwt = require('jsonwebtoken');
const Tourist = require('../models/Tourist');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get tourist from database
    const tourist = await Tourist.findById(decoded.id).select('-password');

    if (!tourist) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    if (!tourist.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add tourist to request object
    req.tourist = tourist;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
      error: error.message
    });
  }
};

// Admin middleware (for authority dashboard)
const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user has admin role
    if (req.tourist.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({
      success: false,
      message: 'Admin access denied',
      error: error.message
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};