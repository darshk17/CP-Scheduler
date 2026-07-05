# Phase 35: Reusable Email Service Documentation

This phase implements the modular email sender service using `nodemailer` and configured credentials.

---

## 📬 Reusable Email Transporter: `emailService.js`

Created in [server/services/emailService.js](file:///d:/CP-Scheduler/server/services/emailService.js):

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"CP Scheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully delivered to: ${to} (MessageID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error('❌ Nodemailer Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };
```

---

## 💡 Code Steps Explained

1. **`nodemailer.createTransport({...})`**: Configures the connection settings (SMTP server name, authorization credentials) to let our application speak to the target email provider.
2. **`service: 'gmail'`**: A built-in shorthand configuration that automatically maps SMTP parameters (port, host, SSL requirements) for Google Mail.
3. **`transporter.sendMail(mailOptions)`**: The core asynchronous call that sends the email package over SMTP, returning delivery receipt metadata (`info`).
