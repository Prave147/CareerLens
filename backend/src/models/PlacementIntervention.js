const mongoose = require('mongoose');

const placementInterventionSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  skill: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['RECOMMENDED', 'SCHEDULED', 'ACTIVE', 'COMPLETED'],
    default: 'RECOMMENDED',
  },
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'HIGH',
  },
  targetCohort: {
    type: String,
    required: true,
  },
  affectedCount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    required: true,
  },
  recommendedAction: {
    type: String,
    required: true,
  },
  expectedOutcome: {
    type: String,
    required: true,
  },
  estimatedBatchScoreGain: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('PlacementIntervention', placementInterventionSchema);
