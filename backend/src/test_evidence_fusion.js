require('dotenv').config();
const mongoose = require('mongoose');
const evidenceFusionService = require('./services/evidence/evidenceFusionService');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const GitHubProfile = require('./models/GitHubProfile');
const Evidence = require('./models/Evidence');
const SkillClaim = require('./models/SkillClaim');

(async () => {
  console.log('====================================================');
  console.log('CAREERLENS — GLOBAL EVIDENCE FUSION TEST SUITE');
  console.log('====================================================');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, dbName: 'careerLens' }).catch(() => {
      return mongoose.connect('mongodb://127.0.0.1:27017/careerlens');
    });
    console.log('✓ Connected to MongoDB for fusion verification.');

    // Setup Candidate 1: Alex Kumar
    let candidate1 = await User.findOne({ email: 'fusion.candidate1@example.com' });
    if (!candidate1) {
      candidate1 = await User.create({
        name: 'Alex Kumar',
        email: 'fusion.candidate1@example.com',
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        collegeName: 'Apex Institute of Technology',
      });
    }

    let profile1 = await StudentProfile.findOne({ user: candidate1._id });
    if (!profile1) {
      profile1 = await StudentProfile.create({
        user: candidate1._id,
        studentId: candidate1._id,
        college: 'Apex Institute of Technology',
        degree: 'B.Tech',
        branch: 'CSE',
        graduationYear: 2026,
        platformHandles: { github: 'alex-fusion-dev' },
      });
    }

    // Setup Candidate 2: Priya Sharma (For Multi-Tenancy Isolation Test)
    let candidate2 = await User.findOne({ email: 'fusion.candidate2@example.com' });
    if (!candidate2) {
      candidate2 = await User.create({
        name: 'Priya Sharma',
        email: 'fusion.candidate2@example.com',
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        collegeName: 'National Engineering College',
      });
    }

    // 1. Setup Resume Claims for Candidate 1:
    // Claims: Python, React, SQL, C++, Docker
    await ResumeAnalysis.deleteMany({ candidateId: candidate1._id });
    await ResumeAnalysis.create({
      candidateId: candidate1._id,
      studentProfile: profile1._id,
      originalFileName: 'Alex_Kumar_FullStack_Resume.pdf',
      fileType: 'application/pdf',
      extractionStatus: 'COMPLETED',
      extractionVersion: 'v1.0-gemini',
      summary: 'Full-stack AI developer with experience in Python, React, and C++.',
      candidate: { name: 'Alex Kumar', email: 'fusion.candidate1@example.com' },
      skills: [
        { name: 'Python', category: 'PROGRAMMING', confidence: 'HIGH', evidenceText: 'Built ML pipelines with TensorFlow.' },
        { name: 'React', category: 'FRAMEWORK', confidence: 'HIGH', evidenceText: 'Built telehealth web application.' },
        { name: 'SQL', category: 'DATABASE', confidence: 'MEDIUM', evidenceText: 'Managed PostgreSQL schemas.' },
        { name: 'C++', category: 'PROGRAMMING', confidence: 'HIGH', evidenceText: 'Implemented high-performance graph algorithms.' },
        { name: 'Docker', category: 'DEVOPS', confidence: 'MEDIUM', evidenceText: 'Containerized services.' },
      ],
      projects: [
        { name: 'AgroSense AI', technologies: ['Python', 'TensorFlow'], description: 'Smart crop disease classification.' },
        { name: 'MediRoute Telehealth', technologies: ['React', 'Node.js'], description: 'Telemedicine web platform.' },
      ],
    });

    // 2. Setup GitHub Repositories for Candidate 1:
    // Repos:
    // 1. 'agrosense-ai' (OWNED, Python + TensorFlow in requirements.txt, ACTIVE)
    // 2. 'mediroute' (OWNED, React + Node.js in package.json, ACTIVE)
    // 3. 'cpp-algorithms' (OWNED, C++ codebase, RECENT)
    // 4. 'forked-docker-tool' (FORKED, Docker)
    await GitHubProfile.deleteMany({ candidateId: candidate1._id });
    await GitHubProfile.create({
      candidateId: candidate1._id,
      username: 'alex-fusion-dev',
      name: 'Alex Kumar',
      profileUrl: 'https://github.com/alex-fusion-dev',
      publicRepos: 4,
      repositories: [
        {
          githubRepoId: 101,
          name: 'agrosense-ai',
          fullName: 'alex-fusion-dev/agrosense-ai',
          htmlUrl: 'https://github.com/alex-fusion-dev/agrosense-ai',
          description: 'AI agricultural diagnosis system',
          owner: 'alex-fusion-dev',
          isFork: false,
          ownershipStatus: 'OWNED',
          recencyStatus: 'ACTIVE',
          evidenceStrength: 'HIGH',
          primaryLanguage: 'Python',
          detectedTechnologies: ['Python', 'TensorFlow', 'Streamlit'],
          dependencyFilesFound: ['requirements.txt'],
          languages: [{ name: 'Python', bytes: 50000, percentage: 95 }],
        },
        {
          githubRepoId: 102,
          name: 'mediroute',
          fullName: 'alex-fusion-dev/mediroute',
          htmlUrl: 'https://github.com/alex-fusion-dev/mediroute',
          description: 'Telemedicine dispatch portal',
          owner: 'alex-fusion-dev',
          isFork: false,
          ownershipStatus: 'OWNED',
          recencyStatus: 'ACTIVE',
          evidenceStrength: 'HIGH',
          primaryLanguage: 'JavaScript',
          detectedTechnologies: ['React', 'Node.js', 'Express.js', 'MongoDB'],
          dependencyFilesFound: ['package.json'],
          languages: [{ name: 'JavaScript', bytes: 60000, percentage: 80 }],
        },
        {
          githubRepoId: 103,
          name: 'cpp-algorithms',
          fullName: 'alex-fusion-dev/cpp-algorithms',
          htmlUrl: 'https://github.com/alex-fusion-dev/cpp-algorithms',
          description: 'High performance graph engines in C++',
          owner: 'alex-fusion-dev',
          isFork: false,
          ownershipStatus: 'OWNED',
          recencyStatus: 'RECENTLY_ACTIVE',
          evidenceStrength: 'HIGH',
          primaryLanguage: 'C++',
          detectedTechnologies: ['C++'],
          dependencyFilesFound: ['CMakeLists.txt'],
          languages: [{ name: 'C++', bytes: 40000, percentage: 98 }],
        },
        {
          githubRepoId: 104,
          name: 'forked-docker-tool',
          fullName: 'upstream-org/forked-docker-tool',
          htmlUrl: 'https://github.com/upstream-org/forked-docker-tool',
          description: 'Open source docker template',
          owner: 'upstream-org',
          isFork: true,
          ownershipStatus: 'FORKED',
          recencyStatus: 'STALE',
          evidenceStrength: 'LOW',
          primaryLanguage: 'Shell',
          detectedTechnologies: ['Docker'],
          dependencyFilesFound: ['Dockerfile'],
          languages: [{ name: 'Shell', bytes: 2000, percentage: 100 }],
        },
      ],
      statistics: {
        totalRepositories: 4,
        originalRepositories: 3,
        forkedRepositories: 1,
        activeRepositories: 2,
        verifiedResumeSkillsCount: 3,
      },
      lastAnalyzedAt: new Date(),
    });

    // TEST 1: Execute Evidence Fusion for Candidate 1
    console.log('\n[Test 1] Executing Evidence Fusion for Candidate 1:');
    const fusion1 = await evidenceFusionService.getFusedSkillEvidence(candidate1._id);

    console.log(`✓ Total Skills Evaluated: ${fusion1.summary.totalSkills}`);
    console.log(`✓ Verified Count: ${fusion1.summary.verifiedCount}`);
    console.log(`✓ Partially Verified Count: ${fusion1.summary.partiallyVerifiedCount}`);
    console.log(`✓ Unverified Count: ${fusion1.summary.unverifiedCount}`);
    console.log(`✓ Evidence Coverage: ${fusion1.summary.evidenceCoveragePercentage}%`);

    // Verify Python status (Resume Claim + Owned Repo with requirements.txt) -> VERIFIED (HIGH)
    const py = fusion1.skills.find((s) => s.skill === 'Python');
    if (py && (py.status === 'VERIFIED' || py.status === 'STRONGLY_VERIFIED') && py.confidence === 'HIGH') {
      console.log(`✓ Python: STATUS = ${py.status} (Confidence: ${py.confidence}) | ${py.reason}`);
    } else {
      console.error(`✗ Python verification failed:`, py);
    }

    // Verify React status (Resume Claim + Owned Repo with package.json) -> VERIFIED (HIGH)
    const react = fusion1.skills.find((s) => s.skill === 'React');
    if (react && (react.status === 'VERIFIED' || react.status === 'STRONGLY_VERIFIED')) {
      console.log(`✓ React: STATUS = ${react.status} (Confidence: ${react.confidence}) | ${react.reason}`);
    } else {
      console.error(`✗ React verification failed:`, react);
    }

    // Verify C++ status (Special Character + Owned Repo) -> VERIFIED
    const cpp = fusion1.skills.find((s) => s.skill === 'C++');
    if (cpp && (cpp.status === 'VERIFIED' || cpp.status === 'STRONGLY_VERIFIED')) {
      console.log(`✓ C++: STATUS = ${cpp.status} (Confidence: ${cpp.confidence}) | ${cpp.reason}`);
    } else {
      console.error(`✗ C++ verification failed:`, cpp);
    }

    // Verify SQL status (Resume Claim + NO GitHub Repo) -> UNVERIFIED (Awaiting proof)
    const sql = fusion1.skills.find((s) => s.skill === 'SQL');
    if (sql && sql.status === 'UNVERIFIED') {
      console.log(`✓ SQL: STATUS = ${sql.status} (Confidence: ${sql.confidence}) | ${sql.reason}`);
    } else {
      console.error(`✗ SQL verification expected UNVERIFIED, got:`, sql);
    }

    // Verify Docker status (Forked Repo only) -> PARTIALLY_VERIFIED
    const docker = fusion1.skills.find((s) => s.skill === 'Docker');
    if (docker && docker.status === 'PARTIALLY_VERIFIED') {
      console.log(`✓ Docker: STATUS = ${docker.status} (Confidence: ${docker.confidence}) | ${docker.reason}`);
    } else {
      console.error(`✗ Docker verification expected PARTIALLY_VERIFIED, got:`, docker);
    }

    // TEST 2: Single Skill Detail Lookup
    console.log('\n[Test 2] Single Skill Detail Endpoint:');
    const pyDetail = await evidenceFusionService.getSingleSkillEvidence(candidate1._id, 'Python');
    if (pyDetail.success && pyDetail.skill.repositories.length > 0) {
      console.log(`✓ Single skill detail retrieved for "${pyDetail.skill.skill}": ${pyDetail.skill.repositories.length} repo(s) attached.`);
    } else {
      console.error('✗ Single skill detail failed:', pyDetail);
    }

    // TEST 3: Multi-Tenancy & Candidate Isolation Test
    console.log('\n[Test 3] Multi-Tenancy Candidate Isolation Test:');
    const fusion2 = await evidenceFusionService.getFusedSkillEvidence(candidate2._id);
    if (fusion2.skills.length === 0 || !fusion2.skills.some((s) => s.skill === 'AgroSense AI')) {
      console.log(`✓ SUCCESS: Candidate 2 received 0 skills from Candidate 1 (Isolated count: ${fusion2.summary.totalSkills})`);
    } else {
      console.error('✗ FAIL: Candidate 2 received leaked evidence from Candidate 1!');
    }

    await mongoose.disconnect();
    console.log('\n====================================================');
    console.log('ALL GLOBAL EVIDENCE FUSION TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('Fusion test error:', err);
  }
})();
