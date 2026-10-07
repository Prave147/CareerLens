const aiService = require('../ai/aiService');

class RoadmapService {
  async getStudentRoadmap(studentId, gaps = []) {
    const weeks = await aiService.generateRoadmap(gaps);
    return {
      targetRole: 'Full Stack Developer',
      totalEstimatedScoreGain: 14.5,
      currentReadiness: 79.3,
      projectedReadiness: 93.8,
      weeks
    };
  }
}

module.exports = new RoadmapService();
