const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, 'College code is required'],
    trim: true,
    uppercase: true,
    unique: true,
  },
  officialEmail: {
    type: String,
    required: [true, 'Official college email is required'],
    trim: true,
    lowercase: true,
  },
  placementContact: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  department: {
    type: String,
    default: 'Training & Placement Directorate',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('College', collegeSchema);
