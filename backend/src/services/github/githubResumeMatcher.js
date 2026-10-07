/**
 * GitHub ↔ Resume Project & Skill Matcher
 * Deterministically aligns claims made on the resume with actual GitHub repositories and codebases.
 */

const normalizeText = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
};

const getTokens = (str) => {
  const norm = normalizeText(str);
  return norm.split(/\s+/).filter((t) => t.length > 2);
};

const CANONICAL_ALIASES = {
  'c++': ['cpp', 'cplusplus', 'c++'],
  'cpp': ['c++', 'cpp', 'cplusplus'],
  'c#': ['csharp', 'c#'],
  'csharp': ['c#', 'csharp'],
  '.net': ['dotnet', '.net', 'asp.net', 'c#'],
  'dotnet': ['.net', 'dotnet'],
  'node': ['nodejs', 'node.js', 'node'],
  'nodejs': ['node', 'node.js', 'nodejs'],
  'node.js': ['node', 'nodejs', 'node.js'],
  'react': ['reactjs', 'react.js', 'react'],
  'reactjs': ['react', 'react.js', 'reactjs'],
  'react.js': ['react', 'reactjs', 'react.js'],
  'react native': ['react-native', 'react native'],
  'react-native': ['react native', 'react-native'],
  'nextjs': ['next.js', 'next', 'nextjs'],
  'next.js': ['nextjs', 'next', 'next.js'],
  'vue': ['vuejs', 'vue.js', 'vue'],
  'vuejs': ['vue', 'vue.js', 'vuejs'],
  'vue.js': ['vue', 'vuejs', 'vue.js'],
  'golang': ['go', 'golang'],
  'go': ['golang', 'go'],
  'postgres': ['postgresql', 'postgres'],
  'postgresql': ['postgres', 'postgresql'],
  'mongo': ['mongodb', 'mongo'],
  'mongodb': ['mongo', 'mongodb'],
  'express': ['expressjs', 'express.js', 'express'],
  'expressjs': ['express', 'express.js', 'expressjs'],
  'express.js': ['express', 'expressjs', 'express.js'],
  'python 3': ['python', 'python3', 'python 3'],
  'python3': ['python', 'python3', 'python 3'],
  'python': ['python3', 'python', 'python 3'],
  'machine learning': ['ml', 'machine learning', 'scikit-learn', 'tensorflow', 'pytorch'],
  'deep learning': ['deep learning', 'neural networks', 'tensorflow', 'pytorch', 'keras'],
};

function isSkillMatch(skillA, skillB) {
  if (!skillA || !skillB) return false;
  const a = String(skillA).trim().toLowerCase();
  const b = String(skillB).trim().toLowerCase();
  if (a === b) return true;

  // Explicit false positive guards
  if ((a === 'java' && b.includes('script')) || (b === 'java' && a.includes('script'))) return false;
  if ((a === 'c' && (b === 'c++' || b === 'c#' || b === 'css')) || (b === 'c' && (a === 'c++' || a === 'c#' || a === 'css'))) return false;
  if ((a === 'r' && (b === 'react' || b === 'rust')) || (b === 'r' && (a === 'react' || a === 'rust'))) return false;

  const cleanA = a.replace(/[\s\-_.]+/g, '');
  const cleanB = b.replace(/[\s\-_.]+/g, '');
  if (cleanA && cleanB && cleanA === cleanB) return true;

  if (CANONICAL_ALIASES[a]?.includes(b) || CANONICAL_ALIASES[b]?.includes(a)) return true;
  if (CANONICAL_ALIASES[cleanA]?.includes(cleanB) || CANONICAL_ALIASES[cleanB]?.includes(cleanA)) return true;

  return false;
}

