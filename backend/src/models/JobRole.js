const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Engineering',
  },
  description: {
    type: String,
    required: true,
  },
  requiredSkills: [{
    name: String,
    weight: Number,
    category: String,
  }],
  niceToHaveSkills: [String],
  dsaExpectation: {
    level: String, // High, Medium, Foundational
    minProblems: Number,
  },
  avgSalaryRange: {
    type: String,
    default: '₹8 - 18 LPA',
  },
  marketDemand: {
    type: String,
    default: 'High',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('JobRole', jobRoleSchema);
