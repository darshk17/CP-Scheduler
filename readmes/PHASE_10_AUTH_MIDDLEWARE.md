# Phase 10: Authentication Middleware Documentation

This phase implements a robust, secure authentication middleware to protect private routes using JSON Web Tokens (JWT).

---

## 🔒 JWT Verification Middleware: `authMiddleware.js`

We implemented the `protect` middleware in [server/middleware/authMiddleware.js](file:///d:/CP-Scheduler/server/middleware/authMiddleware.js) to intercept incoming requests to private endpoints, verify the JWT token, and populate user context:

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract Bearer Token from Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // 2. Verify JWT Signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Retrieve User (Excluding password hash)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // 4. Attach User to Request Context
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    res.status(401).json({ message: 'Not authorized' });
  }
};
```

---

## 👤 Private Route Controller: `/api/auth/me`

We completed the `getCurrentUser` controller in [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js) to return user profile data securely once the middleware validates the user:

```javascript
exports.getCurrentUser = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};
```

---

## 🔄 Middleware Execution Flow

When a client hits a protected route like `GET /api/auth/me`:

1. **Client Request**: Client sends request with `Authorization: Bearer <JWT_TOKEN>`.
2. **Middleware Interception**: The `protect` middleware runs first.
3. **Extraction & Verification**: Parses the JWT and calls `jwt.verify(token, secret)`.
4. **Database Verification**: Finds the user matching the token’s ID payload (retrieving details without the hashed password).
5. **Context Injection**: Attaches the user record to `req.user`.
6. **Controller Invocation**: Passes execution to `getCurrentUser` via `next()`, which replies with a `200 OK` and the user profile data.
