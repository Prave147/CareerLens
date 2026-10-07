class LeetCodeClient {
  constructor() {
    this.graphqlEndpoint = 'https://leetcode.com/graphql';
    this.timeout = 12000;
  }

  /**
   * Normalizes LeetCode handle from strings like:
   * "username", "@username", "leetcode.com/username", "https://leetcode.com/u/username/"
   */
  normalizeUsername(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('LeetCode username or profile URL is required.');
    }

    let clean = input.trim();
    // Strip protocol
    clean = clean.replace(/^https?:\/\//i, '');
    // Strip leetcode domain & /u/ prefix
    clean = clean.replace(/^(www\.)?leetcode\.com\/(u\/)?/i, '');
    // Strip leading @ and trailing slashes / queries
    clean = clean.replace(/^@/, '');
    clean = clean.split('/')[0].split('?')[0].trim();

    if (!clean || !/^[a-zA-Z0-9_\-]+$/.test(clean)) {
      throw new Error(`Invalid LeetCode username format: "${input}"`);
    }

    return clean;
  }

  /**
   * Queries LeetCode public GraphQL API for complete candidate statistics
   */
  async fetchUserProfile(username) {
    const cleanUsername = this.normalizeUsername(username);

    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            realName
            userAvatar
            aboutMe
            countryName
            reputation
            ranking
            company
            school
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          badges {
            id
            name
            shortName
            displayName
            icon
            creationDate
          }
          upcomingBadges {
            name
            icon
          }
          activeBadge {
            name
            icon
          }
          languageProblemCount {
            languageName
            problemsSolved
          }
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        recentSubmissionList(username: $username, limit: 20) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://leetcode.com/u/${cleanUsername}/`,
        },
        body: JSON.stringify({
          query,
          variables: { username: cleanUsername },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`LeetCode profile "@${cleanUsername}" was not found.`);
        }
        throw new Error(`LeetCode service returned HTTP ${response.status}.`);
      }

      const json = await response.json();
      const data = json?.data;
      if (!data || !data.matchedUser) {
        throw new Error(`LeetCode profile "@${cleanUsername}" was not found or is private.`);
      }

      return this.formatProfileData(cleanUsername, data);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('timeout')) {
        throw new Error('Connection to LeetCode timed out. Please try again.');
      }
      if (err.message?.includes('not found')) {
        throw new Error(`LeetCode profile "@${cleanUsername}" was not found.`);
      }
      throw new Error(err.message || 'Failed to retrieve LeetCode profile.');
    }
  }

  /**
   * Formats raw GraphQL response into standardized JSON structure
   */
  formatProfileData(username, data) {
    const user = data.matchedUser;
    const profile = user.profile || {};
    const submitStats = user.submitStatsGlobal?.acSubmissionNum || [];
    const allQuestions = data.allQuestionsCount || [];
    const contest = data.userContestRanking;
    const recentSubmissions = data.recentSubmissionList || [];

    // Parse problem breakdown
    const getCount = (diff) => {
      const found = submitStats.find((s) => s.difficulty.toLowerCase() === diff.toLowerCase());
      return found ? found.count : 0;
    };

    const getSubmissions = (diff) => {
      const found = submitStats.find((s) => s.difficulty.toLowerCase() === diff.toLowerCase());
      return found ? found.submissions : 0;
    };

    const getTotalQuestionCount = (diff) => {
      const found = allQuestions.find((q) => q.difficulty.toLowerCase() === diff.toLowerCase());
      return found ? found.count : 0;
    };

    const easySolved = getCount('Easy');
    const mediumSolved = getCount('Medium');
    const hardSolved = getCount('Hard');
    const totalSolved = getCount('All');

    const totalSubmissions = getSubmissions('All');
    const acceptanceRate = totalSubmissions > 0 ? Number(((totalSolved / totalSubmissions) * 100).toFixed(1)) : 0;

    return {
      username,
      profileUrl: `https://leetcode.com/u/${username}/`,
      realName: profile.realName || '',
      avatar: profile.userAvatar || '',
      aboutMe: profile.aboutMe || '',
      countryName: profile.countryName || '',
      company: profile.company || '',
      school: profile.school || '',
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      totalQuestions: {
        total: getTotalQuestionCount('All'),
        easy: getTotalQuestionCount('Easy'),
        medium: getTotalQuestionCount('Medium'),
        hard: getTotalQuestionCount('Hard'),
      },
      acceptanceRate,
      ranking: profile.ranking || 0,
      reputation: profile.reputation || 0,
      contestRating: contest ? Math.round(contest.rating) : null,
      contestGlobalRanking: contest ? contest.globalRanking : null,
      contestAttended: contest ? contest.attendedContestsCount : 0,
      contestTopPercentage: contest ? contest.topPercentage : null,
      contestBadge: contest?.badge ? { name: contest.badge.name } : null,
      badges: user.badges || [],
      activeBadge: user.activeBadge || null,
      languageStats: user.languageProblemCount || [],
      rawTagList: [
        ...((user.tagProblemCounts?.advanced) || []),
        ...((user.tagProblemCounts?.intermediate) || []),
        ...((user.tagProblemCounts?.fundamental) || []),
      ],
      userCalendar: user.userCalendar || null,
      recentSubmissions: recentSubmissions.map((sub) => ({
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: sub.timestamp,
        statusDisplay: sub.statusDisplay,
        lang: sub.lang,
      })),
    };
  }
}

module.exports = new LeetCodeClient();
