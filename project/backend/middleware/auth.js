const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

const requireAdmin = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
};

module.exports = {
  authenticate,
  requireAuth,
  requireAdmin
};
