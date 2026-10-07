const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', jobController.getJobRoles);
router.post('/analyze', authenticateUser, jobController.analyzeJobMatch);

module.exports = router;
