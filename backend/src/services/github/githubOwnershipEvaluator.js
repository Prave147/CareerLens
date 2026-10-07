/**
 * GitHub Ownership & Recency Evaluator
 * Enforces strict anti-inflation rules for forks vs original projects.
 */

class GithubOwnershipEvaluator {
  /**
   * Evaluates repository ownership
   */
  evaluateOwnership(repo, studentUsername) {
    if (!repo) return 'UNKNOWN';

    if (repo.fork) {
      return 'FORKED';
    }

    const ownerLogin = (repo.owner?.login || '').toLowerCase();
    const targetUser = (studentUsername || '').toLowerCase();

    if (ownerLogin === targetUser) {
      return 'OWNED';
    }

    if (ownerLogin && ownerLogin !== targetUser) {
      return 'COLLABORATION';
    }

    return 'UNKNOWN';
  }

  /**
   * Evaluates repository recency based on pushedAt date
   */
  evaluateRecency(repo) {
    if (!repo) return 'STALE';

    if (repo.archived) {
      return 'ARCHIVED';
    }

    const pushedAt = repo.pushed_at ? new Date(repo.pushed_at) : null;
    if (!pushedAt || isNaN(pushedAt.getTime())) {
      return 'STALE';
    }

    const now = new Date();
    const diffDays = (now - pushedAt) / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) {
      return 'ACTIVE';
    }

    if (diffDays <= 90) {
      return 'RECENTLY_ACTIVE';
    }

    return 'STALE';
  }

  /**
   * Evaluates overall evidence strength for a repository
   */
  evaluateEvidenceStrength(ownershipStatus, hasDependencies, hasReadme, isArchived) {
    if (isArchived) {
      return 'LOW';
    }

    if (ownershipStatus === 'OWNED') {
      if (hasDependencies) {
        return 'HIGH';
      }
      if (hasReadme) {
        return 'MEDIUM';
      }
      return 'LOW';
    }

    if (ownershipStatus === 'COLLABORATION') {
      return hasDependencies ? 'MEDIUM' : 'LOW';
    }

    if (ownershipStatus === 'FORKED') {
      return 'LOW'; // Forks do not receive high initial project credibility
    }

    return 'NONE';
  }
}

module.exports = new GithubOwnershipEvaluator();
