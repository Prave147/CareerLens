const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controllers/studentController');
const interviewController = require('../controllers/interviewController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

// Storage for resume upload
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Protect all student routes
router.use(authenticateUser, requireStudent);

// Profile & Links
router.get('/profile', studentController.getProfile);
router.post('/profile', studentController.updateProfile);
router.put('/profile', studentController.updateProfile);
router.post('/links', studentController.updateLinks);

// Resume & Evidence Upload
router.post('/resume', upload.single('resume'), studentController.uploadResume);
router.post('/evidence', studentController.submitEvidence);

// Full Analysis Trigger & Summary
router.post('/analyze', studentController.triggerAnalyze);
router.get('/analysis', studentController.getAnalysis);

// Evidence & Skills
router.get('/evidence', studentController.getEvidence);
router.get('/skills', studentController.getSkills);

// Projects, Coding Activity & Roles
router.get('/projects', studentController.getProjects);
router.get('/coding-activity', studentController.getCodingActivity);
router.get('/roles', studentController.getRoles);
router.get('/courses', studentController.getCourses);

// Roadmap
router.get('/roadmap', studentController.getRoadmap);
router.post('/roadmap/toggle', studentController.toggleMilestone);

// Career Guide & Report
router.get('/report', studentController.getCareerReport);

// AI Career Advisor
router.post('/advisor/chat', studentController.chatAdvisor);

// Interview Defense
router.get('/interview', interviewController.getInterviewQuestions);
router.post('/interview/evaluate', interviewController.evaluateAnswer);

module.exports = router;
