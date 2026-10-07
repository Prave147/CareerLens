const mongoose = require('mongoose');

const skillClaimSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  skill: {
    type: String,
    required: true,
    trim: true,
  },
  normalizedSkill: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  category: {
    type: String,
    default: 'OTHER',
  },
  claimText: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    enum: ['RESUME', 'GITHUB', 'LEETCODE', 'GFG', 'CODECHEF', 'CODEFORCES', 'LINKEDIN', 'PORTFOLIO', 'CERTIFICATION', 'SELF_DECLARED'],
    default: 'RESUME',
  },
  sourceReference: {
    type: String,
    default: '',
  },
  claimStrength: {
    type: String,
    enum: ['SELF_DECLARED', 'ENDORSED', 'DEMONSTRATED'],
    default: 'SELF_DECLARED',
  },
  status: {
    type: String,
    enum: ['VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED', 'NOT_FOUND'],
    default: 'UNVERIFIED',
    index: true,
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'STRONGLY_VERIFIED', 'PARTIALLY_VERIFIED', 'WEAK', 'UNSUPPORTED', 'CONFLICTING', 'UNVERIFIED'],
    default: 'PENDING',
  },
  confidence: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'LOW',
  },
  confidenceScore: {
    type: Number,
    default: 25,
  },
  evidenceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence',
  }],
  supportingSources: [{
    type: String,
    enum: ['RESUME', 'GITHUB', 'LEETCODE', 'GFG', 'CODECHEF', 'CODEFORCES', 'LINKEDIN', 'PORTFOLIO', 'CERTIFICATION'],
  }],
  evidenceCount: {
    type: Number,
    default: 0,
  },
  evidenceFound: {
    type: Boolean,
    default: false,
  },
  evidenceNote: {
    type: String,
    default: '',
  },
  reason: {
    type: String,
    default: '',
  },
  lastVerifiedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound index to ensure uniqueness per candidate + normalizedSkill
skillClaimSchema.index({ candidateId: 1, normalizedSkill: 1 }, { unique: true });

module.exports = mongoose.model('SkillClaim', skillClaimSchema);

