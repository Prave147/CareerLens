/**
 * LeetCode Deterministic Evidence Evaluator
 * Evaluates coding metrics, problem distribution, and contest activity into structured evidence.
 */

class LeetCodeEvaluator {
  /**
   * Evaluates overall DSA evidence strength based on problem count and difficulty distribution
   */
  evaluateStrength(totalSolved, mediumSolved = 0, hardSolved = 0, contestRating = null) {
    if (totalSolved >= 250 || (totalSolved >= 180 && (mediumSolved + hardSolved >= 100)) || (contestRating && contestRating >= 1850)) {
      return 'VERY_STRONG';
    }
    if (totalSolved >= 100 || (totalSolved >= 75 && (mediumSolved + hardSolved >= 40)) || (contestRating && contestRating >= 1600)) {
      return 'STRONG';
    }
    if (totalSolved >= 25 || (mediumSolved + hardSolved >= 10)) {
      return 'MODERATE';
    }
    return 'LOW';
  }

  /**
   * Generates canonical verified evidence skills from LeetCode data
   */
  generateVerifiedSkills(profileData, topicStats = []) {
    const { totalSolved, easySolved, mediumSolved, hardSolved, contestRating, languageStats = [] } = profileData;
    const strength = this.evaluateStrength(totalSolved, mediumSolved, hardSolved, contestRating);
    const isVerified = strength === 'STRONG' || strength === 'VERY_STRONG';
    const isPartial = strength === 'MODERATE';
    const verifiedSkills = [];

    if (totalSolved >= 10) {
      // 1. Core DSA Claim
      verifiedSkills.push({
        skill: 'Data Structures & Algorithms',
        canonicalName: 'Data Structures & Algorithms',
        status: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
        confidence: strength === 'VERY_STRONG' ? 'HIGH' : strength === 'STRONG' ? 'HIGH' : strength === 'MODERATE' ? 'MEDIUM' : 'LOW',
        strength,
        evidenceCount: totalSolved,
        reason: `Candidate has solved ${totalSolved} algorithmic problems on LeetCode (${easySolved} Easy, ${mediumSolved} Medium, ${hardSolved} Hard).`,
      });

      // 2. Problem Solving Claim
      verifiedSkills.push({
        skill: 'Problem Solving',
        canonicalName: 'Problem Solving',
        status: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
        confidence: strength === 'VERY_STRONG' ? 'HIGH' : strength === 'STRONG' ? 'HIGH' : strength === 'MODERATE' ? 'MEDIUM' : 'LOW',
        strength,
        evidenceCount: totalSolved,
        reason: `Demonstrated technical problem solving across ${totalSolved} LeetCode challenges with active submission history.`,
      });

      // 3. Algorithms Claim
      verifiedSkills.push({
        skill: 'Algorithms',
        canonicalName: 'Algorithms',
        status: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
        confidence: strength === 'VERY_STRONG' ? 'HIGH' : strength === 'STRONG' ? 'HIGH' : 'MEDIUM',
        strength,
        evidenceCount: totalSolved,
        reason: `Applied algorithm design and complexity optimization in ${totalSolved} accepted coding problems.`,
      });

      // 4. Data Structures Claim
      verifiedSkills.push({
        skill: 'Data Structures',
        canonicalName: 'Data Structures',
        status: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
        confidence: strength === 'VERY_STRONG' ? 'HIGH' : strength === 'STRONG' ? 'HIGH' : 'MEDIUM',
        strength,
        evidenceCount: totalSolved,
        reason: `Implemented and traversed arrays, trees, graphs, and dynamic programming structures across ${totalSolved} problems.`,
      });

      // 5. Competitive Programming (if contest rating or high problem count)
      if ((contestRating && contestRating >= 1500) || totalSolved >= 150) {
        verifiedSkills.push({
          skill: 'Competitive Programming',
          canonicalName: 'Competitive Programming',
          status: (contestRating && contestRating >= 1600) || totalSolved >= 250 ? 'VERIFIED' : 'PARTIALLY_VERIFIED',
          confidence: (contestRating && contestRating >= 1700) ? 'HIGH' : 'MEDIUM',
          strength: (contestRating && contestRating >= 1700) ? 'VERY_STRONG' : 'STRONG',
          evidenceCount: profileData.contestAttended || totalSolved,
          reason: contestRating
            ? `Achieved official LeetCode contest rating of ${contestRating} across ${profileData.contestAttended || 0} contests.`
            : `Extensive problem-solving volume (${totalSolved} problems) on competitive coding platform.`,
        });
      }

      // 6. Language-specific algorithmic evidence (only if >= 25 problems solved in that language)
      for (const lang of languageStats) {
        if (lang.problemsSolved >= 25) {
          const langName = this.normalizeLanguageName(lang.languageName);
          verifiedSkills.push({
            skill: langName,
            canonicalName: langName,
            status: lang.problemsSolved >= 50 ? 'VERIFIED' : 'PARTIALLY_VERIFIED',
            confidence: lang.problemsSolved >= 80 ? 'HIGH' : 'MEDIUM',
            strength: lang.problemsSolved >= 80 ? 'STRONG' : 'MODERATE',
            evidenceCount: lang.problemsSolved,
            reason: `Solved ${lang.problemsSolved} algorithmic problems on LeetCode using ${langName}.`,
          });
        }
      }

      // 7. Topic-level Algorithmic Proof (Arrays, Dynamic Programming, Trees, Graphs, etc.)
      if (Array.isArray(topicStats) && topicStats.length > 0) {
        for (const t of topicStats) {
          if (!t.canonicalTopic || t.problemsSolved <= 0) continue;
          const count = t.problemsSolved;
          const topicStrength = t.strength || (count >= 20 ? 'STRONG' : count >= 5 ? 'MODERATE' : 'LOW');
          const isTopicVerified = topicStrength === 'VERY_STRONG' || topicStrength === 'STRONG';
          const isTopicPartial = topicStrength === 'MODERATE';

          verifiedSkills.push({
            skill: t.canonicalTopic,
            canonicalName: t.canonicalTopic,
            status: isTopicVerified ? 'VERIFIED' : isTopicPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
            confidence: topicStrength === 'VERY_STRONG' ? 'HIGH' : topicStrength === 'STRONG' ? 'HIGH' : isTopicPartial ? 'MEDIUM' : 'LOW',
            strength: topicStrength,
            evidenceCount: count,
            reason: isTopicVerified
              ? `Candidate has solved ${count} ${t.canonicalTopic} problems on LeetCode demonstrating verified pattern proficiency.`
              : isTopicPartial
              ? `Candidate has practiced ${count} ${t.canonicalTopic} problems on LeetCode with developing exposure.`
              : `Practiced ${count} problems in ${t.canonicalTopic}. Additional practice recommended to reach benchmark depth.`,
          });
        }
      }
    }

    return verifiedSkills;
  }

  normalizeLanguageName(lang) {
    const l = String(lang || '').toLowerCase().trim();
    if (l === 'cpp' || l === 'c++') return 'C++';
    if (l === 'python' || l === 'python3') return 'Python';
    if (l === 'java') return 'Java';
    if (l === 'javascript') return 'JavaScript';
    if (l === 'typescript') return 'TypeScript';
    if (l === 'csharp' || l === 'c#') return 'C#';
    if (l === 'golang' || l === 'go') return 'Go';
    if (l === 'rust') return 'Rust';
    return lang;
  }
}

module.exports = new LeetCodeEvaluator();
