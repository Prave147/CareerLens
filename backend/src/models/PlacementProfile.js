const mongoose = require('mongoose');

const placementProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  officerName: {
    type: String,
    required: true,
    trim: true,
  },
  officialEmail: {
    type: String,
    required: true,
    trim: true,
  },
  institutionName: {
    type: String,
    required: true,
    trim: true,
  },
  institutionCode: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    default: 'Training & Placement Directorate',
  },
  academicYear: {
    type: String,
    default: '2025-2026',
  },
  phone: String,
  designation: {
    type: String,
    default: 'Head of Placements & Corporate Relations',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PlacementProfile', placementProfileSchema);
