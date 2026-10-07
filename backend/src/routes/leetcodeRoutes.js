const express = require('express');
const router = express.Router();
const leetcodeController = require('../controllers/leetcodeController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

// All LeetCode intelligence routes are authenticated student-only
router.use(authenticateUser, requireStudent);

router.post('/connect', leetcodeController.connectLeetCode);
router.post('/disconnect', leetcodeController.disconnectLeetCode);
router.post('/analyze', leetcodeController.analyzeLeetCode);
router.get('/profile', leetcodeController.getProfile);
router.get('/analysis', leetcodeController.getAnalysis);
router.get('/coding-profile', leetcodeController.getCodingProfile);

module.exports = router;
