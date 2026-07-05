const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect private routes from unauthenticated requests
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Read Authorization Header (expected format: "Bearer <JWT_TOKEN>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is provided, abort with 401 Unauthorized
    if (!token) {
      const error = new Error('Not authorized, no token provided');
      error.statusCode = 401;
      return next(error);
    }

    // 2. Verify JWT Signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user information to request context (excluding password hash)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;

    // 4. Call next() to proceed to the controller
    next();
  } catch (error) {
    // Forward JWT errors to the global error middleware
    error.statusCode = 401;
    next(error);
  }
};
