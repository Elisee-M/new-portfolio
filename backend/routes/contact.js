const express = require('express');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.RESEND_EMAIL],
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
    });

    await gmailTransporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting me!</h2>
          <p>Hi ${name},</p>
          <p>I've received your message regarding <strong>${topic}</strong> and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message:</p>
          <blockquote style="border-left: 4px solid #2563eb; padding-left: 16px; margin-left: 0; color: #555;">
            ${message}
          </blockquote>
          <p>Best regards,<br/>Elisee</p>
        </div>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: err.message || 'Failed to send message' });
  }
});

module.exports = router;
