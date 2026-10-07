import api from './api';

export const studentService = {
  async getProfile() {
    return await api.get('/student/profile');
  },

  async updateProfile(profileData) {
    return await api.put('/student/profile', profileData);
  },

  async updateLinks(platformHandles) {
    return await api.post('/student/links', { platformHandles });
  },

  async uploadResume(formData) {
    return await api.post('/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  async submitEvidence(evidencePayload) {
    return await api.post('/student/evidence', evidencePayload);
  },

  async triggerAnalyze(payload) {
    return await api.post('/student/analyze', payload);
  },

  async getEvidenceMatrix() {
    return await api.get('/student/evidence');
  },

  async getAnalysis() {
    return await api.get('/student/analysis');
  },

  async getSkillGaps() {
    return await api.get('/student/skills');
  },

  async getProjects() {
    return await api.get('/student/projects');
  },

  async getCodingActivity() {
    return await api.get('/student/coding-activity');
  },

  async getRoles() {
    return await api.get('/student/roles');
  },

  async getCourses() {
    return await api.get('/student/courses');
  },

  async getRoadmap() {
    return await api.get('/student/roadmap');
  },

  async toggleRoadmapMilestone(weekNumber) {
    return await api.post('/student/roadmap/toggle', { weekNumber });
  },

  async getCareerReport() {
    return await api.get('/student/report');
  },

  async chatAdvisor(messages) {
    return await api.post('/student/advisor/chat', { messages });
  },
};
