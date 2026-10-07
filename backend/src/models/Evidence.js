const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  category: {
    type: String,
    default: 'Core Technology',
  },
  claims: {
    resume: { type: Boolean, default: false },
    linkedIn: { type: Boolean, default: false },
    selfReported: { type: Boolean, default: false },
    portfolio: { type: Boolean, default: false },
  },
  evidenceSources: {
    resume: { found: Boolean, level: String, detail: String },
    github: { found: Boolean, level: String, detail: String, repoName: String, commits: Number },
    leetcode: { found: Boolean, level: String, detail: String },
    gfg: { found: Boolean, level: String, detail: String },
    codechef: { found: Boolean, level: String, detail: String },
    linkedIn: { found: Boolean, level: String, detail: String },
    portfolio: { found: Boolean, level: String, detail: String },
    userSubmission: { found: Boolean, level: String, detail: String, proofType: String, url: String },
  },
  finalStatus: {
    type: String,
    enum: ['VERIFIED', 'STRONGLY_VERIFIED', 'WEAK', 'UNSUPPORTED', 'UNVERIFIED', 'CONFLICTING', 'PENDING_USER_EVIDENCE', 'PARTIALLY_VERIFIED', 'NOT_FOUND'],
    default: 'UNVERIFIED',
  },
  confidence: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'LOW',
  },
  confidencePercentage: {
    type: Number,
    default: 0,
  },
  evidenceChain: [{
    source: String,
    detail: String,
    strength: String,
  }],
  whyVerifiedExplanation: {
    type: String,
    default: '',
  },
  userSubmittedEvidence: [{
    proofType: {
      type: String,
      enum: ['CERTIFICATE', 'PROJECT_URL', 'GITHUB_REPO', 'DEPLOYED_APP', 'DOCUMENTATION', 'OFFLINE_EXPLANATION'],
    },
    title: String,
    url: String,
    description: String,
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED'], default: 'APPROVED' }
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Evidence', evidenceSchema);
