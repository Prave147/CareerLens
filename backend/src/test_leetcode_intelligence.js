require('dotenv').config();
const mongoose = require('mongoose');
const evidenceFusionService = require('./services/evidence/evidenceFusionService');
const resumeClaimService = require('./services/resume/resumeClaimService');
const leetcodeService = require('./services/leetcode/leetcodeService');
const leetcodeEvaluator = require('./services/leetcode/leetcodeEvaluator');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const GitHubProfile = require('./models/GitHubProfile');
const LeetCodeProfile = require('./models/LeetCodeProfile');
const Evidence = require('./models/Evidence');
const SkillClaim = require('./models/SkillClaim');

(async () => {
  console.log('================================================================');
  console.log('CAREERLENS — LEETCODE INTELLIGENCE V1 INTEGRATION TEST');
  console.log('================================================================');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerlens';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, dbName: 'careerLens' }).catch(() => {
      return mongoose.connect('mongodb://127.0.0.1:27017/careerlens');
    });
    console.log('✓ Connected to MongoDB Atlas.');

    // 1. Setup Test Candidate
    let candidate = await User.findOne({ email: 'leetcode.test.student@example.com' });
    if (!candidate) {
      candidate = await User.create({
        name: 'Rohan Gupta',
        email: 'leetcode.test.student@example.com',
        passwordHash: 'dummy_hash',
        role: 'STUDENT',
        collegeName: 'IIT Delhi',
      });
    }

    let profile = await StudentProfile.findOne({ user: candidate._id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: candidate._id,
        studentId: candidate._id,
        college: 'IIT Delhi',
        degree: 'B.Tech in Computer Science',
        branch: 'Computer Science',
        graduationYear: 2026,
        platformHandles: {},
      });
    }

    // Clean up old test data
    await Promise.all([
      ResumeAnalysis.deleteMany({ candidateId: candidate._id }),
      GitHubProfile.deleteMany({ candidateId: candidate._id }),
      LeetCodeProfile.deleteMany({ candidateId: candidate._id }),
      Evidence.deleteMany({ studentId: candidate._id }),
      SkillClaim.deleteMany({ candidateId: candidate._id }),
    ]);

    // 2. Setup Resume Claims:
    // Claims: "Data Structures & Algorithms", "Problem Solving", "React", "AWS"
    console.log('\n[Phase 1] Uploading Resume with DSA + Full-Stack Claims...');
    const mockResumeData = {
      summary: 'Computer Science student skilled in Data Structures & Algorithms, Problem Solving, React, and AWS cloud.',
      candidate: { name: 'Rohan Gupta', email: 'leetcode.test.student@example.com' },
      education: [{ degree: 'B.Tech CSE', institution: 'IIT Delhi', startYear: 2022, endYear: 2026 }],
      skills: [
        { name: 'Data Structures & Algorithms', category: 'PROGRAMMING', confidence: 'HIGH', evidenceText: 'Solved extensive algorithmic challenges and dynamic programming.' },
        { name: 'Problem Solving', category: 'OTHER', confidence: 'HIGH', evidenceText: 'Strong analytical and competitive problem-solving skills.' },
        { name: 'React', category: 'FRAMEWORK', confidence: 'HIGH', evidenceText: 'Built frontend web applications using React.' },
        { name: 'AWS', category: 'CLOUD', confidence: 'MEDIUM', evidenceText: 'Deployed cloud infrastructure on AWS.' },
      ],
      projects: [],
      experience: [],
      internships: [],
      certifications: [],
      achievements: [],
      hackathons: [],
      codingProfiles: [{ platform: 'LEETCODE', username: 'rohan_code_dev' }],
      claims: [
        { claim: 'Data Structures & Algorithms', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Solved extensive algorithmic challenges.' },
        { claim: 'Problem Solving', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Strong analytical problem-solving skills.' },
        { claim: 'React', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Built frontend web applications using React.' },
        { claim: 'AWS', claimType: 'SKILL', sourceSection: 'Skills', sourceText: 'Deployed cloud infrastructure on AWS.' },
      ],
    };

    await resumeClaimService.persistResumeIntelligence(
      candidate._id,
      mockResumeData,
      { model: 'gemini-3.5-flash-lite', processingTimeMs: 400 },
      { originalFileName: 'Rohan_Gupta_Resume.pdf', fileSize: 98000 }
    );

    const initialClaims = await SkillClaim.find({ candidateId: candidate._id });
    console.log(`✓ Initial Resume Claims Registered: ${initialClaims.length}`);
    for (const c of initialClaims) {
      console.log(`   - ${c.skill}: status = ${c.status} (source: ${c.source})`);
    }

    // 3. Test LeetCode Evaluator Thresholds
    console.log('\n[Phase 2] Testing Deterministic Evaluator Thresholds...');
    const lowEval = leetcodeEvaluator.evaluateStrength(15, 2, 0);
    const modEval = leetcodeEvaluator.evaluateStrength(60, 20, 5);
    const strongEval = leetcodeEvaluator.evaluateStrength(160, 80, 20);
    const veryStrongEval = leetcodeEvaluator.evaluateStrength(450, 210, 60, 1780);

    console.log(`   - 15 Solved: ${lowEval} (Expected: LOW)`);
    console.log(`   - 60 Solved: ${modEval} (Expected: MODERATE)`);
    console.log(`   - 160 Solved: ${strongEval} (Expected: STRONG)`);
    console.log(`   - 450 Solved (Contest 1780): ${veryStrongEval} (Expected: VERY_STRONG)`);

    if (lowEval !== 'LOW') throw new Error(`Expected LOW, got ${lowEval}`);
    if (modEval !== 'MODERATE') throw new Error(`Expected MODERATE, got ${modEval}`);
    if (strongEval !== 'STRONG') throw new Error(`Expected STRONG, got ${strongEval}`);
    if (veryStrongEval !== 'VERY_STRONG') throw new Error(`Expected VERY_STRONG, got ${veryStrongEval}`);

    // 4. Connect LeetCode Profile with 450 Solved
    console.log('\n[Phase 3] Simulating LeetCode Connection (450 Problems Solved)...');
    const mockLeetCodeData = {
      username: 'rohan_code_dev',
      profileUrl: 'https://leetcode.com/u/rohan_code_dev/',
      realName: 'Rohan Gupta',
      avatar: 'https://assets.leetcode.com/users/avatar.jpg',
      totalSolved: 450,
      easySolved: 180,
      mediumSolved: 210,
      hardSolved: 60,
      totalQuestions: { total: 3300, easy: 830, medium: 1730, hard: 740 },
      acceptanceRate: 74.5,
      ranking: 18450,
      contestRating: 1780,
      contestGlobalRanking: 3420,
      contestAttended: 14,
      contestTopPercentage: 4.8,
      badges: [{ name: '100 Days Badge 2026', icon: 'badge.png' }],
      languageStats: [
        { languageName: 'C++', problemsSolved: 320 },
        { languageName: 'Python', problemsSolved: 130 },
      ],
      recentSubmissions: [
        { title: 'Binary Tree Maximum Path Sum', titleSlug: 'binary-tree-maximum-path-sum', timestamp: '1728320000', statusDisplay: 'Accepted', lang: 'cpp' },
        { title: 'Trapping Rain Water', titleSlug: 'trapping-rain-water', timestamp: '1728310000', statusDisplay: 'Accepted', lang: 'cpp' },
      ],
    };

    const verifiedSkills = leetcodeEvaluator.generateVerifiedSkills(mockLeetCodeData);
    const dsaEvidenceStrength = leetcodeEvaluator.evaluateStrength(450, 210, 60, 1780);

    const leetcodeDoc = await LeetCodeProfile.create({
      candidateId: candidate._id,
      studentProfile: profile._id,
      ...mockLeetCodeData,
      dsaEvidenceStrength,
      evidenceSummary: `Candidate has solved 450 problems (180 Easy, 210 Medium, 60 Hard) with 74.5% acceptance rate and 1780 contest rating.`,
      verifiedClaims: verifiedSkills,
      lastFetchedAt: new Date(),
    });

    console.log(`✓ LeetCodeProfile Document Created with ${verifiedSkills.length} algorithmic proof items.`);

    // 5. Run Global Evidence Fusion
    await evidenceFusionService.syncCandidateSkillClaims(candidate._id);

    // 6. Verify Claims Verification Isolation & Scope
    console.log('\n[Phase 4] Verifying Claim Verification States:');
    const updatedClaims = await SkillClaim.find({ candidateId: candidate._id });
    const claimMap = new Map(updatedClaims.map((c) => [c.skill, c]));

    const dsaClaim = claimMap.get('Data Structures & Algorithms');
    const psClaim = claimMap.get('Problem Solving');
    const reactClaim = claimMap.get('React');
    const awsClaim = claimMap.get('AWS');

    console.log(`   - DSA:             STATUS = ${dsaClaim?.status} (${dsaClaim?.confidence}) -> Sources: [${dsaClaim?.supportingSources.join(', ')}]`);
    console.log(`   - Problem Solving: STATUS = ${psClaim?.status} (${psClaim?.confidence}) -> Sources: [${psClaim?.supportingSources.join(', ')}]`);
    console.log(`   - React:           STATUS = ${reactClaim?.status} (${reactClaim?.confidence}) -> Sources: [${reactClaim?.supportingSources.join(', ')}]`);
    console.log(`   - AWS:             STATUS = ${awsClaim?.status} (${awsClaim?.confidence}) -> Sources: [${awsClaim?.supportingSources.join(', ')}]`);

    // ASSERTIONS:
    // DSA and Problem Solving MUST be VERIFIED by LeetCode
    if (dsaClaim?.status !== 'VERIFIED') throw new Error(`DSA should be VERIFIED, got ${dsaClaim?.status}`);
    if (psClaim?.status !== 'VERIFIED') throw new Error(`Problem Solving should be VERIFIED, got ${psClaim?.status}`);

    // CRITICAL PRODUCT RULE: React and AWS MUST NOT be verified by LeetCode!
    if (reactClaim?.status !== 'UNVERIFIED') throw new Error(`React MUST remain UNVERIFIED by LeetCode, got ${reactClaim?.status}`);
    if (awsClaim?.status !== 'UNVERIFIED') throw new Error(`AWS MUST remain UNVERIFIED by LeetCode, got ${awsClaim?.status}`);

    console.log('\n✓ Scope Isolation Confirmed: LeetCode did NOT verify unrelated skills (React, AWS).');

    // 7. Test Single Skill Detail with LeetCode Proof
    console.log('\n[Phase 5] Testing Single Skill Evidence for DSA:');
    const singleSkillRes = await evidenceFusionService.getSingleSkillEvidence(candidate._id, 'Data Structures & Algorithms');
    console.log(`   - Verified Reason: "${singleSkillRes.skill?.reason}"`);
    console.log(`   - LeetCode Solved Count: ${singleSkillRes.skill?.leetcodeData?.totalSolved}`);
    console.log(`   - Contest Rating: ${singleSkillRes.skill?.leetcodeData?.contestRating}`);

    if (singleSkillRes.skill?.leetcodeData?.totalSolved !== 450) {
      throw new Error(`Expected 450 solved, got ${singleSkillRes.skill?.leetcodeData?.totalSolved}`);
    }

    // 8. Test Disconnect
    console.log('\n[Phase 6] Testing LeetCode Disconnect & Evidence Invalidation...');
    await leetcodeService.disconnectLeetCode(candidate._id);

    const postDisconnectClaims = await SkillClaim.find({ candidateId: candidate._id });
    const postDsaClaim = postDisconnectClaims.find((c) => c.skill === 'Data Structures & Algorithms');
    console.log(`   - Post-Disconnect DSA Status: ${postDsaClaim?.status} (Sources: [${postDsaClaim?.supportingSources.join(', ')}])`);

    if (postDsaClaim?.status !== 'UNVERIFIED') {
      throw new Error(`Expected DSA to revert to UNVERIFIED after LeetCode disconnect, got ${postDsaClaim?.status}`);
    }

    console.log('\n================================================================');
    console.log('✓ ALL LEETCODE INTELLIGENCE V1 TESTS PASSED SUCCESSFULLY!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('LeetCode integration test failed:', err);
    process.exit(1);
  }
})();
