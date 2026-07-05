const express = require('express');
const router = express.Router();
const { updateReminderSettings, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protect all user routes using our global auth middleware guard
router.use(protect);

/**
 * @route   PUT /api/users/reminders
 * @desc    Update user's reminder settings (toggle email, window time)
 * @access  Private
 */
router.put('/reminders', updateReminderSettings);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user's personal details and platform handles
 * @access  Private
 */
router.put('/profile', updateProfile);

module.exports = router;
