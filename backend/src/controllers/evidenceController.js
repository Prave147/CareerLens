const githubConnector = require('../services/connectors/githubConnector');
const leetcodeConnector = require('../services/connectors/leetcodeConnector');
const gfgConnector = require('../services/connectors/gfgConnector');
const linkedinConnector = require('../services/connectors/linkedinConnector');
const portfolioConnector = require('../services/connectors/portfolioConnector');
const evidenceEngine = require('../services/evidence/evidenceEngine');

const getEvidenceMatrix = async (req, res, next) => {
  try {
    const githubData = await githubConnector.fetchUserData('alexkumar-dev');
    const leetcodeData = await leetcodeConnector.fetchUserData('alex_code');
    const gfgData = await gfgConnector.fetchUserData('alex_k');
    const linkedinData = await linkedinConnector.fetchUserData('alex-kumar-engineer');
    const portfolioData = await portfolioConnector.fetchUserData('https://alexkumar.dev');

    const resumeSkills = [
      'React', 'Node.js', 'MongoDB', 'JavaScript', 'Docker', 'AWS', 'Testing (Jest/Mocha)', 'Socket.IO', 'Git', 'Express.js'
    ];

    const matrix = evidenceEngine.processEvidence({
      resumeSkills,
      githubData,
      leetcodeData,
      gfgData,
      linkedinData,
      portfolioData,
    });

    res.json({
      success: true,
      evidenceMatrix: matrix,
      summary: {
        totalSkillsEvaluated: matrix.length,
        verifiedCount: matrix.filter(m => m.finalStatus === 'VERIFIED').length,
        partiallyVerifiedCount: matrix.filter(m => m.finalStatus === 'PARTIALLY_VERIFIED').length,
        unverifiedCount: matrix.filter(m => m.finalStatus === 'UNVERIFIED').length,
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEvidenceDetail = async (req, res, next) => {
  try {
    const { skill } = req.params;
    const githubData = await githubConnector.fetchUserData('alexkumar-dev');
    const leetcodeData = await leetcodeConnector.fetchUserData('alex_code');
    const gfgData = await gfgConnector.fetchUserData('alex_k');
    const linkedinData = await linkedinConnector.fetchUserData('alex-kumar-engineer');
    const portfolioData = await portfolioConnector.fetchUserData('https://alexkumar.dev');

    const resumeSkills = ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'Testing', 'Socket.IO', 'Git'];

    const evaluation = evidenceEngine.evaluateSingleSkill(skill, {
      resumeSkills,
      githubData,
      leetcodeData,
      gfgData,
      linkedinData,
      portfolioData,
    });

    res.json({
      success: true,
      skillDetail: evaluation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvidenceMatrix,
  getEvidenceDetail,
};
