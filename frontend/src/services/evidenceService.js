import api from './api';

export const evidenceService = {
  // Get all canonical fused skill evidence
  async getSkillsEvidence() {
    return await api.get('/evidence/skills');
  },

  // Get deep breakdown for a single skill
  async getSingleSkillDetail(skillName) {
    return await api.get(`/evidence/skill/${encodeURIComponent(skillName)}`);
  },

  // Get evidence summary overview
  async getEvidenceSummary() {
    return await api.get('/evidence/summary');
  },

  // Submit manual proof
  async submitEvidence(data) {
    return await api.post('/student/evidence', data);
  },
};