class GithubResumeMatcher {
  /**
   * Matches a single resume project against a candidate's GitHub repositories
   */
  matchProjectWithRepositories(resumeProject, repositories) {
    let bestMatch = null;
    let highestScore = 0;
    let matchReason = 'No matching public GitHub repository found.';

    const resumeNameTokens = getTokens(resumeProject.name);
    const resumeTechs = (resumeProject.technologies || []).map((t) => t.toLowerCase());

    for (const repo of repositories) {
      let score = 0;
      const reasons = [];

      // 1. Direct URL Match (100% confidence)
      if (
        resumeProject.githubUrl &&
        repo.htmlUrl &&
        resumeProject.githubUrl.toLowerCase().trim() === repo.htmlUrl.toLowerCase().trim()
      ) {
        score = 100;
        reasons.push('Direct GitHub repository URL match from resume');
      } else {
        // 2. Name & Slug Overlap
        const repoNameTokens = getTokens(repo.name);
        let tokenMatches = 0;
        for (const token of resumeNameTokens) {
          if (repoNameTokens.some((rToken) => rToken.includes(token) || token.includes(rToken))) {
            tokenMatches++;
          }
        }

        if (resumeNameTokens.length > 0) {
          const nameRatio = tokenMatches / resumeNameTokens.length;
          score += nameRatio * 45;
          if (nameRatio > 0.5) {
            reasons.push(`Strong repository name correlation (${Math.round(nameRatio * 100)}% keyword overlap)`);
          }
        }

        // 3. Technology Stack Overlap
        const repoTechs = (repo.detectedTechnologies || []).map((t) => t.toLowerCase());
        let techMatches = 0;
        const matchedTechNames = [];
        for (const rTech of resumeTechs) {
          if (repoTechs.some((t) => isSkillMatch(rTech, t))) {
            techMatches++;
            matchedTechNames.push(rTech);
          }
        }

        if (resumeTechs.length > 0) {
          const techRatio = techMatches / resumeTechs.length;
          score += techRatio * 35;
          if (matchedTechNames.length > 0) {
            reasons.push(`Matching technologies: ${matchedTechNames.join(', ')}`);
          }
        }

        // 4. Description & Keyword Similarity
        if (resumeProject.description && repo.description) {
          const descTokens = getTokens(resumeProject.description);
          const repoDescTokens = getTokens(repo.description);
          let descMatchCount = 0;
          for (const dToken of descTokens) {
            if (repoDescTokens.includes(dToken)) descMatchCount++;
          }
          if (descTokens.length > 0) {
            score += Math.min(20, (descMatchCount / descTokens.length) * 40);
          }
        }

        // 5. Bonus for owned repository
        if (repo.ownershipStatus === 'OWNED') {
          score += 5;
        } else if (repo.isFork) {
          score -= 15; // Penalty for forked repos claimed as original projects
        }
      }

      const finalScore = Math.min(100, Math.max(0, Math.round(score)));

      if (finalScore > highestScore) {
        highestScore = finalScore;
        matchReason = reasons.join('; ') || 'Partial keyword match';
        bestMatch = {
          repo,
          matchScore: finalScore,
          matchReason,
        };
      }
    }

    let matchStatus = 'NO_MATCH';
    if (highestScore >= 65) {
      matchStatus = 'MATCHED';
    } else if (highestScore >= 35) {
      matchStatus = 'POSSIBLE_MATCH';
    }

    return {
      resumeProjectName: resumeProject.name,
      matchedRepo: bestMatch ? bestMatch.repo : null,
      matchStatus,
      matchScore: highestScore,
      matchReason,
    };
  }

  /**
   * Matches all resume skills with detected technologies across all GitHub repositories
   */
  matchSkillsWithRepositories(resumeSkills, repositories) {
    const verifiedSkillMatches = [];
    const pendingSkillClaims = [];

    // Collect all unique technologies and languages across owned repositories
    const ownedRepos = repositories.filter((r) => r.ownershipStatus === 'OWNED');
    const allRepoTechMap = new Map(); // skill -> [repo names]

    for (const repo of ownedRepos) {
      const allTechs = [
        ...(repo.detectedTechnologies || []),
        ...(repo.languages || []).map((l) => l.name),
      ];

      for (const tech of allTechs) {
        const cleanTech = tech.trim();
        const lower = cleanTech.toLowerCase();
        if (!allRepoTechMap.has(lower)) {
          allRepoTechMap.set(lower, { canonicalName: cleanTech, repos: [] });
        }
        allRepoTechMap.get(lower).repos.push({
          repoName: repo.name,
          evidenceStrength: repo.evidenceStrength,
          hasDependencies: repo.hasDependencies,
        });
      }
    }

    for (const resumeSkill of resumeSkills) {
      const skillName = typeof resumeSkill === 'string' ? resumeSkill : resumeSkill.name;

      let found = false;
      for (const [techKey, techData] of allRepoTechMap.entries()) {
        if (isSkillMatch(skillName, techKey) || isSkillMatch(skillName, techData.canonicalName)) {
          found = true;
          verifiedSkillMatches.push({
            skill: skillName,
            canonicalName: techData.canonicalName,
            matchingRepos: techData.repos,
            status: 'VERIFIED',
            strength: techData.repos.some((r) => r.hasDependencies) ? 'HIGH' : 'MEDIUM',
          });
          break;
        }
      }

      if (!found) {
        pendingSkillClaims.push({
          skill: skillName,
          status: 'UNVERIFIED',
          reason: 'No matching public GitHub code evidence found in connected account. Verification remains pending.',
        });
      }
    }

    return {
      verifiedSkillMatches,
      pendingSkillClaims,
    };
  }
}

module.exports = new GithubResumeMatcher();
