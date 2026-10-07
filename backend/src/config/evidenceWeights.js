/**
 * CareerLens Evidence Weights & Scoring Configuration
 * Centralized, configurable scoring weights for deterministic readiness calculation.
 */
const EVIDENCE_WEIGHTS = {
  // Source Types & Strengths
  sourceWeights: {
    DEPLOYED_ORIGINAL_PROJECT: { score: 100, label: 'Very Strong', multiplier: 1.0 },
    ORIGINAL_GITHUB_REPO: { score: 85, label: 'Strong', multiplier: 0.85 },
    MEANINGFUL_CONTRIBUTOR: { score: 75, label: 'Strong', multiplier: 0.75 },
    CODING_PLATFORM_ACTIVITY: { score: 80, label: 'Strong', multiplier: 0.80 },
    VERIFIED_CERTIFICATE: { score: 65, label: 'Medium/Strong', multiplier: 0.65 },
    PORTFOLIO_PROJECT: { score: 55, label: 'Medium', multiplier: 0.55 },
    RESUME_CLAIM: { score: 20, label: 'Weak', multiplier: 0.20 },
    SELF_DECLARATION: { score: 10, label: 'Very Weak', multiplier: 0.10 },
  },

  // Scoring Pillars & Max Allocations
  pillars: {
    technicalCapability: { maxPoints: 30, weight: 0.30, label: 'Technical Capability' },
    proofOfWork: { maxPoints: 20, weight: 0.20, label: 'Proof of Work' },
    projectStrength: { maxPoints: 20, weight: 0.20, label: 'Project Strength' },
    activityConsistency: { maxPoints: 10, weight: 0.10, label: 'Activity Consistency' },
    roleFit: { maxPoints: 10, weight: 0.10, label: 'Role Fit' },
    evidenceConfidence: { maxPoints: 10, weight: 0.10, label: 'Evidence Confidence' },
  },

  // Verification Thresholds
  thresholds: {
    STRONGLY_VERIFIED: 85,
    VERIFIED: 70,
    PARTIALLY_VERIFIED: 50,
    WEAK: 30,
    UNSUPPORTED: 15,
  },

  // Fork & Contribution Penalties
  forkRules: {
    unmodifiedForkPenalty: 0.85, // -85% credit if no commits added
    minorContributionDiscount: 0.50, // -50% credit if low additions
    significantContributionBonus: 1.0, // Full credit if substantial original code
  }
};

module.exports = EVIDENCE_WEIGHTS;
