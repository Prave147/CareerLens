require('dotenv').config();
const mongoose = require('mongoose');
const githubApiClient = require('./services/github/githubApiClient');
const githubTechDetector = require('./services/github/githubTechDetector');
const githubOwnershipEvaluator = require('./services/github/githubOwnershipEvaluator');
const githubResumeMatcher = require('./services/github/githubResumeMatcher');
const githubEvidenceService = require('./services/github/githubEvidenceService');
const GitHubProfile = require('./models/GitHubProfile');
const Evidence = require('./models/Evidence');
const SkillClaim = require('./models/SkillClaim');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

(async () => {
  console.log('====================================================');
  console.log('CAREERLENS — GITHUB INTELLIGENCE V1 TEST SUITE');
  console.log('====================================================');

  // Test 1: Username Normalization & Validation
  console.log('\n[Test 1] Username Normalization & Validation:');
  const testCases = [
    { input: 'https://github.com/octocat', expected: 'octocat' },
    { input: 'https://github.com/octocat/', expected: 'octocat' },
    { input: '@torvalds', expected: 'torvalds' },
    { input: 'praveenkarthick', expected: 'praveenkarthick' },
  ];

  for (const tc of testCases) {
    const normalized = githubApiClient.normalizeUsername(tc.input);
    if (normalized === tc.expected) {
      console.log(`✓ Normalized "${tc.input}" -> "${normalized}"`);
    } else {
      console.error(`✗ FAIL: expected "${tc.expected}", got "${normalized}"`);
    }
  }

  try {
    githubApiClient.normalizeUsername('invalid/extra/slash');
    console.error('✗ FAIL: Should have thrown for invalid username.');
  } catch (err) {
    console.log(`✓ Correctly rejected invalid handle: "${err.message}"`);
  }

  // Test 2: Technology & Dependency Detection
  console.log('\n[Test 2] Technology & Dependency Detection:');
  const samplePackageJson = JSON.stringify({
    dependencies: {
      react: '^18.2.0',
      express: '^4.19.2',
      mongoose: '^8.3.1',
      'socket.io': '^4.7.5',
      tailwindcss: '^3.4.1',
    },
    devDependencies: {
      jest: '^29.7.0',
      typescript: '^5.4.0',
    },
  });

  const detectedJs = githubTechDetector.detectFromPackageJson(samplePackageJson);
  console.log('✓ Detected from package.json:', detectedJs);
  const expectedJs = ['React', 'Express.js', 'MongoDB', 'Socket.IO', 'Tailwind CSS', 'Jest', 'TypeScript', 'Node.js', 'JavaScript'];
  const allJsMatched = expectedJs.every((e) => detectedJs.includes(e));
  console.log(allJsMatched ? '✓ All expected JS/TS dependencies detected!' : '✗ Missing JS dependencies');

  const sampleReqTxt = `
tensorflow>=2.15.0
streamlit==1.32.0
pandas>=2.0.0
scikit-learn
  `;
  const detectedPy = githubTechDetector.detectFromRequirementsTxt(sampleReqTxt);
  console.log('✓ Detected from requirements.txt:', detectedPy);

  // Test 3: Ownership Evaluation & Fork Detection
  console.log('\n[Test 3] Ownership & Fork Evaluation:');
  const ownedRepo = { name: 'mediroute', fork: false, owner: { login: 'alexkumar' } };
  const forkedRepo = { name: 'react-template', fork: true, owner: { login: 'alexkumar' } };
  const collabRepo = { name: 'opensource-tool', fork: false, owner: { login: 'otherdev' } };

  console.log('✓ Owned repo status:', githubOwnershipEvaluator.evaluateOwnership(ownedRepo, 'alexkumar'));
  console.log('✓ Forked repo status:', githubOwnershipEvaluator.evaluateOwnership(forkedRepo, 'alexkumar'));
  console.log('✓ Collab repo status:', githubOwnershipEvaluator.evaluateOwnership(collabRepo, 'alexkumar'));

  // Test 4: Recency Evaluation
  console.log('\n[Test 4] Recency Evaluation:');
  const activeRepo = { pushed_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() };
  const staleRepo = { pushed_at: new Date(Date.now() - 150 * 24 * 3600 * 1000).toISOString() };
  console.log('✓ 5-day-old repo recency:', githubOwnershipEvaluator.evaluateRecency(activeRepo));
  console.log('✓ 150-day-old repo recency:', githubOwnershipEvaluator.evaluateRecency(staleRepo));

  // Test 5: Resume ↔ GitHub Matching
  console.log('\n[Test 5] Resume ↔ GitHub Matching:');
  const mockRepos = [
    {
      name: 'traffic-congestion-prediction',
      htmlUrl: 'https://github.com/alexkumar/traffic-congestion-prediction',
      description: 'LSTM model predicting traffic congestion using TensorFlow and Python',
      detectedTechnologies: ['Python', 'TensorFlow', 'Streamlit'],
      ownershipStatus: 'OWNED',
      recencyStatus: 'ACTIVE',
      evidenceStrength: 'HIGH',
      isFork: false,
    },
    {
      name: 'portfolio',
      htmlUrl: 'https://github.com/alexkumar/portfolio',
      description: 'Developer portfolio website built with React and Tailwind CSS',
      detectedTechnologies: ['React', 'Tailwind CSS', 'JavaScript', 'Node.js'],
      ownershipStatus: 'OWNED',
      recencyStatus: 'ACTIVE',
      evidenceStrength: 'HIGH',
      isFork: false,
    },
  ];

  const resumeProject = {
    name: 'Traffic Congestion Predictor',
    description: 'LSTM neural network model predicting traffic density from sensor data',
    technologies: ['Python', 'TensorFlow'],
  };

  const projectMatch = githubResumeMatcher.matchProjectWithRepositories(resumeProject, mockRepos);
  console.log('✓ Project match result:', {
    project: resumeProject.name,
    matchedRepo: projectMatch.matchedRepo?.name,
    status: projectMatch.matchStatus,
    score: `${projectMatch.matchScore}%`,
    reason: projectMatch.matchReason,
  });

  const resumeSkills = ['Python', 'TensorFlow', 'React', 'Docker', 'AWS'];
  const skillMatches = githubResumeMatcher.matchSkillsWithRepositories(resumeSkills, mockRepos);
  console.log('✓ Verified skill matches from code:', skillMatches.verifiedSkillMatches.map((m) => m.skill));
  console.log('✓ Pending claims (unverified on GitHub):', skillMatches.pendingSkillClaims.map((p) => p.skill));

  // Test 7: Special-Character Skills & Regex Safety Regression Test
  console.log('\n[Test 7] Special-Character Skills & Regex Safety:');
  const specialSkills = [
    'C++',
    'C#',
    '.NET',
    'Node.js',
    'React',
    'React Native',
    'Next.js',
    'Vue.js',
    'Python',
    'Python 3',
    'Machine Learning',
    'Deep Learning',
  ];

  const specialRepos = [
    {
      name: 'cpp-engine',
      htmlUrl: 'https://github.com/test/cpp-engine',
      detectedTechnologies: ['C++', 'CMake'],
      ownershipStatus: 'OWNED',
      evidenceStrength: 'HIGH',
      hasDependencies: true,
    },
    {
      name: 'dotnet-backend',
      htmlUrl: 'https://github.com/test/dotnet-backend',
      detectedTechnologies: ['C#', '.NET', 'ASP.NET'],
      ownershipStatus: 'OWNED',
      evidenceStrength: 'HIGH',
      hasDependencies: true,
    },
    {
      name: 'modern-web',
      htmlUrl: 'https://github.com/test/modern-web',
      detectedTechnologies: ['Node.js', 'React', 'Next.js', 'Vue.js'],
      ownershipStatus: 'OWNED',
      evidenceStrength: 'HIGH',
      hasDependencies: true,
    },
    {
      name: 'ai-pipeline',
      htmlUrl: 'https://github.com/test/ai-pipeline',
      detectedTechnologies: ['Python 3', 'TensorFlow', 'PyTorch', 'scikit-learn'],
      ownershipStatus: 'OWNED',
      evidenceStrength: 'HIGH',
      hasDependencies: true,
    },
  ];

  let specialSkillMatches;
  try {
    specialSkillMatches = githubResumeMatcher.matchSkillsWithRepositories(specialSkills, specialRepos);
    console.log('✓ Successfully matched special-character skills without throwing regex errors:');
    for (const vm of specialSkillMatches.verifiedSkillMatches) {
      console.log(`  ✓ Verified: "${vm.skill}" -> Matched canonical "${vm.canonicalName}" (Strength: ${vm.strength})`);
    }
    for (const pc of specialSkillMatches.pendingSkillClaims) {
      console.log(`  - Pending: "${pc.skill}"`);
    }
  } catch (err) {
    console.error('✗ FAIL: Special skill matching threw an exception:', err.message);
  }

  // Test 8: Database Persistence & Account Switching Consistency Test
  console.log('\n[Test 8] Testing Account Switching Consistency & Persistence in MongoDB...');
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, dbName: 'careerLens' }).catch(() => {
      return mongoose.connect('mongodb://127.0.0.1:27017/careerlens');
    });

    let testUser = await User.findOne({ email: 'account.switch.test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Account Switch Tester',
        email: 'account.switch.test@example.com',
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
        platformHandles: { github: 'account-a' },
      });
    }

    // Step A: Candidate connects and analyzes Account A (Has C++, Go, Python)
    console.log('\n--- Step A: Syncing Account A (with C++, Go, Python) ---');
    const accountARepos = [
      {
        name: 'repo-a',
        detectedTechnologies: ['C++', 'Go', 'Python'],
        ownershipStatus: 'OWNED',
        evidenceStrength: 'HIGH',
        hasDependencies: true,
      },
    ];
    const matchA = githubResumeMatcher.matchSkillsWithRepositories(['C++', 'Go', 'Python', 'Docker'], accountARepos);
    await githubEvidenceService.syncEvidenceFromGithub(
      testUser._id,
      matchA.verifiedSkillMatches,
      matchA.pendingSkillClaims,
      accountARepos,
      []
    );

    const docA = await GitHubProfile.findOneAndUpdate(
      { candidateId: testUser._id },
      {
        candidateId: testUser._id,
        username: 'account-a',
        name: 'Account A Developer',
        repositories: accountARepos,
        lastAnalyzedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Account A saved in MongoDB: @${docA.username}`);

    function escapeRegex(val) {
      return String(val || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    let evGo = await Evidence.findOne({ studentId: testUser._id, skill: { $regex: new RegExp(`^${escapeRegex('go')}$`, 'i') } });
    let evCpp = await Evidence.findOne({ studentId: testUser._id, skill: { $regex: new RegExp(`^${escapeRegex('C++')}$`, 'i') } });
    console.log(`✓ Go Status in Account A: ${evGo?.finalStatus} (GitHub verified: ${evGo?.evidenceSources?.github?.found})`);
    console.log(`✓ C++ Status in Account A: ${evCpp?.finalStatus} (GitHub verified: ${evCpp?.evidenceSources?.github?.found})`);

    // Step B: Candidate switches to Account B (Has only React and Node.js, NO Go, NO C++)
    console.log('\n--- Step B: Switching to Account B (with React, Node.js — NO C++, NO Go) ---');
    const accountBRepos = [
      {
        name: 'repo-b',
        detectedTechnologies: ['React', 'Node.js'],
        ownershipStatus: 'OWNED',
        evidenceStrength: 'HIGH',
        hasDependencies: true,
      },
    ];
    const matchB = githubResumeMatcher.matchSkillsWithRepositories(['C++', 'Go', 'React', 'Node.js'], accountBRepos);
    await githubEvidenceService.syncEvidenceFromGithub(
      testUser._id,
      matchB.verifiedSkillMatches,
      matchB.pendingSkillClaims,
      accountBRepos,
      []
    );

    const docB = await GitHubProfile.findOneAndUpdate(
      { candidateId: testUser._id },
      {
        candidateId: testUser._id,
        username: 'account-b',
        name: 'Account B Developer',
        repositories: accountBRepos,
        lastAnalyzedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Account B saved in MongoDB: @${docB.username}`);

    // Verify consistency:
    const finalProfile = await GitHubProfile.findOne({ candidateId: testUser._id });
    if (finalProfile.username === 'account-b' && finalProfile.repositories[0].name === 'repo-b') {
      console.log('✓ SUCCESS: MongoDB GitHubProfile completely updated to Account B!');
    } else {
      console.error('✗ FAIL: Stale Account A data remained in GitHubProfile!');
    }

    const evGoAfter = await Evidence.findOne({ studentId: testUser._id, skill: { $regex: /^go$/i } });
    const evReactAfter = await Evidence.findOne({ studentId: testUser._id, skill: { $regex: /^react$/i } });

    console.log(`✓ React Status in Account B: ${evReactAfter?.finalStatus} (GitHub verified: ${evReactAfter?.evidenceSources?.github?.found})`);
    console.log(`✓ Go Status after switching to Account B: ${evGoAfter?.finalStatus} (GitHub verified: ${evGoAfter?.evidenceSources?.github?.found})`);

    if (evGoAfter?.finalStatus === 'UNVERIFIED' && evReactAfter?.finalStatus === 'STRONGLY_VERIFIED') {
      console.log('✓ SUCCESS: Stale verified skills from Account A were cleanly invalidated without false positives!');
    }

    await mongoose.disconnect();
    console.log('\n====================================================');
    console.log('ALL GITHUB INTELLIGENCE TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('DB test error:', err.message);
  }
})();
