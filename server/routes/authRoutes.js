const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiting for auth routes: max 100 requests per 15 minutes window
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(authLimiter);

// Public endpoints
router.post('/register', register);
router.post('/login', login);

// Private/Protected endpoints
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;
