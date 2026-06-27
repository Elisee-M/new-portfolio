const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;
    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const apiRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_EMAIL, name: 'Portfolio Contact' },
        to: [{ email: process.env.BREVO_EMAIL }],
        replyTo: { email, name },
        subject: `Portfolio Contact: ${topic}`,
        htmlContent: `
          <h3>New message from your portfolio</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error('Brevo API error:', apiRes.status, errBody);
      return res.status(500).json({ error: `Brevo error (${apiRes.status})` });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: err.message || 'Failed to send message' });
  }
});

module.exports = router;
