import api from './api';

export const placementService = {
  async getDashboard() {
    return await api.get('/placement/dashboard');
  },

  async getPending() {
    return await api.get('/placement/pending');
  },

  async acceptStudent(studentId) {
    return await api.post(`/placement/students/${studentId}/accept`);
  },

  async rejectStudent(studentId) {
    return await api.post(`/placement/students/${studentId}/reject`);
  },

  async getStudents() {
    return await api.get('/placement/students');
  },

  async getStudentDetail(studentId) {
    return await api.get(`/placement/students/${studentId}`);
  },

  async getClaimProof() {
    return await api.get('/placement/claim-proof');
  },

  async getSkills() {
    return await api.get('/placement/skills');
  },

  async getRoles() {
    return await api.get('/placement/roles');
  },

  async getGaps() {
    return await api.get('/placement/gaps');
  },

  async getInterventions() {
    return await api.get('/placement/interventions');
  },

  async getReports() {
    return await api.get('/placement/reports');
  },
};
