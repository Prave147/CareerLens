const mongoose = require('mongoose');

const leetCodeProblemActivitySchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
  },
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'],
    default: 'Unknown',
  },
  topics: [{
    type: String,
    trim: true,
  }],
  canonicalTopics: [{
    type: String,
    trim: true,
  }],
  language: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'Accepted',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
  },
  url: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    default: 'LEETCODE',
  },
}, {
  timestamps: true,
});

leetCodeProblemActivitySchema.index({ candidateId: 1, problemId: 1 }, { unique: true });
leetCodeProblemActivitySchema.index({ candidateId: 1, submittedAt: -1 });
leetCodeProblemActivitySchema.index({ candidateId: 1, canonicalTopics: 1 });

module.exports = mongoose.models.LeetCodeProblemActivity || mongoose.model('LeetCodeProblemActivity', leetCodeProblemActivitySchema);
