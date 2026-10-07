const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
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
  targetRole: {
    type: String,
    default: 'Full Stack Developer',
  },
  readinessScore: {
    type: Number,
    required: true,
    default: 79.3,
  },
  statusBadge: {
    type: String,
    default: 'Strong candidate',
  },
  statusSubtitle: {
    type: String,
    default: 'A few targeted gaps remain before optimal role readiness.',
  },
  breakdown: {
    technicalCapability: { score: Number, max: Number, percentage: Number, status: String },
    proofOfWork: { score: Number, max: Number, percentage: Number, status: String },
    projectStrength: { score: Number, max: Number, percentage: Number, status: String },
    activityConsistency: { score: Number, max: Number, percentage: Number, status: String },
    roleFit: { score: Number, max: Number, percentage: Number, status: String },
    evidenceConfidence: { score: Number, max: Number, percentage: Number, status: String },
  },
  kpi: {
    verifiedSkills: { type: Number, default: 18 },
    evidenceSources: { type: Number, default: 5 },
    profileCompleteness: { type: Number, default: 87 },
    criticalGaps: { type: Number, default: 3 },
  },
  radarScores: [{
    category: String,
    studentScore: Number,
    industryBenchmark: Number,
  }],
  scoreContributions: [{
    factor: String,
    points: Number,
    description: String,
    evidenceRef: String,
  }],
  scoreDeductions: [{
    factor: String,
    penalty: Number,
    reason: String,
    remediation: String,
  }],
  improvementSimulations: [{
    action: String,
    estimatedScoreGain: Number,
    skill: String,
    task: String,
    status: { type: String, default: 'RECOMMENDED' }
  }],
  bestCurrentRoles: [{
    role: String,
    matchPercentage: Number,
    confidence: String,
    strengths: [String],
    gaps: [String],
    recommendedAction: String,
  }],
  careerPathAlignment: {
    targetRole: String,
    bestCurrentRole: String,
    isAligned: Boolean,
    alignmentNote: String,
    transitionPlan: [String],
  },
  whyThisScore: {
    type: String,
    default: 'High proficiency demonstrated across React, Node.js, and core full-stack foundations with verified multi-commit repositories and strong LeetCode algorithmic consistency.',
  },
  recentEvidence: [{
    skill: String,
    status: String,
    sources: String,
    confidence: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Analysis', analysisSchema);
