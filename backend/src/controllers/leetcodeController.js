const leetcodeService = require('../services/leetcode/leetcodeService');

const connectLeetCode = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { username, profileUrl } = req.body;
    const input = username || profileUrl;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a LeetCode username or profile URL.',
      });
    }

    const result = await leetcodeService.connectLeetCode(candidateId, input);
    res.json(result);
  } catch (error) {
    const statusCode = error.message?.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to connect LeetCode profile.',
    });
  }
};

const disconnectLeetCode = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const result = await leetcodeService.disconnectLeetCode(candidateId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const analyzeLeetCode = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { username } = req.body;
    const result = await leetcodeService.analyzeLeetCode(candidateId, { username });
    res.json(result);
  } catch (error) {
    const statusCode = error.message?.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to analyze LeetCode statistics.',
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const profile = await leetcodeService.getProfile(candidateId);
    res.json({
      success: true,
      leetcodeProfile: profile || null,
    });
  } catch (error) {
    next(error);
  }
};

const getAnalysis = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const profile = await leetcodeService.getProfile(candidateId);
    res.json({
      success: true,
      leetcodeProfile: profile || null,
      verifiedClaims: profile?.verifiedClaims || [],
      evidenceStrength: profile?.dsaEvidenceStrength || 'LOW',
      summary: profile?.evidenceSummary || '',
    });
  } catch (error) {
    next(error);
  }
};

const getCodingProfile = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const codingProfileData = await leetcodeService.getCodingProfile(candidateId);
    if (!codingProfileData) {
      return res.json({
        success: true,
        profile: null,
        codingProfile: null,
        topics: [],
        allTopics: [],
        languages: [],
        difficulty: { easy: 0, medium: 0, hard: 0 },
        difficultyPercentages: { easy: 0, medium: 0, hard: 0 },
        recency: { lastActivity: null, last30Days: 0, last90Days: 0, last180Days: 0, activeDays: 0, streakDays: 0 },
        consistency: 'LOW',
        strengths: [],
        patterns: { strong: [], moderate: [], developing: [], limited: [] },
        gaps: [],
        verifiedClaims: [],
      });
    }

    res.json(codingProfileData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectLeetCode,
  disconnectLeetCode,
  analyzeLeetCode,
  getProfile,
  getAnalysis,
  getCodingProfile,
};

