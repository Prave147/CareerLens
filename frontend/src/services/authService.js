import api from './api';

export const authService = {
  async getColleges() {
    return await api.get('/auth/colleges');
  },

  async studentSignup(data) {
    return await api.post('/auth/student/signup', data);
  },

  async studentLogin(credentials) {
    return await api.post('/auth/student/login', credentials);
  },

  async placementSignup(data) {
    return await api.post('/auth/placement/signup', data);
  },

  async placementLogin(credentials) {
    return await api.post('/auth/placement/login', credentials);
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors during logout
    }
    localStorage.removeItem('careerlens_token');
    localStorage.removeItem('careerlens_user');
  }
};
