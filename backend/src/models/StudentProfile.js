const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  membershipStatus: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  targetRole: {
    type: String,
    default: 'Full Stack Developer',
    trim: true,
  },
  preferredRoles: [String],
  careerObjective: {
    type: String,
    default: '',
  },
  platformHandles: {
    github: { type: String, default: 'alexkumar-dev' },
    leetcode: { type: String, default: 'alex_code' },
    gfg: { type: String, default: 'alex_k' },
    codechef: { type: String, default: 'alex_chef' },
    codeforces: { type: String, default: 'alex_cf' },
    hackerrank: { type: String, default: 'alex_hr' },
    linkedin: { type: String, default: 'alex-kumar-engineer' },
    portfolio: { type: String, default: 'https://alexkumar.dev' },
  },
  skills: [{
    name: String,
    level: String, // Beginner, Intermediate, Advanced
    category: String, // Frontend, Backend, Database, Cloud, Core, Language
    verified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'STRONGLY_VERIFIED', 'WEAK', 'UNSUPPORTED', 'UNVERIFIED', 'CONFLICTING', 'PENDING_USER_EVIDENCE'],
      default: 'UNVERIFIED',
    }
  }],
  certifications: [{
    title: String,
    issuer: String,
    issueDate: String,
    credentialUrl: String,
    verified: { type: Boolean, default: false },
  }],
  internships: [{
    role: String,
    company: String,
    duration: String,
    description: String,
    technologies: [String],
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    repoUrl: String,
    liveUrl: String,
    commitsCount: Number,
    isFork: { type: Boolean, default: false },
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
    integrityReason: String,
    highlight: String,
  }],
  resume: {
    fileName: String,
    fileUrl: String,
    fileSize: String,
    uploadedAt: Date,
    extractedSkills: [String],
    extractedProjects: [String],
    extractedCertifications: [String],
    extractedExperience: [String],
    status: {
      type: String,
      enum: ['NOT_UPLOADED', 'ANALYZED', 'PROCESSING'],
      default: 'NOT_UPLOADED',
    }
  },
  profileCompleteness: {
    type: Number,
    default: 85,
  },
  lastAnalyzedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
