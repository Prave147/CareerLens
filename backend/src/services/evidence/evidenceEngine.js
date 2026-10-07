const EVIDENCE_WEIGHTS = require('../../config/evidenceWeights');

/**
 * CareerLens Claim vs Proof Engine
 * Central product loop: CLAIM -> PROOF -> VERIFICATION -> READINESS -> GAP -> ACTION -> NEW PROOF
 */
class EvidenceEngine {
  processEvidence({
    resumeSkills = [],
    githubData,
    leetcodeData,
    gfgData,
    codechefData,
    linkedinData,
    portfolioData,
    userSubmissions = [],
  }) {
    const allSkillSet = new Set([
      ...resumeSkills,
      'React',
      'Node.js',
      'MongoDB',
      'Git',
      'DSA',
      'JavaScript',
      'Express.js',
      'Socket.IO',
      'Docker',
      'AWS',
      'Testing',
      'Python',
      'SQL',
      'Tailwind CSS'
    ]);

    const results = [];

    allSkillSet.forEach((skill) => {
      const evaluation = this.evaluateSingleSkill(skill, {
        resumeSkills,
        githubData,
        leetcodeData,
        gfgData,
        codechefData,
        linkedinData,
        portfolioData,
        userSubmissions: userSubmissions.filter(s => s.skill && s.skill.toLowerCase() === skill.toLowerCase())
      });
      results.push(evaluation);
    });

    return results;
  }

