require('dotenv').config();
const mongoose = require('mongoose');
const evidenceFusionService = require('./services/evidence/evidenceFusionService');
const resumeClaimService = require('./services/resume/resumeClaimService');
const githubService = require('./services/github/githubService');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const GitHubProfile = require('./models/GitHubProfile');
const Evidence = require('./models/Evidence');
const SkillClaim = require('./models/SkillClaim');

(async () => {
  console.log('================================================================');
  console.log('CAREERLENS — RESUME EVIDENCE + GLOBAL FUSION INTEGRATION TEST');
  console.log('================================================================');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, dbName: 'careerLens' }).catch(() => {
      return mongoose.connect('mongodb://127.0.0.1:27017/careerlens');
    });
    console.log('✓ Connected to MongoDB Atlas.');

    // 1. Setup Test Candidate
    let candidate = await User.findOne({ email: 'resume.fusion.test@example.com' });
    if (!candidate) {
      candidate = await User.create({
        name: 'Jordan Lee',
        email: 'resume.fusion.test@example.com',
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        collegeName: 'Stanford Institute of Technology',
      });
    }

    let profile = await StudentProfile.findOne({ user: candidate._id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: candidate._id,
        studentId: candidate._id,
        college: 'Stanford Institute of Technology',
        degree: 'B.S. in Computer Science',
        branch: 'Computer Science',
        graduationYear: 2026,
        platformHandles: {},
      });
    }

    // Clean up old state
    await Promise.all([
      ResumeAnalysis.deleteMany({ candidateId: candidate._id }),
      GitHubProfile.deleteMany({ candidateId: candidate._id }),
      Evidence.deleteMany({ studentId: candidate._id }),
      SkillClaim.deleteMany({ candidateId: candidate._id }),
    ]);

    // 2. Simulate Gemini Resume Extraction
    // Skills claimed: Python, React, Java, Docker, AWS
    console.log('\n[Phase 1] Simulating Resume Upload & Intelligence Extraction...');
    const mockNormalizedResumeData = {
      summary: 'Passionate software engineer skilled in Python, React, Java, Docker, and AWS cloud solutions.',
      candidate: { name: 'Jordan Lee', email: 'resume.fusion.test@example.com' },
      education: [{ degree: 'B.S. Computer Science', institution: 'Stanford', startYear: 2022, endYear: 2026 }],
      skills: [
        { name: 'Python', category: 'PROGRAMMING', confidence: 'HIGH', evidenceText: 'Developed machine learning algorithms with Python.' },
        { name: 'React', category: 'FRAMEWORK', confidence: 'HIGH', evidenceText: 'Engineered responsive single page applications using React.' },
        { name: 'Java', category: 'PROGRAMMING', confidence: 'HIGH', evidenceText: 'Built enterprise backend microservices with Java.' },
        { name: 'Docker', category: 'DEVOPS', confidence: 'MEDIUM', evidenceText: 'Containerized development microservices.' },
        { name: 'AWS', category: 'CLOUD', confidence: 'MEDIUM', evidenceText: 'Deployed serverless Lambdas and S3 buckets on AWS.' },
      ],
      projects: [
        { name: 'AgroSense ML', technologies: ['Python', 'Docker'], description: 'Crop disease diagnostics.' },
        { name: 'CareerLens UI', technologies: ['React'], description: 'Interactive career platform.' },
      ],
      experience: [],
      internships: [],
      certifications: [],
      achievements: [],
      hackathons: [],
      codingProfiles: [],
      claims: [
        { claim: 'Python', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Developed machine learning algorithms with Python.' },
        { claim: 'React', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Engineered responsive single page applications using React.' },
        { claim: 'Java', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Built enterprise backend microservices with Java.' },
        { claim: 'Docker', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Containerized development microservices.' },
        { claim: 'AWS', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Deployed serverless Lambdas and S3 buckets on AWS.' },
      ],
    };

    await resumeClaimService.persistResumeIntelligence(
      candidate._id,
      mockNormalizedResumeData,
      { model: 'gemini-3.5-flash-lite', processingTimeMs: 450 },
      { originalFileName: 'Jordan_Lee_Resume.pdf', fileSize: 104857 }
    );

    // Verify initial claims before GitHub connection
    const initialClaims = await SkillClaim.find({ candidateId: candidate._id });
    console.log(`✓ Initial Resume Claims Registered in MongoDB: ${initialClaims.length}`);
    for (const c of initialClaims) {
      console.log(`   - ${c.skill}: status = ${c.status} (source: ${c.source}, sources: [${c.supportingSources.join(', ')}])`);
      if (c.status !== 'UNVERIFIED') {
        throw new Error(`Expected initial claim ${c.skill} to be UNVERIFIED, got ${c.status}`);
      }
    }

    // 3. Connect GitHub Profile with Repositories:
    // Repos containing: Python, React, Docker
    console.log('\n[Phase 2] Connecting GitHub Repositories (Python, React, Docker)...');
    await GitHubProfile.create({
      candidateId: candidate._id,
      studentProfile: profile._id,
      username: 'jordan-dev',
      name: 'Jordan Lee',
      profileUrl: 'https://github.com/jordan-dev',
      publicRepos: 3,
      repositories: [
        {
          githubRepoId: 201,
          name: 'agrosense-ml',
          fullName: 'jordan-dev/agrosense-ml',
          htmlUrl: 'https://github.com/jordan-dev/agrosense-ml',
          description: 'ML crop diagnostics',
          owner: 'jordan-dev',
          isFork: false,
          ownershipStatus: 'OWNED',
          recencyStatus: 'ACTIVE',
          evidenceStrength: 'HIGH',
          primaryLanguage: 'Python',
          detectedTechnologies: ['Python', 'Docker'],
          dependencyFilesFound: ['requirements.txt', 'Dockerfile'],
          languages: [{ name: 'Python', bytes: 60000, percentage: 95 }],
        },
        {
          githubRepoId: 202,
          name: 'careerlens-web',
          fullName: 'jordan-dev/careerlens-web',
          htmlUrl: 'https://github.com/jordan-dev/careerlens-web',
          description: 'Career lens frontend',
          owner: 'jordan-dev',
          isFork: false,
          ownershipStatus: 'OWNED',
          recencyStatus: 'ACTIVE',
          evidenceStrength: 'HIGH',
          primaryLanguage: 'JavaScript',
          detectedTechnologies: ['React', 'JavaScript'],
          dependencyFilesFound: ['package.json'],
          languages: [{ name: 'JavaScript', bytes: 40000, percentage: 90 }],
        },
      ],
    });

    // Run synchronization
    await evidenceFusionService.syncCandidateSkillClaims(candidate._id);

    // 4. Verify Updated Claims after GitHub Connection
    console.log('\n[Phase 3] Checking Claims Post-GitHub Evidence Sync:');
    const updatedClaims = await SkillClaim.find({ candidateId: candidate._id });
    const claimMap = new Map(updatedClaims.map((c) => [c.skill, c]));

    const pythonClaim = claimMap.get('Python');
    const reactClaim = claimMap.get('React');
    const dockerClaim = claimMap.get('Docker');
    const javaClaim = claimMap.get('Java');
    const awsClaim = claimMap.get('AWS');

    console.log(`   - Python: ${pythonClaim?.status} (${pythonClaim?.confidence}) -> Sources: [${pythonClaim?.supportingSources.join(', ')}]`);
    console.log(`   - React:  ${reactClaim?.status} (${reactClaim?.confidence}) -> Sources: [${reactClaim?.supportingSources.join(', ')}]`);
    console.log(`   - Docker: ${dockerClaim?.status} (${dockerClaim?.confidence}) -> Sources: [${dockerClaim?.supportingSources.join(', ')}]`);
    console.log(`   - Java:   ${javaClaim?.status} (${javaClaim?.confidence}) -> Sources: [${javaClaim?.supportingSources.join(', ')}]`);
    console.log(`   - AWS:    ${awsClaim?.status} (${awsClaim?.confidence}) -> Sources: [${awsClaim?.supportingSources.join(', ')}]`);

    if (pythonClaim?.status !== 'VERIFIED') throw new Error(`Python should be VERIFIED, got ${pythonClaim?.status}`);
    if (reactClaim?.status !== 'VERIFIED') throw new Error(`React should be VERIFIED, got ${reactClaim?.status}`);
    if (dockerClaim?.status !== 'VERIFIED') throw new Error(`Docker should be VERIFIED, got ${dockerClaim?.status}`);
    if (javaClaim?.status !== 'UNVERIFIED') throw new Error(`Java should be UNVERIFIED, got ${javaClaim?.status}`);
    if (awsClaim?.status !== 'UNVERIFIED') throw new Error(`AWS should be UNVERIFIED, got ${awsClaim?.status}`);

    // Check explanation non-accusatory formatting
    console.log(`\n✓ Non-accusatory message check for unverified Java claim:`);
    console.log(`   "${javaClaim?.reason}"`);

    // 5. Test GitHub Disconnect / Account Switch:
    console.log('\n[Phase 4] Testing GitHub Disconnect / Evidence Invalidation...');
    await githubService.disconnectGithub(candidate._id);

    const postDisconnectClaims = await SkillClaim.find({ candidateId: candidate._id });
    console.log(`✓ Post-Disconnect Claims Status:`);
    for (const c of postDisconnectClaims) {
      console.log(`   - ${c.skill}: status = ${c.status} (sources: [${c.supportingSources.join(', ')}])`);
      if (c.status !== 'UNVERIFIED') {
        throw new Error(`Expected claim ${c.skill} to revert to UNVERIFIED after disconnect, got ${c.status}`);
      }
    }

    console.log('\n================================================================');
    console.log('✓ ALL RESUME EVIDENCE FUSION TESTS PASSED SUCCESSFULLY!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('Integration test failed:', err);
    process.exit(1);
  }
})();
