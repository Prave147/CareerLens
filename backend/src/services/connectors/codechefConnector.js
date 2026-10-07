/**
 * CodeChef Connector
 */
class CodechefConnector {
  async fetchUserData(username) {
    const handle = username || 'alex_chef';
    return {
      username: handle,
      stars: '3★',
      rating: 1680,
      globalRank: 12400,
      countryRank: 7800,
      contestsAttended: 14,
      problemsSolved: 124,
      historicalConsistency: 'Moderate',
      recentConsistency: 'Moderate',
    };
  }
}

module.exports = new CodechefConnector();
