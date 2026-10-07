const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  repoUrl: {
    type: String,
    trim: true,
  },
  liveUrl: {
    type: String,
    trim: true,
  },
  technologies: [String],
  commitsCount: {
    type: Number,
    default: 0,
  },
  isFork: {
    type: Boolean,
    default: false,
  },
  upstreamRepo: {
    type: String,
    default: '',
  },
  ownershipStatus: {
    type: String,
    enum: ['ORIGINAL_OWNER', 'CONTRIBUTOR', 'FORK', 'TEMPLATE_DERIVED', 'LOW_CONTRIBUTION', 'UNKNOWN'],
    default: 'ORIGINAL_OWNER',
  },
  evidenceIntegrity: {
    type: String,
    enum: ['High Confidence', 'Moderate Confidence', 'Needs Review'],
    default: 'High Confidence',
  },
  integrityReason: {
    type: String,
    default: 'Repository exhibits regular commit history and original code patterns.',
  },
  forkContributionScore: {
    type: Number,
    default: 100, // 0 to 100%
  },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  hasReadme: { type: Boolean, default: true },
  hasLiveDeployment: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
