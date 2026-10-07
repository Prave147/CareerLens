const mongoose = require('mongoose');

const leetcodeProfileSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  username: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  profileUrl: {
    type: String,
    required: true,
  },
  realName: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  aboutMe: {
    type: String,
    default: '',
  },
  countryName: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  school: {
    type: String,
    default: '',
  },
  // Problem Solving Stats
  totalSolved: {
    type: Number,
    default: 0,
  },
  easySolved: {
    type: Number,
    default: 0,
  },
  mediumSolved: {
    type: Number,
    default: 0,
  },
  hardSolved: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    total: { type: Number, default: 0 },
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  acceptanceRate: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Number,
    default: 0,
  },
  contributionPoints: {
    type: Number,
    default: 0,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  // Contest Info
  contestRating: {
    type: Number,
    default: null,
  },
  contestGlobalRanking: {
    type: Number,
    default: null,
  },
  contestAttended: {
    type: Number,
    default: 0,
  },
  contestTopPercentage: {
    type: Number,
    default: null,
  },
  contestBadge: {
    name: { type: String, default: null },
    icon: { type: String, default: null },
  },
  // Language & Skill Breakdown
  languageStats: [{
    languageName: { type: String, required: true },
    problemsSolved: { type: Number, required: true },
  }],
  topicStats: [{
    topicName: { type: String, required: true },
    topicSlug: { type: String, default: '' },
    canonicalTopic: { type: String, default: '' },
    problemsSolved: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    strength: { type: String, enum: ['LOW', 'MODERATE', 'STRONG', 'VERY_STRONG'], default: 'LOW' },
    recentCount: { type: Number, default: 0 },
    category: { type: String, default: 'Core Algorithm' },
  }],
  codingPatterns: {
    strong: [{ type: String }],
    moderate: [{ type: String }],
    developing: [{ type: String }],
    limited: [{ type: String }],
  },
  codingGaps: [{
    topic: { type: String, required: true },
    currentStrength: { type: String, enum: ['LOW', 'MODERATE', 'STRONG', 'VERY_STRONG'], default: 'LOW' },
    targetStrength: { type: String, default: 'STRONG' },
    count: { type: Number, default: 0 },
    recommendation: { type: String, default: '' },
  }],
  recencyStats: {
    lastActivity: { type: Date, default: null },
    last30DaysCount: { type: Number, default: 0 },
    last90DaysCount: { type: Number, default: 0 },
    last180DaysCount: { type: Number, default: 0 },
    activeDaysTotal: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
  },
  difficultyPercentages: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  codingConsistency: {
    type: String,
    enum: ['HIGH', 'MODERATE', 'LOW'],
    default: 'MODERATE',
  },
  // Badges & Streaks
  badges: [{
    id: { type: String },
    name: { type: String },
    shortName: { type: String },
    displayName: { type: String },
    icon: { type: String },
    creationDate: { type: String },
  }],
  activeBadge: {
    name: { type: String, default: null },
    icon: { type: String, default: null },
  },
  recentSubmissions: [{
    title: { type: String, required: true },
    titleSlug: { type: String, default: '' },
    timestamp: { type: String, required: true },
    statusDisplay: { type: String, default: 'Accepted' },
    lang: { type: String, default: '' },
  }],
  streak: {
    type: Number,
    default: 0,
  },
  totalActiveDays: {
    type: Number,
    default: 0,
  },
  // Deterministic DSA Evidence Evaluations
  dsaEvidenceStrength: {
    type: String,
    enum: ['LOW', 'MODERATE', 'STRONG', 'VERY_STRONG'],
    default: 'LOW',
  },
  evidenceSummary: {
    type: String,
    default: '',
  },
  verifiedClaims: [{
    skill: { type: String, required: true },
    canonicalName: { type: String },
    status: { type: String, enum: ['VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED'], default: 'VERIFIED' },
    confidence: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    strength: { type: String, default: 'STRONG' },
    evidenceCount: { type: Number, default: 0 },
    reason: { type: String, default: '' },
  }],
  lastFetchedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.LeetCodeProfile || mongoose.model('LeetCodeProfile', leetcodeProfileSchema);
