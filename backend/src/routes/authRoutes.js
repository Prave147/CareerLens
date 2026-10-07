const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public College Directory
router.get('/colleges', authController.getColleges);

// Student
router.post('/student/signup', authController.studentSignup);
router.post('/student/login', authController.studentLogin);

// Placement
router.post('/placement/signup', authController.placementSignup);
router.post('/placement/login', authController.placementLogin);

// Common
router.get('/me', authenticateUser, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
