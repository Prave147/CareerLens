/**
 * CareerLens — LeetCode Intelligence V2 Comprehensive Test Suite
 * Tests Coding Profile, Pattern Evaluation, Topic Normalization, Multi-tag Aggregation,
 * Recency & Consistency Analysis, Gap Detection, and Evidence Fusion.
 */

const assert = require('assert');
const normalizer = require('./services/leetcode/leetcodeTopicNormalizer');
const topicEvaluator = require('./services/leetcode/leetcodeTopicEvaluator');
const evaluator = require('./services/leetcode/leetcodeEvaluator');
const { normalizeSkill, isSkillMatch } = require('./utils/skillUtils');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING LEETCODE INTELLIGENCE V2 TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}\n`);
    }
  }

  // TEST 1: Difficulty Aggregation and Exact Percentages
  test('Difficulty breakdown and exact percentage calculation', () => {
    const res = topicEvaluator.evaluateDifficulty(180, 210, 60, 450);
    assert.strictEqual(res.total, 450);
    assert.strictEqual(res.easy.count, 180);
    assert.strictEqual(res.easy.percentage, 40.0);
    assert.strictEqual(res.medium.count, 210);
    assert.strictEqual(res.medium.percentage, 46.7);
    assert.strictEqual(res.hard.count, 60);
    assert.strictEqual(res.hard.percentage, 13.3);
  });

  // TEST 2: Canonical Topic Normalization
  test('Topic normalization across aliases, tags, and slugs', () => {
    assert.strictEqual(normalizer.normalize('array'), 'Arrays');
    assert.strictEqual(normalizer.normalize('dynamic-programming'), 'Dynamic Programming');
    assert.strictEqual(normalizer.normalize('dp'), 'Dynamic Programming');
    assert.strictEqual(normalizer.normalize('binary-search'), 'Binary Search');
    assert.strictEqual(normalizer.normalize('breadth-first-search'), 'BFS');
    assert.strictEqual(normalizer.normalize('depth-first-search'), 'DFS');
    assert.strictEqual(normalizer.normalize('hash-table'), 'Hash Tables');
    assert.strictEqual(normalizer.normalize('two-pointers'), 'Two Pointers');
    assert.strictEqual(normalizer.normalize('sliding-window'), 'Sliding Window');
    assert.strictEqual(normalizer.normalize('union-find'), 'Union Find');
    assert.strictEqual(normalizer.normalize('heap-priority-queue'), 'Heap / Priority Queue');
    assert.strictEqual(normalizer.normalize('bit-manipulation'), 'Bit Manipulation');
  });

  // TEST 3: Multi-tag Problem Handling
  test('Multi-tag problem handling: 1 problem with multiple tags counts for each category', () => {
    const rawTagList = [
      { tagName: 'array', problemsSolved: 142 },
      { tagName: 'hash-table', problemsSolved: 74 },
      { tagName: 'two-pointers', problemsSolved: 45 },
      { tagName: 'dynamic-programming', problemsSolved: 52 },
      { tagName: 'binary-search', problemsSolved: 41 },
      { tagName: 'trees', problemsSolved: 38 },
      { tagName: 'graphs', problemsSolved: 31 },
    ];

    const aggregated = topicEvaluator.aggregateTopics(rawTagList, 450);
    const arraysTopic = aggregated.find((t) => t.canonicalTopic === 'Arrays');
    const hashTopic = aggregated.find((t) => t.canonicalTopic === 'Hash Tables');
    const dpTopic = aggregated.find((t) => t.canonicalTopic === 'Dynamic Programming');

    assert.strictEqual(arraysTopic.problemsSolved, 142);
    assert.strictEqual(arraysTopic.percentage, 31.6);
    assert.strictEqual(hashTopic.problemsSolved, 74);
    assert.strictEqual(dpTopic.problemsSolved, 52);

    // Topic sum is greater than total solved due to multi-tagging
    const totalTagSum = aggregated.reduce((acc, t) => acc + t.problemsSolved, 0);
    assert.ok(totalTagSum > 400);
  });

  // TEST 4: Topic Strength Evaluation
  test('Topic strength evaluation: VERY_STRONG, STRONG, MODERATE, LOW', () => {
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(142, 450, 10), 'VERY_STRONG');
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(52, 450, 4), 'VERY_STRONG');
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(28, 450, 2), 'STRONG');
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(12, 450, 0), 'MODERATE');
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(3, 450, 0), 'LOW');
    assert.strictEqual(topicEvaluator.evaluateTopicStrength(0, 450, 0), 'LOW');
  });

  // TEST 5: Recency & Consistency Rating
  test('Recency and consistency calculation from submission timestamps and calendar', () => {
    const now = Date.now();
    const mockSubmissions = [
      { timestamp: String(Math.floor((now - 5 * 24 * 60 * 60 * 1000) / 1000)), title: 'Two Sum' },
      { timestamp: String(Math.floor((now - 12 * 24 * 60 * 60 * 1000) / 1000)), title: '3Sum' },
      { timestamp: String(Math.floor((now - 25 * 24 * 60 * 60 * 1000) / 1000)), title: 'Trapping Rain Water' },
    ];

    const mockCalendar = {
      streak: 14,
      totalActiveDays: 65,
      submissionCalendar: JSON.stringify({
        [Math.floor((now - 2 * 24 * 60 * 60 * 1000) / 1000)]: 4,
        [Math.floor((now - 10 * 24 * 60 * 60 * 1000) / 1000)]: 6,
      }),
    };

    const recency = topicEvaluator.evaluateRecency(mockSubmissions, mockCalendar);
    assert.ok(recency.last30DaysCount >= 10);
    assert.strictEqual(recency.streakDays, 14);
    assert.strictEqual(recency.activeDaysTotal, 65);

    const consistency = topicEvaluator.evaluateConsistency(recency);
    assert.strictEqual(consistency, 'HIGH');
  });

  // TEST 6: Coding Pattern Profile Grouping
  test('Coding pattern profile grouping (Strong, Moderate, Developing, Limited)', () => {
    const mockTopics = [
      { canonicalTopic: 'Arrays', strength: 'VERY_STRONG', problemsSolved: 142 },
      { canonicalTopic: 'Hash Tables', strength: 'STRONG', problemsSolved: 74 },
      { canonicalTopic: 'Binary Search', strength: 'STRONG', problemsSolved: 41 },
      { canonicalTopic: 'Trees', strength: 'MODERATE', problemsSolved: 18 },
      { canonicalTopic: 'Graphs', strength: 'LOW', problemsSolved: 4 },
      { canonicalTopic: 'Dynamic Programming', strength: 'LOW', problemsSolved: 3 },
      { canonicalTopic: 'Trie', strength: 'LOW', problemsSolved: 0 },
    ];

    const patterns = topicEvaluator.evaluateCodingPatterns(mockTopics);
    assert.ok(patterns.strong.includes('Arrays'));
    assert.ok(patterns.strong.includes('Hash Tables'));
    assert.ok(patterns.moderate.includes('Trees'));
    assert.ok(patterns.developing.includes('Graphs'));
    assert.ok(patterns.limited.includes('Trie'));
  });

  // TEST 7: Coding Skill Gap Detection
  test('Coding skill gap detection against SWE benchmark expectations', () => {
    const mockTopics = [
      { canonicalTopic: 'Arrays', strength: 'VERY_STRONG', problemsSolved: 140 },
      { canonicalTopic: 'Hash Tables', strength: 'STRONG', problemsSolved: 70 },
      { canonicalTopic: 'Binary Search', strength: 'STRONG', problemsSolved: 40 },
      { canonicalTopic: 'Trees', strength: 'MODERATE', problemsSolved: 12 },
      { canonicalTopic: 'Graphs', strength: 'LOW', problemsSolved: 3 },
      { canonicalTopic: 'Dynamic Programming', strength: 'LOW', problemsSolved: 4 },
    ];

    const gaps = topicEvaluator.evaluateCodingGaps(mockTopics);
    const dpGap = gaps.find((g) => g.topic === 'Dynamic Programming');
    const graphGap = gaps.find((g) => g.topic === 'Graphs');
    const treeGap = gaps.find((g) => g.topic === 'Trees');

    assert.ok(dpGap, 'Dynamic Programming should be identified as a skill gap');
    assert.strictEqual(dpGap.currentStrength, 'LOW');
    assert.strictEqual(dpGap.targetStrength, 'STRONG');

    assert.ok(graphGap, 'Graphs should be identified as a skill gap');
    assert.ok(treeGap, 'Trees should be identified as a moderate gap');
  });

  // TEST 8: Verified Claims Generation with Topic Evidence
  test('Deterministic verified claims generation includes DSA, languages, and topic proofs', () => {
    const profileData = {
      totalSolved: 450,
      easySolved: 180,
      mediumSolved: 210,
      hardSolved: 60,
      contestRating: 1720,
      contestAttended: 12,
      languageStats: [
        { languageName: 'cpp', problemsSolved: 280 },
        { languageName: 'python', problemsSolved: 120 },
        { languageName: 'java', problemsSolved: 50 },
      ],
    };

    const mockTopics = [
      { canonicalTopic: 'Dynamic Programming', strength: 'STRONG', problemsSolved: 52 },
      { canonicalTopic: 'Binary Search', strength: 'STRONG', problemsSolved: 41 },
      { canonicalTopic: 'Graphs', strength: 'MODERATE', problemsSolved: 14 },
    ];

    const verified = evaluator.generateVerifiedSkills(profileData, mockTopics);

    const dsaClaim = verified.find((v) => v.skill === 'Data Structures & Algorithms');
    const cppClaim = verified.find((v) => v.skill === 'C++');
    const dpClaim = verified.find((v) => v.skill === 'Dynamic Programming');
    const graphClaim = verified.find((v) => v.skill === 'Graphs');

    assert.ok(dsaClaim && dsaClaim.status === 'VERIFIED');
    assert.ok(cppClaim && cppClaim.status === 'VERIFIED');
    assert.ok(dpClaim && dpClaim.status === 'VERIFIED');
    assert.ok(graphClaim && graphClaim.status === 'PARTIALLY_VERIFIED');
  });

  // TEST 9: Cross-Source Skill Matching
  test('SkillUtils matches resume topic claims with LeetCode topic canonical names', () => {
    assert.ok(isSkillMatch('Experienced in Dynamic Programming', 'Dynamic Programming'));
    assert.ok(isSkillMatch('Graph Algorithms', 'Graphs'));
    assert.ok(isSkillMatch('Binary Search Tree', 'Trees') || isSkillMatch('Binary Search', 'Binary Search'));
    assert.ok(isSkillMatch('DSA', 'Data Structures & Algorithms'));
    assert.ok(isSkillMatch('Data Structures', 'Data Structures & Algorithms'));
  });

  // TEST 10: Missing Data / Graceful Fallback
  test('Missing topic data degrades gracefully without fabricating numbers', () => {
    const emptyTagList = [];
    const aggregated = topicEvaluator.aggregateTopics(emptyTagList, 0);
    assert.strictEqual(aggregated.length, 27);
    assert.ok(aggregated.every((t) => t.problemsSolved === 0 && t.strength === 'LOW'));
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
