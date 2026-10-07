/**
 * CareerLens — LeetCode Topic & Pattern Evaluator (V2)
 * Evaluates difficulty distributions, multi-tag problem counts, topic strengths, recency, and coding gaps.
 */
const normalizer = require('./leetcodeTopicNormalizer');

// Standard Core Algorithmic Benchmark Expectations for Software Engineering roles
const ROLE_BENCHMARK_EXPECTATIONS = [
  { topic: 'Arrays', targetStrength: 'STRONG', minProblems: 25, recommendation: 'Solve 10+ Medium two-pointer and interval array problems.' },
  { topic: 'Hash Tables', targetStrength: 'STRONG', minProblems: 25, recommendation: 'Practice frequency counting and hash-map lookup patterns.' },
  { topic: 'Binary Search', targetStrength: 'STRONG', minProblems: 20, recommendation: 'Master rotated array search and binary search on answer spaces.' },
  { topic: 'Trees', targetStrength: 'STRONG', minProblems: 25, recommendation: 'Implement recursive tree traversals (DFS), BST validations, and LCA.' },
  { topic: 'Graphs', targetStrength: 'STRONG', minProblems: 20, recommendation: 'Practice BFS/DFS grid traversals, topological sorting, and Dijkstra algorithms.' },
  { topic: 'Dynamic Programming', targetStrength: 'STRONG', minProblems: 25, recommendation: 'Focus on 1D/2D memoization (0/1 Knapsack, LCS, LIS).' },
  { topic: 'Two Pointers', targetStrength: 'MODERATE', minProblems: 15, recommendation: 'Practice opposite-end and fast-slow pointer techniques.' },
  { topic: 'Sliding Window', targetStrength: 'MODERATE', minProblems: 12, recommendation: 'Solve variable-length and fixed-length substring window problems.' },
];

class LeetCodeTopicEvaluator {
  /**
   * Evaluates individual topic strength based on volume, difficulty, and recency
   */
  evaluateTopicStrength(count, totalSolved = 0, recentCount = 0) {
    if (count <= 0) return 'LOW';
    if (count >= 50 || (count >= 35 && recentCount >= 5) || (count >= 30 && totalSolved > 0 && (count / totalSolved) >= 0.15)) {
      return 'VERY_STRONG';
    }
    if (count >= 25 || (count >= 15 && recentCount >= 3)) {
      return 'STRONG';
    }
    if (count >= 10 || recentCount >= 2) {
      return 'MODERATE';
    }
    return 'LOW';
  }

  /**
   * Calculates difficulty breakdown and exact percentages
   */
  evaluateDifficulty(easy = 0, medium = 0, hard = 0, total = 0) {
    const totalCount = total > 0 ? total : (easy + medium + hard);
    if (totalCount === 0) {
      return {
        easy: { count: 0, percentage: 0 },
        medium: { count: 0, percentage: 0 },
        hard: { count: 0, percentage: 0 },
        total: 0,
      };
    }

    return {
      easy: {
        count: easy,
        percentage: Number(((easy / totalCount) * 100).toFixed(1)),
      },
      medium: {
        count: medium,
        percentage: Number(((medium / totalCount) * 100).toFixed(1)),
      },
      hard: {
        count: hard,
        percentage: Number(((hard / totalCount) * 100).toFixed(1)),
      },
      total: totalCount,
    };
  }

  /**
   * Aggregates topic counts from raw LeetCode tag lists or problem activities
   * Multi-tag rule: 1 problem with multiple tags increments each topic count
   */
  aggregateTopics(rawTagList = [], totalSolved = 0, recentSubmissions = []) {
    const topicMap = new Map();

    // Initialize all canonical topics
    for (const canon of normalizer.getCanonicalTopics()) {
      topicMap.set(canon, {
        topicName: canon,
        topicSlug: canon.toLowerCase().replace(/[\s/]+/g, '-'),
        canonicalTopic: canon,
        problemsSolved: 0,
        percentage: 0,
        strength: 'LOW',
        recentCount: 0,
        category: this.getTopicCategory(canon),
      });
    }

    // Accumulate raw tag counts
    for (const tag of rawTagList) {
      const name = tag.tagName || tag.name || tag.tagSlug || tag.slug || '';
      const count = Number(tag.problemsSolved || tag.count || 0);
      if (!name || count <= 0) continue;

      const canonical = normalizer.normalize(name);
      if (canonical && topicMap.has(canonical)) {
        const item = topicMap.get(canonical);
        item.problemsSolved += count;
      }
    }

    // Calculate recent activity per topic from recent submissions if available
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    for (const sub of recentSubmissions) {
      const subTime = Number(sub.timestamp) > 1e11 ? Number(sub.timestamp) : Number(sub.timestamp) * 1000;
      if (subTime >= thirtyDaysAgo && sub.topics) {
        for (const t of sub.topics) {
          const canon = normalizer.normalize(t);
          if (canon && topicMap.has(canon)) {
            topicMap.get(canon).recentCount += 1;
          }
        }
      }
    }

    // Compute percentages and strengths
    const result = [];
    const baseTotal = totalSolved > 0 ? totalSolved : 1;

    for (const [_, item] of topicMap.entries()) {
      item.percentage = Number(((item.problemsSolved / baseTotal) * 100).toFixed(1));
      item.strength = this.evaluateTopicStrength(item.problemsSolved, totalSolved, item.recentCount);
      result.push(item);
    }

    // Sort descending by problems solved
    result.sort((a, b) => b.problemsSolved - a.problemsSolved);
    return result;
  }

