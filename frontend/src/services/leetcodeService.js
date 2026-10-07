import api from './api';

export const leetcodeService = {
  /**
   * Connects and verifies a student's LeetCode username or profile URL
   */
  connectLeetCode: async (username) => {
    return await api.post('/leetcode/connect', { username });
  },

  /**
   * Disconnects current LeetCode profile and invalidates attached proof
   */
  disconnectLeetCode: async () => {
    return await api.post('/leetcode/disconnect');
  },

  /**
   * Analyzes or refreshes real-time LeetCode problem solving metrics
   */
  analyzeLeetCode: async (username) => {
    return await api.post('/leetcode/analyze', { username });
  },

  /**
   * Retrieves existing LeetCode profile record
   */
  getLeetCodeProfile: async () => {
    return await api.get('/leetcode/profile');
  },

  /**
   * Retrieves complete LeetCode intelligence analysis and verified claims
   */
  getLeetCodeAnalysis: async () => {
    return await api.get('/leetcode/analysis');
  },

  /**
   * Retrieves comprehensive LeetCode V2 Coding Skill Profile
   */
  getCodingProfile: async () => {
    return await api.get('/leetcode/coding-profile');
  },
};

export default leetcodeService;

