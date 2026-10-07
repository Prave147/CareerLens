const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All evidence endpoints require authenticated candidate context
router.use(authenticateUser);

router.get('/skills', evidenceController.getSkillsEvidence);
router.get('/skill/:skillName', evidenceController.getSingleSkillDetail);
router.get('/summary', evidenceController.getEvidenceSummary);

module.exports = router;
