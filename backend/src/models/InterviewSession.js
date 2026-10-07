const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  project: { type: String, required: true },
  technology: { type: String, required: true },
  question: { type: String, required: true },
  context: { type: String, default: '' },
  sampleKeyPoints: [String],
  userAnswer: { type: String, default: '' },
  evaluation: {
    status: { type: String, enum: ['NOT_ATTEMPTED', 'EVALUATED'], default: 'NOT_ATTEMPTED' },
    score: { type: Number, default: 0 }, // 0 - 10
    verdict: { type: String, default: '' },
    strengths: [String],
    areasOfImprovement: [String],
    feedback: { type: String, default: '' },
  }
});

const interviewSessionSchema = new mongoose.Schema({
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true,
  },
  title: {
    type: String,
    default: 'Project Architecture & Technical Defense Simulation',
  },
  questions: [interviewQuestionSchema],
  overallFeedback: {
    averageScore: { type: Number, default: 0 },
    summary: { type: String, default: 'Interview readiness simulation initialized.' },
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
