const leetcodeClient = require('./leetcodeClient');
const leetcodeEvaluator = require('./leetcodeEvaluator');
const leetcodeTopicEvaluator = require('./leetcodeTopicEvaluator');
const leetcodeTopicNormalizer = require('./leetcodeTopicNormalizer');
const leetcodeEvidenceService = require('./leetcodeEvidenceService');
const LeetCodeProfile = require('../../models/LeetCodeProfile');
const LeetCodeProblemActivity = require('../../models/LeetCodeProblemActivity');
const StudentProfile = require('../../models/StudentProfile');
const evidenceFusionService = require('../evidence/evidenceFusionService');
const { getIsConnected } = require('../../config/database');

class LeetCodeService {
  /**
   * Connects and validates a student's LeetCode username
   */
  async connectLeetCode(candidateId, usernameOrUrl) {
    const cleanUsername = leetcodeClient.normalizeUsername(usernameOrUrl);

    // Fetch and validate profile from LeetCode GraphQL
    const profileData = await leetcodeClient.fetchUserProfile(cleanUsername);

    // Update StudentProfile platform handle
    let profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });
    if (profile) {
      if (!profile.platformHandles) profile.platformHandles = {};
      profile.platformHandles.leetcode = cleanUsername;
      await profile.save();
    }

    // Automatically analyze and persist
    return await this.analyzeLeetCode(candidateId, { username: cleanUsername });
  }

  /**
   * Fetches real-time statistics and updates LeetCode intelligence V2
   */
  async analyzeLeetCode(candidateId, options = {}) {
    let username = options.username;

    if (!username) {
      const existingDoc = await LeetCodeProfile.findOne({ candidateId });
      if (existingDoc && existingDoc.username) {
        username = existingDoc.username;
      } else {
        const studentProfile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });
        username = studentProfile?.platformHandles?.leetcode;
      }
    }

    if (!username) {
      throw new Error('No LeetCode username connected. Please provide a LeetCode username or profile URL.');
    }

    const cleanUsername = leetcodeClient.normalizeUsername(username);
    console.log(`[LeetCodeService] Fetching real-time LeetCode data for @${cleanUsername}...`);

    // 1. Fetch real-time data from LeetCode
    const rawData = await leetcodeClient.fetchUserProfile(cleanUsername);

    // 2. Evaluate Difficulty Percentages
    const difficultyBreakdown = leetcodeTopicEvaluator.evaluateDifficulty(
      rawData.easySolved,
      rawData.mediumSolved,
      rawData.hardSolved,
      rawData.totalSolved
    );
    const difficultyPercentages = {
      easy: difficultyBreakdown.easy.percentage,
      medium: difficultyBreakdown.medium.percentage,
      hard: difficultyBreakdown.hard.percentage,
    };

    // 3. Evaluate Topics & Coding Patterns
    const topicStats = leetcodeTopicEvaluator.aggregateTopics(
      rawData.rawTagList || [],
      rawData.totalSolved,
      rawData.recentSubmissions || []
    );
    const codingPatterns = leetcodeTopicEvaluator.evaluateCodingPatterns(topicStats);
    const codingGaps = leetcodeTopicEvaluator.evaluateCodingGaps(topicStats);

    // 4. Evaluate Recency & Consistency
    const recencyStats = leetcodeTopicEvaluator.evaluateRecency(
      rawData.recentSubmissions || [],
      rawData.userCalendar || null
    );
    const codingConsistency = leetcodeTopicEvaluator.evaluateConsistency(recencyStats);

    // 5. Evaluate Overall DSA strength & canonical verified skills
    const dsaEvidenceStrength = leetcodeEvaluator.evaluateStrength(
      rawData.totalSolved,
      rawData.mediumSolved,
      rawData.hardSolved,
      rawData.contestRating
    );

    const verifiedSkills = leetcodeEvaluator.generateVerifiedSkills(rawData, topicStats);

    // 6. Persist LeetCodeProfile document
    let profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });

    const evidenceSummary = `Candidate has solved ${rawData.totalSolved} problems (${rawData.easySolved} Easy, ${rawData.mediumSolved} Medium, ${rawData.hardSolved} Hard) with ${rawData.acceptanceRate}% acceptance rate. Consistency: ${codingConsistency}. DSA Evidence Strength: ${dsaEvidenceStrength}.`;

    const updatedProfile = await LeetCodeProfile.findOneAndUpdate(
      { candidateId },
      {
        candidateId,
        studentProfile: profile ? profile._id : null,
        collegeId: profile ? profile.collegeId : null,
        username: cleanUsername,
        profileUrl: rawData.profileUrl,
        realName: rawData.realName,
        avatar: rawData.avatar,
        aboutMe: rawData.aboutMe,
        countryName: rawData.countryName,
        company: rawData.company,
        school: rawData.school,
        totalSolved: rawData.totalSolved,
        easySolved: rawData.easySolved,
        mediumSolved: rawData.mediumSolved,
        hardSolved: rawData.hardSolved,
        totalQuestions: rawData.totalQuestions,
        acceptanceRate: rawData.acceptanceRate,
        ranking: rawData.ranking,
        reputation: rawData.reputation,
        contestRating: rawData.contestRating,
        contestGlobalRanking: rawData.contestGlobalRanking,
        contestAttended: rawData.contestAttended,
        contestTopPercentage: rawData.contestTopPercentage,
        contestBadge: rawData.contestBadge,
        badges: rawData.badges,
        activeBadge: rawData.activeBadge,
        languageStats: rawData.languageStats,
        topicStats,
        codingPatterns,
        codingGaps,
        recencyStats,
        difficultyPercentages,
        codingConsistency,
        recentSubmissions: rawData.recentSubmissions,
        streak: recencyStats.streakDays || 0,
        totalActiveDays: recencyStats.activeDaysTotal || 0,
        dsaEvidenceStrength,
        evidenceSummary,
        verifiedClaims: verifiedSkills,
        lastFetchedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // 7. Store individual problem activity if recent submissions exist
    if (Array.isArray(rawData.recentSubmissions) && rawData.recentSubmissions.length > 0) {
      for (const sub of rawData.recentSubmissions) {
        if (!sub.title || !sub.timestamp) continue;
        const problemId = sub.titleSlug || sub.title.toLowerCase().replace(/[\s_]+/g, '-');
        try {
          await LeetCodeProblemActivity.findOneAndUpdate(
            { candidateId, problemId },
            {
              candidateId,
              studentProfile: profile ? profile._id : null,
              username: cleanUsername,
              problemId,
              title: sub.title,
              slug: sub.titleSlug || problemId,
              difficulty: 'Unknown',
              topics: [],
              canonicalTopics: [],
              language: sub.lang || '',
              status: sub.statusDisplay || 'Accepted',
              submittedAt: new Date(Number(sub.timestamp) * 1000),
              acceptedAt: sub.statusDisplay === 'Accepted' ? new Date(Number(sub.timestamp) * 1000) : null,
              url: `https://leetcode.com/problems/${sub.titleSlug || problemId}/`,
              source: 'LEETCODE',
            },
            { upsert: true, new: true }
          );
        } catch (actErr) {
          // Non-blocking for activity logs
        }
      }
    }

    // 8. Sync MongoDB Evidence collection
    await leetcodeEvidenceService.syncEvidenceFromLeetCode(candidateId, updatedProfile, verifiedSkills);

    // 9. Sync global Evidence Fusion SkillClaims
    try {
      await evidenceFusionService.syncCandidateSkillClaims(candidateId);
    } catch (syncErr) {
      console.warn('[LeetCodeService] Evidence fusion sync warning:', syncErr.message);
    }

    console.log(`[LeetCodeService] Successfully analyzed @${cleanUsername}. Solved: ${rawData.totalSolved}, Topics: ${topicStats.filter(t => t.problemsSolved > 0).length}, Strength: ${dsaEvidenceStrength}`);

    return {
      success: true,
      message: 'LeetCode intelligence V2 analysis completed successfully.',
      leetcodeProfile: updatedProfile,
      codingProfile: this.buildCodingProfileResponse(updatedProfile),
      verifiedSkills,
      dsaEvidenceStrength,
      evidenceSummary,
    };
  }

  /**
   * Builds standardized coding profile response object
   */
  buildCodingProfileResponse(profile) {
    if (!profile) return null;

    const easy = profile.easySolved || 0;
    const medium = profile.mediumSolved || 0;
    const hard = profile.hardSolved || 0;
    const total = profile.totalSolved || 0;

    const diffPercentages = profile.difficultyPercentages || {
      easy: total > 0 ? Number(((easy / total) * 100).toFixed(1)) : 0,
      medium: total > 0 ? Number(((medium / total) * 100).toFixed(1)) : 0,
      hard: total > 0 ? Number(((hard / total) * 100).toFixed(1)) : 0,
    };

    const topics = profile.topicStats || [];
    const activeTopics = topics.filter((t) => t.problemsSolved > 0);

    return {
      totalSolved: total,
      difficulty: {
        easy,
        medium,
        hard,
      },
      difficultyPercentages: diffPercentages,
      topics: activeTopics.length > 0 ? activeTopics : topics.slice(0, 10),
      allTopics: topics,
      languages: (profile.languageStats || []).map((l) => ({
        name: l.languageName,
        count: l.problemsSolved,
      })),
      recency: {
        lastActivity: profile.recencyStats?.lastActivity || null,
        last30Days: profile.recencyStats?.last30DaysCount || 0,
        last90Days: profile.recencyStats?.last90DaysCount || 0,
        last180Days: profile.recencyStats?.last180DaysCount || 0,
        activeDays: profile.recencyStats?.activeDaysTotal || profile.totalActiveDays || 0,
        streakDays: profile.recencyStats?.streakDays || profile.streak || 0,
      },
      consistency: profile.codingConsistency || 'MODERATE',
      patterns: profile.codingPatterns || { strong: [], moderate: [], developing: [], limited: [] },
      gaps: profile.codingGaps || [],
    };
  }

  /**
   * Retrieves complete V2 coding profile for candidate
   */
  async getCodingProfile(candidateId) {
    if (!getIsConnected() || !candidateId) {
      return null;
    }

    const profile = await LeetCodeProfile.findOne({ candidateId });
    if (!profile) return null;

    const codingProfile = this.buildCodingProfileResponse(profile);

    return {
      success: true,
      profile,
      codingProfile,
      topics: codingProfile.topics,
      allTopics: codingProfile.allTopics,
      languages: codingProfile.languages,
      difficulty: codingProfile.difficulty,
      difficultyPercentages: codingProfile.difficultyPercentages,
      recency: codingProfile.recency,
      consistency: codingProfile.consistency,
      strengths: codingProfile.patterns.strong,
      patterns: codingProfile.patterns,
      gaps: codingProfile.gaps,
      verifiedClaims: profile.verifiedClaims || [],
    };
  }

  /**
   * Disconnects LeetCode handle and invalidates attached proof
   */
  async disconnectLeetCode(candidateId) {
    if (!candidateId) return null;

    // 1. Delete LeetCodeProfile document and Problem activities
    await LeetCodeProfile.deleteMany({ candidateId });
    await LeetCodeProblemActivity.deleteMany({ candidateId });

    // 2. Clear platform handle in StudentProfile
    const profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });
    if (profile && profile.platformHandles) {
      profile.platformHandles.leetcode = '';
      await profile.save();
    }

    // 3. Reset LeetCode entries in Evidence documents
    await leetcodeEvidenceService.resetLeetCodeEvidence(candidateId);

    // 4. Re-sync candidate claims through global fusion
    await evidenceFusionService.syncCandidateSkillClaims(candidateId);

    return {
      success: true,
      message: 'LeetCode profile disconnected and evidence synchronized.',
    };
  }

  /**
   * Retrieves existing LeetCode profile analysis
   */
  async getProfile(candidateId) {
    if (!getIsConnected()) {
      return null;
    }
    return await LeetCodeProfile.findOne({ candidateId });
  }
}

module.exports = new LeetCodeService();

