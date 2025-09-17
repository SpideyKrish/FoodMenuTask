const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { extractMenuAsJson } = require('../services/aiClient');
const db = require('../db');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit (adjust as needed)
});

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const extracted = await extractMenuAsJson(text);
    const insertSql = `INSERT INTO menus (raw_text, extracted) VALUES ($1, $2) RETURNING id, extracted, created_at`;
    const result = await db.query(insertSql, [text, extracted]);
    try { fs.unlinkSync(filePath); } catch (e) 
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    try { fs.unlinkSync(filePath); } catch (e) 
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

module.exports = router;