  /**
   * Evaluates Coding Patterns grouping
   */
  evaluateCodingPatterns(topicStats = []) {
    const strong = [];
    const moderate = [];
    const developing = [];
    const limited = [];

    const coreTopics = new Set(['Arrays', 'Strings', 'Hash Tables', 'Two Pointers', 'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming']);

    for (const t of topicStats) {
      if (t.strength === 'VERY_STRONG' || t.strength === 'STRONG') {
        strong.push(t.canonicalTopic);
      } else if (t.strength === 'MODERATE') {
        moderate.push(t.canonicalTopic);
      } else if (t.problemsSolved >= 3 || coreTopics.has(t.canonicalTopic)) {
        developing.push(t.canonicalTopic);
      } else {
        limited.push(t.canonicalTopic);
      }
    }

    return {
      strong: strong.slice(0, 10),
      moderate: moderate.slice(0, 10),
      developing: developing.slice(0, 10),
      limited: limited.slice(0, 10),
    };
  }

  /**
   * Computes recency metrics from submissions / calendar
   */
  evaluateRecency(submissions = [], userCalendar = null) {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
    const halfYearAgo = now - 180 * 24 * 60 * 60 * 1000;

    let last30 = 0;
    let last90 = 0;
    let last180 = 0;
    let latestTime = null;

    for (const sub of submissions) {
      const ts = Number(sub.timestamp) > 1e11 ? Number(sub.timestamp) : Number(sub.timestamp) * 1000;
      if (!isNaN(ts) && ts > 0) {
        if (!latestTime || ts > latestTime) latestTime = ts;
        if (ts >= thirtyDaysAgo) last30++;
        if (ts >= ninetyDaysAgo) last90++;
        if (ts >= halfYearAgo) last180++;
      }
    }

    // If submission calendar JSON is present, incorporate active submission counts
    if (userCalendar && userCalendar.submissionCalendar) {
      try {
        const cal = typeof userCalendar.submissionCalendar === 'string'
          ? JSON.parse(userCalendar.submissionCalendar)
          : userCalendar.submissionCalendar;

        for (const [timestampStr, count] of Object.entries(cal)) {
          const ts = Number(timestampStr) * 1000;
          const num = Number(count) || 0;
          if (!latestTime || ts > latestTime) latestTime = ts;
          if (ts >= thirtyDaysAgo) last30 += num;
          if (ts >= ninetyDaysAgo) last90 += num;
          if (ts >= halfYearAgo) last180 += num;
        }
      } catch (_) {}
    }

    return {
      lastActivity: latestTime ? new Date(latestTime) : null,
      last30DaysCount: last30,
      last90DaysCount: last90,
      last180DaysCount: last180,
      activeDaysTotal: userCalendar?.totalActiveDays || 0,
      streakDays: userCalendar?.streak || 0,
    };
  }

  /**
   * Computes consistency rating
   */
  evaluateConsistency(recencyStats = {}) {
    const { last30DaysCount = 0, streakDays = 0, activeDaysTotal = 0 } = recencyStats;
    if (last30DaysCount >= 15 || streakDays >= 10 || activeDaysTotal >= 50) {
      return 'HIGH';
    }
    if (last30DaysCount >= 5 || activeDaysTotal >= 20) {
      return 'MODERATE';
    }
    return 'LOW';
  }

  /**
   * Identifies coding skill gaps against Software Engineering expectations
   */
  evaluateCodingGaps(topicStats = []) {
    const topicMap = new Map(topicStats.map(t => [t.canonicalTopic, t]));
    const gaps = [];

    for (const exp of ROLE_BENCHMARK_EXPECTATIONS) {
      const current = topicMap.get(exp.topic);
      const currentCount = current ? current.problemsSolved : 0;
      const currentStrength = current ? current.strength : 'LOW';

      const isGap = currentStrength === 'LOW' || (exp.targetStrength === 'STRONG' && currentStrength === 'MODERATE');

      if (isGap) {
        gaps.push({
          topic: exp.topic,
          currentStrength,
          targetStrength: exp.targetStrength,
          count: currentCount,
          targetCount: exp.minProblems,
          recommendation: exp.recommendation,
        });
      }
    }

    return gaps;
  }

  getTopicCategory(topic) {
    if (['Arrays', 'Strings', 'Hash Tables', 'Matrix', 'Prefix Sum'].includes(topic)) return 'Data Structure';
    if (['Two Pointers', 'Sliding Window', 'Binary Search', 'Sorting', 'Intervals'].includes(topic)) return 'Core Technique';
    if (['Stack', 'Queue', 'Linked List', 'Trees', 'Binary Search Tree', 'Heap / Priority Queue', 'Trie', 'Union Find'].includes(topic)) return 'Advanced Structure';
    if (['Dynamic Programming', 'Greedy', 'Backtracking', 'BFS', 'DFS', 'Graphs'].includes(topic)) return 'Algorithmic Paradigm';
    return 'Specialized Algorithm';
  }
}

module.exports = new LeetCodeTopicEvaluator();
