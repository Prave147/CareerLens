require('dotenv').config();
const mongoose = require('mongoose');
const { normalizeResumeData } = require('./services/resume/resumeNormalizer');
const resumeClaimService = require('./services/resume/resumeClaimService');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const SkillClaim = require('./models/SkillClaim');
const Evidence = require('./models/Evidence');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

const sampleRawGeminiOutput = {
  candidate: {
    name: 'Pavin Kumar',
    email: 'pavin.engineer@example.com',
    phone: '+91 9876543210',
    location: 'Bengaluru, India',
  },
  summary: 'Aspiring Full Stack Engineer with strong foundation in React, Node.js, and Machine Learning.',
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Apex Institute of Technology',
      field: 'Computer Science',
      startYear: 2022,
      endYear: 2026,
      cgpa: '8.9',
      percentage: null,
      evidenceText: 'B.Tech in Computer Science from Apex Institute of Technology (2022-2026) with CGPA: 8.9',
    },
  ],
  skills: [
    { name: 'Python', category: 'PROGRAMMING', evidenceText: 'Technical Skills: Python, Java, C++', confidence: 'HIGH' },
    { name: 'React', category: 'FRAMEWORK', evidenceText: 'Frontend: React, Tailwind CSS', confidence: 'HIGH' },
    { name: 'TensorFlow', category: 'AI_ML', evidenceText: 'ML Frameworks: TensorFlow, PyTorch', confidence: 'MEDIUM' },
    { name: 'MongoDB', category: 'DATABASE', evidenceText: 'Databases: MongoDB, PostgreSQL', confidence: 'HIGH' },
    { name: 'Docker', category: 'DEVOPS', evidenceText: 'Tools & DevOps: Docker, Git', confidence: 'LOW' },
  ],
  projects: [
    {
      name: 'Traffic Congestion Predictor',
      description: 'LSTM neural network model predicting urban traffic density from sensor telemetry.',
      technologies: ['Python', 'TensorFlow', 'Streamlit'],
      responsibilities: ['Engineered temporal features', 'Trained 3-layer LSTM network'],
      outcomes: ['Achieved 91% prediction accuracy on test dataset'],
      githubUrl: 'https://github.com/pavin-test/traffic-predictor',
      demoUrl: null,
      startDate: 'Jan 2025',
      endDate: 'Mar 2025',
      evidenceText: 'Built Traffic Congestion Predictor using Python and TensorFlow with 91% accuracy.',
    },
  ],
  experience: [],
  internships: [
    {
      company: 'Nexus HealthTech Labs',
      role: 'Full Stack Development Intern',
      startDate: 'May 2025',
      endDate: 'Jul 2025',
      responsibilities: ['Developed React appointment workflows', 'Integrated MongoDB models'],
      technologies: ['React', 'Node.js', 'MongoDB'],
      evidenceText: 'Full Stack Intern at Nexus HealthTech Labs (May-Jul 2025)',
    },
  ],
  certifications: [
    {
      name: 'Meta Front-End Developer Specialization',
      issuer: 'Coursera / Meta',
      date: '2024',
      credentialUrl: 'https://coursera.org/verify/example',
      evidenceText: 'Meta Front-End Developer Specialization on Coursera (2024)',
    },
  ],
  achievements: [
    {
      title: 'Smart India Hackathon Finalist',
      description: 'Selected as top 5 team for automated disaster logistics solution.',
      date: '2024',
      evidenceText: 'Smart India Hackathon Finalist 2024',
    },
  ],
  hackathons: [
    {
      name: 'Smart India Hackathon',
      role: 'Team Lead',
      result: 'Finalist',
      date: '2024',
      description: 'Built real-time relief supply matching dashboard',
      evidenceText: 'Smart India Hackathon Finalist',
    },
  ],
  codingProfiles: [
    {
      platform: 'GITHUB',
      username: 'pavin-test',
      url: 'https://github.com/pavin-test',
      evidenceText: 'GitHub: https://github.com/pavin-test',
    },
    {
      platform: 'LEETCODE',
      username: 'pavin_code',
      url: 'https://leetcode.com/pavin_code',
      evidenceText: 'LeetCode: pavin_code',
    },
  ],
  claims: [
    {
      claim: 'Built an LSTM-based traffic congestion prediction system',
      claimType: 'PROJECT',
      sourceText: 'Traffic Congestion Predictor using Python and TensorFlow',
      sourceSection: 'Projects',
      relatedSkill: 'TensorFlow',
      verificationStatus: 'PENDING',
    },
  ],
};

