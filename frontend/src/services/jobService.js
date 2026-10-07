import api from './api';

export const jobService = {
  async getRoles() {
    return await api.get('/jobs');
  },

  async analyzeJobMatch(data) {
    return await api.post('/jobs/analyze', data);
  },
};

export const roadmapService = {
  async getRoadmap() {
    return await api.get('/student/roadmap');
  },

  async toggleMilestone(weekNumber) {
    return await api.post('/student/roadmap/toggle', { weekNumber });
  },
};

export const interviewService = {
  async getQuestions() {
    return await api.get('/student/interview');
  },

  async evaluateAnswer(data) {
    return await api.post('/student/interview/evaluate', data);
  },
};
