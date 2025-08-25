const jwt = require('jsonwebtoken');
const { User } = require('../models');

// let tokenBlacklist = []; 
const tokenBlacklist = require('../utils/tokenBlacklist');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or wrong format' });
    }

    const token = authHeader.split(' ')[1];

    // 🚫 Reject if blacklisted
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token is blacklisted (logged out)' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};
