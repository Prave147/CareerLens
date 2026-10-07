const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB maximum
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported for resume extraction.'), false);
    }
  },
});

// Authenticated student only
router.use(authenticateUser, requireStudent);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/latest', resumeController.getLatestAnalysis);

module.exports = router;
