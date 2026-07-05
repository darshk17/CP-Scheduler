const express = require('express');
const router = express.Router();
const { getCodeforcesStats, refreshCodeforcesStats, getLeetcodeStats } = require('../controllers/cpController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware globally to protect all CP tracker routes
router.use(protect);

/**
 * @route   GET /api/cp/codeforces
 * @desc    Fetch authenticated user's Codeforces rating metrics
 * @access  Private
 */
router.get('/codeforces', getCodeforcesStats);

/**
 * @route   POST /api/cp/codeforces/refresh
 * @desc    Force synch/refresh of Codeforces metrics
 * @access  Private
 */
router.post('/codeforces/refresh', refreshCodeforcesStats);

/**
 * @route   GET /api/cp/leetcode
 * @desc    Fetch authenticated user's LeetCode solved statistics
 * @access  Private
 */
router.get('/leetcode', getLeetcodeStats);

module.exports = router;
