const mongoose = require('mongoose');

const codingActivitySchema = new mongoose.Schema({
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks', 'CodeChef', 'Codeforces', 'HackerRank'],
    required: true,
  },
  handle: {
    type: String,
    required: true,
    trim: true,
  },
  profileUrl: String,
  totalProblemsSolved: {
    type: Number,
    default: 0,
  },
  easyCount: { type: Number, default: 0 },
  mediumCount: { type: Number, default: 0 },
  hardCount: { type: Number, default: 0 },
  contestRating: { type: Number, default: 0 },
  globalRank: String,
  streakDays: { type: Number, default: 0 },
  lastActiveDate: Date,
  historicalConsistency: {
    type: String,
    enum: ['Strong', 'Moderate', 'Needs Improvement'],
    default: 'Strong',
  },
  recentConsistency: {
    type: String,
    enum: ['Strong', 'Moderate', 'Needs Improvement'],
    default: 'Moderate',
  },
  consistencySummary: {
    type: String,
    default: 'Solid foundational problem solving, but active monthly streak requires resumption.',
  },
  topicDistribution: [{
    topic: String,
    count: Number,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('CodingActivity', codingActivitySchema);
