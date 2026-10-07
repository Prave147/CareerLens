import api from './api';

export const githubService = {
  async connectGithub(input) {
    return await api.post('/github/connect', {
      username: input,
      profileUrl: input,
    });
  },

  async getProfile() {
    return await api.get('/github/profile');
  },

  async analyzeGithub(username, forceRefresh = true) {
    return await api.post('/github/analyze', {
      username: username || undefined,
      forceRefresh,
    });
  },

  async getAnalysis() {
    return await api.get('/github/analysis');
  },
};
