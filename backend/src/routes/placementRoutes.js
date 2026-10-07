const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { requirePlacementAdmin } = require('../middleware/roleMiddleware');

// Protect all placement routes
router.use(authenticateUser, requirePlacementAdmin);

// Institutional Overview
router.get('/dashboard', placementController.getDashboard);

// Pending Student Approvals (Accept/Reject)
router.get('/pending', placementController.getPendingStudents);
router.post('/students/:id/accept', placementController.acceptStudent);
router.post('/students/:id/reject', placementController.rejectStudent);

// Student Cohort & Inspector
router.get('/students', placementController.getStudents);
router.get('/students/:id', placementController.getStudentDetail);

// Batch Skill Intelligence & Claim vs Proof
router.get('/claim-proof', placementController.getClaimVsProof);
router.get('/skills', placementController.getSkills);
router.get('/roles', placementController.getRoles);
router.get('/gaps', placementController.getGaps);

// Interventions & Batch Reports
router.get('/interventions', placementController.getInterventions);
router.get('/reports', placementController.getReports);

module.exports = router;
