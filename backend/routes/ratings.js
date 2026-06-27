const express = require('express');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
