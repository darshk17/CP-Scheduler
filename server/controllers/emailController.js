const { sendEmail } = require('../services/emailService');

// @desc    Send a test email to verify SMTP configuration
// @route   POST /api/test-email
// @access  Public
exports.sendTestEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1. Validation: Ensure destination email address is provided
    if (!email) {
      const error = new Error('Please provide a destination email address');
      error.statusCode = 400;
      return next(error);
    }

    const subject = 'CP Scheduler Test Email';
    const html = `
      <h2>🎉 CP Scheduler</h2>

<p>Your email configuration is working successfully.</p>

<p>You are now ready to receive contest reminder emails.</p>
    `;

    // 2. Transmit email using Nodemailer service
    await sendEmail(email, subject, html);

    // 3. Return success response
    res.status(200).json({
      status: 'success',
      message: 'Test email sent successfully'
    });

  } catch (error) {
    next(error);
  }
};