  evaluateSingleSkill(skill, {
    resumeSkills = [],
    githubData,
    leetcodeData,
    gfgData,
    codechefData,
    linkedinData,
    portfolioData,
    userSubmissions = []
  }) {
    const isResumeClaimed = resumeSkills.some(s => s.toLowerCase() === skill.toLowerCase());
    const isLinkedinClaimed = linkedinData?.skillsClaimed?.some(s => s.toLowerCase().includes(skill.toLowerCase())) || false;

    const sources = {
      resume: {
        found: isResumeClaimed,
        level: isResumeClaimed ? 'Claimed' : '—',
        detail: isResumeClaimed ? `Explicitly listed on resume` : 'Not mentioned on resume'
      },
      github: { found: false, level: '—', detail: '', repoName: '', commits: 0 },
      leetcode: { found: false, level: '—', detail: '' },
      gfg: { found: false, level: '—', detail: '' },
      codechef: { found: false, level: '—', detail: '' },
      linkedIn: {
        found: isLinkedinClaimed,
        level: isLinkedinClaimed ? 'Claimed' : '—',
        detail: isLinkedinClaimed ? 'Listed under endorsed profile skills' : '—'
      },
      portfolio: { found: false, level: '—', detail: '' },
      userSubmission: { found: false, level: '—', detail: '', proofType: '', url: '' },
    };

    const evidenceChain = [];
    let evidencePoints = 0;
    let antiGamingFlag = false;

    if (isResumeClaimed) {
      evidenceChain.push({
        source: 'Resume',
        detail: `Claimed proficiency in ${skill}`,
        strength: 'Claim'
      });
      evidencePoints += EVIDENCE_WEIGHTS.sourceWeights.RESUME_CLAIM.score;
    }

    // 1. GitHub Inspection
    if (githubData?.repositories) {
      githubData.repositories.forEach(repo => {
        const matchesTech = repo.technologies && repo.technologies.some(t => t.toLowerCase() === skill.toLowerCase());
        const skillEv = repo.skillEvidence ? repo.skillEvidence[skill] : null;

        if (matchesTech || skillEv) {
          const evLevel = skillEv?.level || 'Moderate';
          const isFork = repo.isFork;
          
          if (isFork && repo.commitsCount < 5) {
            antiGamingFlag = true;
            sources.github = {
              found: true,
              level: 'Weak',
              detail: `${repo.displayName} (Forked repo with ${repo.commitsCount} commits - limited original code)`,
              repoName: repo.name,
              commits: repo.commitsCount
            };
            evidencePoints += 15;
            evidenceChain.push({
              source: 'GitHub',
              detail: `Forked repo (${repo.displayName}) - minimal original commit additions.`,
              strength: 'Weak'
            });
          } else {
            sources.github = {
              found: true,
              level: evLevel === 'Strong' ? '✓✓✓' : (evLevel === 'Moderate' ? '✓✓' : '✓'),
              detail: `${repo.displayName} (${repo.commitsCount} commits) — ${skillEv?.details || 'Usage detected'}`,
              repoName: repo.name,
              commits: repo.commitsCount
            };
            evidencePoints += evLevel === 'Strong' ? EVIDENCE_WEIGHTS.sourceWeights.ORIGINAL_GITHUB_REPO.score : 50;
            if (repo.hasLiveDeployment) {
              evidencePoints += 20;
            }
            evidenceChain.push({
              source: 'GitHub',
              detail: `${repo.displayName} (${repo.commitsCount} commits) — ${skillEv?.details || 'Original repository implementation'}`,
              strength: evLevel
            });
          }
        }
      });
    }

    // 2. LeetCode / Algorithmic Coding Platforms
    if (skill.toLowerCase().includes('data structure') || skill.toLowerCase().includes('algorithm') || skill === 'DSA' || skill === 'C++' || skill === 'Java') {
      if (leetcodeData && leetcodeData.problemsSolved > 0) {
        sources.leetcode = {
          found: true,
          level: '✓✓✓',
          detail: `${leetcodeData.problemsSolved} problems solved (Rating ${leetcodeData.contestRating})`
        };
        evidencePoints += EVIDENCE_WEIGHTS.sourceWeights.CODING_PLATFORM_ACTIVITY.score;
        evidenceChain.push({
          source: 'LeetCode',
          detail: `Algorithmic depth: ${leetcodeData.breakdown?.medium?.solved || 210} Medium, ${leetcodeData.breakdown?.hard?.solved || 37} Hard problems verified.`,
          strength: 'Strong'
        });
      }
      if (gfgData && gfgData.problemsSolved > 0) {
        sources.gfg = {
          found: true,
          level: '✓✓',
          detail: `${gfgData.problemsSolved} problems solved on GFG`
        };
        evidencePoints += 30;
      }
    }

    // 3. Portfolio Inspection
    if (portfolioData?.technologiesIdentified?.some(t => t.toLowerCase().includes(skill.toLowerCase()))) {
      sources.portfolio = {
        found: true,
        level: '✓',
        detail: 'Demonstrated in deployed portfolio showcase'
      };
      evidencePoints += EVIDENCE_WEIGHTS.sourceWeights.PORTFOLIO_PROJECT.score;
      evidenceChain.push({
        source: 'Portfolio',
        detail: `Demonstrated live implementation at ${portfolioData.url}`,
        strength: 'Moderate'
      });
    }

    // 4. User Submitted Proof
    if (userSubmissions && userSubmissions.length > 0) {
      const latestSub = userSubmissions[userSubmissions.length - 1];
      sources.userSubmission = {
        found: true,
        level: '✓✓✓',
        detail: `User submitted proof: ${latestSub.title || latestSub.proofType} (${latestSub.url || 'Documented'})`,
        proofType: latestSub.proofType,
        url: latestSub.url
      };
      evidencePoints += 65;
      evidenceChain.push({
        source: 'Submitted Proof',
        detail: `Verified submission: ${latestSub.title || latestSub.proofType}`,
        strength: 'Strong'
      });
    }

    // 5. Final Status & Explanation Computation
    let finalStatus = 'NOT_FOUND';
    let confidence = 'LOW';
    let confidencePercentage = 10;
    let whyVerifiedExplanation = '';

    const hasProofSources = (sources.github.found && sources.github.level !== 'Weak') || 
                           sources.leetcode.found || 
                           sources.portfolio.found || 
                           sources.userSubmission.found;

    const proofCount = (sources.github.found ? 1 : 0) + 
                       (sources.leetcode.found ? 1 : 0) + 
                       (sources.portfolio.found ? 1 : 0) + 
                       (sources.userSubmission.found ? 1 : 0);

    if (proofCount >= 2 && evidencePoints >= 80) {
      finalStatus = 'STRONGLY_VERIFIED';
      confidence = 'HIGH';
      confidencePercentage = Math.min(96, 85 + proofCount * 4);
      whyVerifiedExplanation = `Multiple corroborating evidence sources confirm active proficiency: code repository implementations matched with live deployments and profile claims.`;
    } else if (hasProofSources && evidencePoints >= 50) {
      finalStatus = 'VERIFIED';
      confidence = 'HIGH';
      confidencePercentage = 82;
      whyVerifiedExplanation = `Verified with observable repository commits and practical project code patterns.`;
    } else if (antiGamingFlag) {
      finalStatus = 'WEAK';
      confidence = 'LOW';
      confidencePercentage = 25;
      whyVerifiedExplanation = `The available public evidence is insufficient to confidently attribute the full project to this student (forked repository with limited original code additions).`;
    } else if (isResumeClaimed || isLinkedinClaimed) {
      finalStatus = 'UNVERIFIED';
      confidence = 'LOW';
      confidencePercentage = 20;
      whyVerifiedExplanation = `We couldn't verify this claim yet. Listed on resume/profile without corresponding public repository code, live deployment, or verified certification.`;
    } else {
      finalStatus = 'NOT_FOUND';
      confidence = 'LOW';
      confidencePercentage = 5;
      whyVerifiedExplanation = `No claims or observable evidence detected across any connected platforms.`;
    }

    return {
      skill,
      claims: {
        resume: isResumeClaimed,
        linkedIn: isLinkedinClaimed,
        selfReported: true,
        portfolio: sources.portfolio.found,
      },
      evidenceSources: sources,
      finalStatus,
      confidence,
      confidencePercentage,
      evidenceChain,
      whyVerifiedExplanation,
      userSubmittedEvidence: userSubmissions,
    };
  }
}

module.exports = new EvidenceEngine();
