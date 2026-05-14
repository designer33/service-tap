const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Verifies JWT and attaches req.user
 */
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    // Update lastActive at most once per minute (fire-and-forget, non-blocking)
    try {
      const now = new Date();
      const lastActiveAge = req.user.lastActive ? (now - req.user.lastActive) : Infinity;
      if (lastActiveAge > 60000) {
        User.findByIdAndUpdate(req.user._id, { lastActive: now }).exec().catch(() => {});
      }
    } catch (_) {}

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * authorize(...roles) — Role guard middleware factory
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
