const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/dashboard - Retrieve authenticated user's dashboard statistics
router.get('/', protect, getDashboardData);

module.exports = router;
