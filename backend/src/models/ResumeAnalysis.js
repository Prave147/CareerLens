const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: 'application/pdf',
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  extractionStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED',
  },
  extractionVersion: {
    type: String,
    default: 'v1.0-gemini',
  },
  summary: {
    type: String,
    default: '',
  },
  candidate: {
    name: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    location: { type: String, default: null },
  },
  education: [{
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    field: { type: String, default: null },
    startYear: { type: Number, default: null },
    endYear: { type: Number, default: null },
    cgpa: { type: String, default: null },
    percentage: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  skills: [{
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['PROGRAMMING', 'FRAMEWORK', 'DATABASE', 'AI_ML', 'CLOUD', 'DEVOPS', 'TOOL', 'OTHER'],
      default: 'OTHER',
    },
    evidenceText: { type: String, default: '' },
    confidence: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
  }],
  projects: [{
    name: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: [String],
    responsibilities: [String],
    outcomes: [String],
    githubUrl: { type: String, default: null },
    demoUrl: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  experience: [{
    company: { type: String, required: true },
    role: { type: String, default: '' },
    location: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    responsibilities: [String],
    achievements: [String],
    evidenceText: { type: String, default: '' },
  }],
  internships: [{
    company: { type: String, required: true },
    role: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
    responsibilities: [String],
    technologies: [String],
    evidenceText: { type: String, default: '' },
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, default: null },
    date: { type: String, default: null },
    credentialUrl: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  achievements: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  hackathons: [{
    name: { type: String, required: true },
    role: { type: String, default: null },
    result: { type: String, default: null },
    date: { type: String, default: null },
    description: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  codingProfiles: [{
    platform: {
      type: String,
      enum: ['GITHUB', 'LEETCODE', 'GFG', 'CODECHEF', 'CODEFORCES', 'HACKERRANK', 'OTHER'],
      default: 'OTHER',
    },
    username: { type: String, default: null },
    url: { type: String, default: null },
    evidenceText: { type: String, default: '' },
  }],
  claims: [{
    claim: { type: String, required: true },
    claimType: {
      type: String,
      enum: ['SKILL', 'PROJECT', 'EXPERIENCE', 'ACHIEVEMENT', 'CERTIFICATION', 'OTHER'],
      default: 'OTHER',
    },
    sourceText: { type: String, default: '' },
    sourceSection: { type: String, default: 'General' },
    relatedSkill: { type: String, default: null },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'UNVERIFIED', 'VERIFIED'],
      default: 'PENDING',
    },
  }],
  extractionMetadata: {
    provider: { type: String, default: 'Gemini' },
    model: { type: String, default: 'gemini-3.8-flash' },
    processingTimeMs: { type: Number, default: 0 },
    extractedAt: { type: Date, default: Date.now },
  },
}, {
  timestamps: true,
});

// Indexes for fast lookup
resumeAnalysisSchema.index({ candidateId: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
