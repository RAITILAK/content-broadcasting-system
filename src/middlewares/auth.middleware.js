const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response.util');

// Verifies JWT token on protected routes
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, name, email, role }
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token.');
  }
};

// Restricts route to specific roles only
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access denied. Only ${roles.join(', ')} can perform this action.`);
    }
    next();
  };
};

module.exports = { authenticate, authorize };