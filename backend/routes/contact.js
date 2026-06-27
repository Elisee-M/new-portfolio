const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY
  }
});

transporter.verify().then(() => {
  console.log('Brevo transporter ready');
}).catch(err => {
  console.error('Brevo transporter error — check BREVO_SMTP_KEY in .env:', err.message);
});

router.post('/', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.BREVO_EMAIL}>`,
      to: process.env.BREVO_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${topic}`,
      html: `
        <h3>New message from your portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ error: err.message || 'Failed to send message' });
  }
});

module.exports = router;
