const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

const CV_FILENAME = 'cv.pdf';
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, CV_FILENAME)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Only PDF files are allowed'));
  }
});

router.post('/upload', auth, (req, res) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${CV_FILENAME}`;
    res.json({ url, filename: CV_FILENAME });
  });
});

router.get('/', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, CV_FILENAME);
  if (fs.existsSync(filePath)) {
    const url = `${req.protocol}://${req.get('host')}/uploads/${CV_FILENAME}`;
    res.json({ url });
  } else {
    res.status(404).json({ error: 'No CV uploaded yet' });
  }
});

module.exports = router;
