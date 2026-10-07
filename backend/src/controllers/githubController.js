const githubService = require('../services/github/githubService');

const connectGithub = async (req, res, next) => {
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
        message: 'Please provide a GitHub username or profile URL.',
      });
    }

    const result = await githubService.connectGithub(candidateId, input);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to connect GitHub profile.',
    });
  }
};

const disconnectGithub = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const result = await githubService.disconnectGithub(candidateId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const profile = await githubService.getProfile(candidateId);
    res.json({
      success: true,
      githubProfile: profile || null,
    });
  } catch (error) {
    next(error);
  }
};

const analyzeGithub = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { username, forceRefresh } = req.body;
    const result = await githubService.analyzeGithub(candidateId, {
      username,
      forceRefresh: !!forceRefresh,
    });

    res.json(result);
  } catch (error) {
    const statusCode = error.message?.includes('rate limit')
      ? 403
      : error.message?.includes('not found')
      ? 404
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to analyze GitHub repositories.',
    });
  }
};

const getAnalysis = async (req, res, next) => {
  try {
    const candidateId = req.user?.id || req.user?._id;
    if (!candidateId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const profile = await githubService.getProfile(candidateId);
    res.json({
      success: true,
      githubProfile: profile || null,
      statistics: profile?.statistics || null,
      insights: profile?.insights || [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  connectGithub,
  disconnectGithub,
  getProfile,
  analyzeGithub,
  getAnalysis,
};
