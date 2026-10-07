/**
 * CareerLens — DSA Claim & Stability Test Suite
 * Tests DSA normalization across all variations, claim-evidence fusion, and disconnect invalidation.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const assert = require('assert');
const { connectDB } = require('./config/database');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const ResumeAnalysis = require('./models/ResumeAnalysis');
const GitHubProfile = require('./models/GitHubProfile');
const LeetCodeProfile = require('./models/LeetCodeProfile');
const SkillClaim = require('./models/SkillClaim');
const Evidence = require('./models/Evidence');

const { normalizeSkill, isSkillMatch, getCanonicalDisplayName } = require('./utils/skillUtils');
const evidenceFusionService = require('./services/evidence/evidenceFusionService');
const resumeClaimService = require('./services/resume/resumeClaimService');

async function runDsaStabilityTests() {
  console.log('================================================================');
  console.log('CAREERLENS — DSA CLAIM & STABILITY TEST SUITE');
  console.log('================================================================');

  await connectDB();
  console.log('✓ Connected to MongoDB Atlas.\n');

  // -------------------------------------------------------------
  // Test 1: DSA Variation Normalization
  // -------------------------------------------------------------
  console.log('[Test 1] Testing DSA Variation Normalization...');
  const dsaVariations = [
    'DSA',
    'Data Structures and Algorithms',
    'Data Structures & Algorithms',
    'Data Structures & Algorithms (DSA)',
    'Data Structures + Algorithms',
    'data structures and algorithms',
    'data structures algorithms',
    'Data Structures and Algorithm',
  ];

  const expectedCanonicalKey = 'data structures algorithms';

  for (const variation of dsaVariations) {
    const normalized = normalizeSkill(variation);
    assert.strictEqual(
      normalized,
      expectedCanonicalKey,
      `Variation "${variation}" normalized to "${normalized}" instead of "${expectedCanonicalKey}"`
    );
    assert.strictEqual(
      isSkillMatch(variation, 'Data Structures & Algorithms'),
      true,
      `isSkillMatch failed for "${variation}" vs "Data Structures & Algorithms"`
    );
    assert.strictEqual(
      isSkillMatch(variation, 'DSA'),
      true,
      `isSkillMatch failed for "${variation}" vs "DSA"`
    );
    console.log(`   ✓ "${variation}" -> normalized: "${normalized}" (Matched canonical)`);
  }

  // False positive checks
  assert.strictEqual(isSkillMatch('Java', 'JavaScript'), false, 'Java vs JavaScript guard failed');
  assert.strictEqual(isSkillMatch('C', 'C++'), false, 'C vs C++ guard failed');
  assert.strictEqual(isSkillMatch('R', 'React'), false, 'R vs React guard failed');
  console.log('   ✓ False positive guards (Java/JS, C/C++, R/React) confirmed.\n');

  // -------------------------------------------------------------
  // Test 2: Resume Alone -> Claimed & UNVERIFIED
  // -------------------------------------------------------------
  console.log('[Test 2] Simulating Resume Upload with "Strong DSA knowledge" Claim...');
  const testCandidateId = new mongoose.Types.ObjectId();

  let testUser = await User.findById(testCandidateId);
  if (!testUser) {
    testUser = await User.create({
      _id: testCandidateId,
      name: 'DSA Test Student',
      email: `dsa.test.${Date.now()}@careerlens.ai`,
      passwordHash: 'hashed_test_password_123',
      role: 'STUDENT',
      collegeName: 'Apex Institute of Technology',
      membershipStatus: 'ACTIVE',
    });
  }

  const studentProfile = await StudentProfile.create({
    user: testCandidateId,
    studentId: testCandidateId,
    name: 'DSA Test Student',
    college: 'Apex Institute of Technology',
    degree: 'B.Tech',
    branch: 'CSE',
    graduationYear: 2026,
  });

  // Resume claims DSA
  const resumeNormalizedData = {
    summary: 'Candidate with strong problem solving and algorithmic foundation.',
    candidate: { name: 'DSA Test Student', email: testUser.email },
    skills: [
      {
        name: 'Data Structures & Algorithms',
        category: 'OTHER',
        confidence: 'HIGH',
        evidenceText: 'Demonstrated strong DSA problem solving knowledge in college coursework.',
      },
      {
        name: 'React',
        category: 'FRAMEWORK',
        confidence: 'HIGH',
        evidenceText: 'Built React web interfaces.',
      }
    ],
    projects: [],
    experience: [],
    internships: [],
    certifications: [],
    achievements: [],
    hackathons: [],
    codingProfiles: [],
    claims: [],
  };

  await resumeClaimService.persistResumeIntelligence(
    testCandidateId,
    resumeNormalizedData,
    { model: 'gemini-3.5-flash-lite', executionTimeMs: 120 },
    { originalFileName: 'dsa_test_resume.pdf' }
  );

  // Check initial fusion state
  let fusion = await evidenceFusionService.getFusedSkillEvidence(testCandidateId);
  const dsaFusedInitial = fusion.skills.find(s => isSkillMatch(s.skill, 'DSA'));
  
  assert.ok(dsaFusedInitial, 'DSA skill should be present in fused evidence');
  assert.strictEqual(dsaFusedInitial.status, 'UNVERIFIED', 'DSA from resume alone MUST be UNVERIFIED');
  assert.strictEqual(dsaFusedInitial.confidence, 'LOW', 'DSA from resume alone MUST have LOW confidence');
  assert.deepStrictEqual(dsaFusedInitial.sources, ['RESUME'], 'Sources must only be RESUME');
  console.log(`   ✓ Initial Resume DSA State: Status = ${dsaFusedInitial.status}, Sources = [${dsaFusedInitial.sources.join(', ')}] (UNVERIFIED confirmed)\n`);

  // -------------------------------------------------------------
  // Test 3: Connecting LeetCode (450 Solved) -> Transitions to VERIFIED
  // -------------------------------------------------------------
  console.log('[Test 3] Simulating LeetCode Connection (450 Problems Solved)...');
  await LeetCodeProfile.create({
    candidateId: testCandidateId,
    studentProfile: studentProfile._id,
    username: 'dsa_champion',
    profileUrl: 'https://leetcode.com/u/dsa_champion',
    totalSolved: 450,
    easySolved: 150,
    mediumSolved: 240,
    hardSolved: 60,
    acceptanceRate: 68.4,
    contestRating: 1820,
    contestGlobalRanking: 12500,
    contestTopPercentage: 5.2,
    contestAttended: 14,
    dsaEvidenceStrength: 'VERY_STRONG',
    verifiedClaims: [
      {
        skill: 'Data Structures & Algorithms',
        canonicalName: 'Data Structures & Algorithms',
        status: 'VERIFIED',
        confidence: 'HIGH',
        strength: 'VERY_STRONG',
        evidenceCount: 450,
        reason: 'Candidate has solved 450 algorithmic problems on LeetCode (150 Easy, 240 Medium, 60 Hard).',
      },
      {
        skill: 'Problem Solving',
        canonicalName: 'Problem Solving',
        status: 'VERIFIED',
        confidence: 'HIGH',
        strength: 'VERY_STRONG',
        evidenceCount: 450,
        reason: 'Demonstrated technical problem solving across 450 LeetCode challenges with active submission history.',
      }
    ],
  });

  await evidenceFusionService.syncCandidateSkillClaims(testCandidateId);
  fusion = await evidenceFusionService.getFusedSkillEvidence(testCandidateId);
  const dsaFusedPostLC = fusion.skills.find(s => isSkillMatch(s.skill, 'DSA'));

  assert.ok(dsaFusedPostLC, 'DSA skill should be present');
  assert.strictEqual(dsaFusedPostLC.status, 'VERIFIED', 'DSA with 450 solved problems MUST be VERIFIED');
  assert.strictEqual(dsaFusedPostLC.confidence, 'HIGH', 'Confidence MUST be HIGH');
  assert.ok(dsaFusedPostLC.sources.includes('RESUME'), 'Sources MUST contain RESUME');
  assert.ok(dsaFusedPostLC.sources.includes('LEETCODE'), 'Sources MUST contain LEETCODE');
  console.log(`   ✓ Post-LeetCode DSA State: Status = ${dsaFusedPostLC.status} (${dsaFusedPostLC.confidence}), Sources = [${dsaFusedPostLC.sources.join(', ')}] (VERIFIED confirmed)\n`);

  // -------------------------------------------------------------
  // Test 4: Disconnecting LeetCode -> Clean Reversion to UNVERIFIED
  // -------------------------------------------------------------
  console.log('[Test 4] Testing LeetCode Disconnect & Evidence Recalculation...');
  await LeetCodeProfile.deleteOne({ candidateId: testCandidateId });
  await evidenceFusionService.syncCandidateSkillClaims(testCandidateId);

  fusion = await evidenceFusionService.getFusedSkillEvidence(testCandidateId);
  const dsaFusedPostDisconnect = fusion.skills.find(s => isSkillMatch(s.skill, 'DSA'));

  assert.ok(dsaFusedPostDisconnect, 'Resume claim for DSA should remain preserved');
  assert.strictEqual(dsaFusedPostDisconnect.status, 'UNVERIFIED', 'DSA MUST revert to UNVERIFIED post-disconnect');
  assert.deepStrictEqual(dsaFusedPostDisconnect.sources, ['RESUME'], 'Sources must only be RESUME');
  console.log(`   ✓ Post-Disconnect DSA State: Status = ${dsaFusedPostDisconnect.status}, Sources = [${dsaFusedPostDisconnect.sources.join(', ')}] (Reversion confirmed)\n`);

  // Cleanup
  await User.deleteOne({ _id: testCandidateId });
  await StudentProfile.deleteOne({ _id: studentProfile._id });
  await ResumeAnalysis.deleteMany({ candidateId: testCandidateId });
  await SkillClaim.deleteMany({ candidateId: testCandidateId });
  await Evidence.deleteMany({ studentId: testCandidateId });

  console.log('================================================================');
  console.log('✓ ALL DSA CLAIM & STABILITY TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');

  process.exit(0);
}

runDsaStabilityTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
