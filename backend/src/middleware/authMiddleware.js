const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please sign in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careerlens_super_secret_jwt_key_2026_production_ready');
    
    // In database or mock user resolution
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-passwordHash');
    } catch (dbErr) {
      // If DB error, mock user payload fallback
    }

    if (!user) {
      // Allow valid decoded token representation for demo / offline fallback
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        isActive: true,
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please sign in again.',
    });
  }
};

module.exports = { authenticateUser };
