const mongoose = require('mongoose');

const gitHubProfileSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
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
    lowercase: true,
  },
  profileUrl: {
    type: String,
    required: true,
    trim: true,
  },
  name: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  blog: { type: String, default: '' },
  twitterUsername: { type: String, default: '' },
  publicRepos: { type: Number, default: 0 },
  publicGists: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  accountCreatedAt: { type: Date },
  profileUpdatedAt: { type: Date },
  lastAnalyzedAt: { type: Date, default: Date.now },

  repositories: [{
    githubRepoId: Number,
    name: { type: String, required: true },
    fullName: String,
    htmlUrl: String,
    description: { type: String, default: '' },
    owner: String,
    ownerType: String,
    isFork: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    visibility: { type: String, default: 'public' },
    createdAt: Date,
    updatedAt: Date,
    pushedAt: Date,
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    watchers: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
    defaultBranch: { type: String, default: 'main' },
    primaryLanguage: { type: String, default: '' },
    languages: [{
      name: String,
      bytes: Number,
      percentage: Number,
    }],
    detectedTechnologies: [String],
    dependencyFilesFound: [String],
    topics: [String],
    license: { type: String, default: null },
    openIssues: { type: Number, default: 0 },
    ownershipStatus: {
      type: String,
      enum: ['OWNED', 'FORKED', 'COLLABORATION', 'UNKNOWN'],
      default: 'OWNED',
    },
    recencyStatus: {
      type: String,
      enum: ['ACTIVE', 'RECENTLY_ACTIVE', 'STALE', 'ARCHIVED'],
      default: 'RECENTLY_ACTIVE',
    },
    evidenceStrength: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW', 'NONE'],
      default: 'MEDIUM',
    },
    readmeSnippet: { type: String, default: '' },
    hasReadme: { type: Boolean, default: false },
    hasDependencies: { type: Boolean, default: false },
    matchedResumeProjects: [{
      resumeProjectName: String,
      matchStatus: {
        type: String,
        enum: ['MATCHED', 'POSSIBLE_MATCH', 'NO_MATCH'],
        default: 'NO_MATCH',
      },
      matchScore: Number,
      matchReason: String,
    }],
  }],

  statistics: {
    totalRepositories: { type: Number, default: 0 },
    originalRepositories: { type: Number, default: 0 },
    forkedRepositories: { type: Number, default: 0 },
    archivedRepositories: { type: Number, default: 0 },
    activeRepositories: { type: Number, default: 0 },
    staleRepositories: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    languages: [{
      name: String,
      count: Number,
      bytes: Number,
    }],
    detectedTechnologies: [String],
    verifiedResumeSkillsCount: { type: Number, default: 0 },
    matchedProjectsCount: { type: Number, default: 0 },
  },

  insights: [String],
}, {
  timestamps: true,
});

gitHubProfileSchema.index({ candidateId: 1, lastAnalyzedAt: -1 });
gitHubProfileSchema.index({ username: 1 });

module.exports = mongoose.models.GitHubProfile || mongoose.model('GitHubProfile', gitHubProfileSchema);
