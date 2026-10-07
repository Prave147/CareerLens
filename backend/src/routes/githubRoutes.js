const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

// All GitHub intelligence routes are authenticated student-only
router.use(authenticateUser, requireStudent);

router.post('/connect', githubController.connectGithub);
router.get('/profile', githubController.getProfile);
router.post('/analyze', githubController.analyzeGithub);
router.get('/analysis', githubController.getAnalysis);

module.exports = router;
