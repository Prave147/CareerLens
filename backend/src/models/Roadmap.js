const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  goal: { type: String, required: true },
  whyItMatters: { type: String, default: '' },
  skills: [String],
  task: { type: String, required: true },
  learningResource: {
    title: String,
    url: String,
    type: { type: String, default: 'DOCUMENTATION' }
  },
  practicalTask: { type: String, default: '' },
  expectedEvidence: [String],
  proofRequired: { type: String, default: '' },
  estimatedImpact: { type: String, required: true },
  estimatedScoreGain: { type: Number, default: 2.0 },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  actionType: { type: String, default: 'PROJECT' }, // PROJECT, CODING, CERTIFICATION, SYSTEM_DESIGN, DEPLOYMENT
  phase: { type: String, enum: ['30_DAYS', '60_DAYS', '90_DAYS'], default: '30_DAYS' }
});

const roadmapSchema = new mongoose.Schema({
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
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  totalEstimatedScoreGain: {
    type: Number,
    default: 14.5,
  },
  currentScore: { type: Number, default: 68.0 },
  projectedScore: { type: Number, default: 82.5 },
  weeks: [milestoneSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
