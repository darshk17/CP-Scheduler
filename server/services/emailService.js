const nodemailer = require('nodemailer');

// 1. Create a reusable transporter object using SMTP transport configurations
// EMAIL_USER and EMAIL_PASS are loaded dynamically from environment variables (.env)
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)
  throw new Error('Please provide both EMAIL_USER and EMAIL_PASS environment variables');
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard Google SMTP service helper
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a clean HTML email to the specified receiver.
 * @param {string} to - Receiver email address
 * @param {string} subject - Email subject header
 * @param {string} html - HTML email body content
 * @returns {Promise<object>} - Nodemailer transmission info object
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"CP Scheduler" <${process.env.EMAIL_USER}>`, // Sender identity info
      to,
      subject,
      html
    };

    // 2. Execute email transmission
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully delivered to: ${to} (MessageID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error('❌ Nodemailer Error sending email:', error.message);
    throw error;
  }
};

module.exports = {
  sendEmail
};
