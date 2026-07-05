const express = require('express');
const router = express.Router();
const { sendTestEmail } = require('../controllers/emailController');

// POST /api/test-email - Public endpoint to test SMTP email configuration
router.post('/test-email', sendTestEmail);

module.exports = router;
