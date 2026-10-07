const mongoose = require('mongoose');

const skillClaimSchema = new mongoose.Schema({
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
  skill: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Technical',
  },
  source: {
    type: String,
    enum: ['RESUME', 'LINKEDIN', 'SELF_DECLARED', 'PORTFOLIO', 'GITHUB'],
    default: 'RESUME',
  },
  claimStrength: {
    type: String,
    enum: ['SELF_DECLARED', 'ENDORSED', 'DEMONSTRATED'],
    default: 'SELF_DECLARED',
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'STRONGLY_VERIFIED', 'WEAK', 'UNSUPPORTED', 'CONFLICTING'],
    default: 'PENDING',
  },
  evidenceFound: {
    type: Boolean,
    default: false,
  },
  evidenceNote: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('SkillClaim', skillClaimSchema);
