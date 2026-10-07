const evidenceFusionService = require('../services/evidence/evidenceFusionService');

const getSkillsEvidence = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const result = await evidenceFusionService.getFusedSkillEvidence(candidateId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getSingleSkillDetail = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { skillName } = req.params;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'skillName parameter is required.' });
    }

    const result = await evidenceFusionService.getSingleSkillEvidence(candidateId, decodeURIComponent(skillName));
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getEvidenceSummary = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const result = await evidenceFusionService.getFusedSkillEvidence(candidateId);
    res.json({
      success: true,
      summary: result.summary,
      insights: result.insights,
      verifiedSkills: result.skills.filter((s) => s.status === 'VERIFIED'),
      unverifiedSkills: result.skills.filter((s) => s.status === 'UNVERIFIED'),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillsEvidence,
  getSingleSkillDetail,
  getEvidenceSummary,
};