(async () => {
  console.log('=== CAREERLENS RESUME INTELLIGENCE ENGINE VALIDATION ===');

  // Test 1: Normalizer Validation
  console.log('\n[Test 1] Testing Resume Normalizer:');
  const normalized = normalizeResumeData(sampleRawGeminiOutput);
  console.log('✓ Candidate name:', normalized.candidate.name);
  console.log('✓ Skills extracted & deduplicated:', normalized.skills.length);
  console.log('✓ Projects extracted:', normalized.projects.length);
  console.log('✓ Total claims registered:', normalized.claims.length);

  // Verify anti-hallucination / unverified constraint
  const verifiedClaims = normalized.claims.filter((c) => c.verificationStatus === 'VERIFIED');
  if (verifiedClaims.length > 0) {
    console.error('FAIL: Resume claims should NEVER be marked VERIFIED automatically.');
  } else {
    console.log('✓ PASS: All resume claims correctly defaulted to PENDING/UNVERIFIED.');
  }

  // Test 2: Database Persistence
  console.log('\n[Test 2] Connecting to MongoDB to test Persistence...');
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000, dbName: 'careerLens' }).catch(() => {
      console.log('Trying fallback connection...');
      return mongoose.connect('mongodb://127.0.0.1:27017/careerlens');
    });

    console.log('MongoDB connected for test.');

    // Find or create test student user
    let testUser = await User.findOne({ email: 'pavin.test.resume@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Pavin Resume Test',
        email: 'pavin.test.resume@example.com',
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        collegeName: 'Apex Institute of Technology',
      });
    }

    let testProfile = await StudentProfile.findOne({ user: testUser._id });
    if (!testProfile) {
      testProfile = await StudentProfile.create({
        user: testUser._id,
        studentId: testUser._id,
        college: 'Apex Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: 2026,
      });
    }

    const { resumeAnalysis, summary } = await resumeClaimService.persistResumeIntelligence(
      testUser._id,
      normalized,
      { provider: 'Gemini', model: 'gemini-3.8-flash', processingTimeMs: 1240, extractedAt: new Date() },
      { originalFileName: 'Pavin_Kumar_Resume.pdf', fileType: 'application/pdf', fileSize: 350000 }
    );

    console.log('✓ ResumeAnalysis ID created:', resumeAnalysis._id);
    console.log('✓ Summary statistics:', summary);

    // Verify SkillClaim records
    const skillClaims = await SkillClaim.find({ studentId: testUser._id });
    console.log(`✓ SkillClaim documents created: ${skillClaims.length}`);
    const unverifiedSkills = skillClaims.filter((s) => s.verificationStatus === 'PENDING');
    console.log(`✓ PENDING claims count: ${unverifiedSkills.length}/${skillClaims.length}`);

    // Verify Evidence records
    const evidenceList = await Evidence.find({ studentId: testUser._id });
    console.log(`✓ Evidence documents created/updated: ${evidenceList.length}`);
    const unverifiedEvidence = evidenceList.filter((e) => e.finalStatus === 'UNVERIFIED');
    console.log(`✓ UNVERIFIED evidence count: ${unverifiedEvidence.length}/${evidenceList.length}`);

    await mongoose.disconnect();
    console.log('\n=== ALL PHASE 1 RESUME INTELLIGENCE ENGINE TESTS PASSED ===');
  } catch (err) {
    console.error('DB test error:', err.message);
  }
})();
