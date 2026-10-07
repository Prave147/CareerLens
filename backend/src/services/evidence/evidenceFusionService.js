const StudentProfile = require('../../models/StudentProfile');
const ResumeAnalysis = require('../../models/ResumeAnalysis');
const GitHubProfile = require('../../models/GitHubProfile');
const LeetCodeProfile = require('../../models/LeetCodeProfile');
const Evidence = require('../../models/Evidence');
const SkillClaim = require('../../models/SkillClaim');

const { normalizeSkill, isSkillMatch, getCanonicalDisplayName } = require('../../utils/skillUtils');

function getSkillCategory(skillName) {
  const s = String(skillName || '').toLowerCase();
  if (['dsa', 'data structures', 'algorithms', 'problem solving', 'competitive programming'].some(k => s.includes(k))) {
    return 'DSA & Algorithms';
  }
  if (['react', 'react native', 'vue', 'vue.js', 'angular', 'svelte', 'html', 'css', 'tailwind', 'next.js', 'nextjs'].some(k => s.includes(k))) {
    return 'Frontend';
  }
  if (['node', 'node.js', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'gin', 'fiber', 'actix', 'nest', 'nestjs'].some(k => s.includes(k))) {
    return 'Backend';
  }
  if (['mongodb', 'postgres', 'postgresql', 'mysql', 'sqlite', 'redis', 'prisma', 'mongoose', 'sql'].some(k => s.includes(k))) {
    return 'Database';
  }
  if (['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'terraform'].some(k => s.includes(k))) {
    return 'DevOps & Cloud';
  }
  if (['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'c', 'php', 'ruby'].some(k => s.includes(k))) {
    return 'Programming Language';
  }
  if (['tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'deep learning', 'nlp', 'opencv'].some(k => s.includes(k))) {
    return 'AI & Data Science';
  }
  return 'Core Technology';
}

class EvidenceFusionService {
  /**
   * Retrieves unified multi-source fused skill evidence for a candidate
   */
  async getFusedSkillEvidence(candidateId) {
    if (!candidateId) {
      throw new Error('candidateId is required for evidence fusion');
    }

    // 1. Fetch Candidate Records
    const profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] }).lean();
    
    const [latestResume, githubDoc, leetcodeDoc, dbEvidenceList, skillClaims] = await Promise.all([
      ResumeAnalysis.findOne({ candidateId }).sort({ createdAt: -1 }).lean(),
      GitHubProfile.findOne({ candidateId }).lean(),
      LeetCodeProfile.findOne({ candidateId }).lean(),
      Evidence.find({ $or: [{ studentId: candidateId }, ...(profile?._id ? [{ studentProfile: profile._id }] : [])] }).lean(),
      SkillClaim.find({ studentId: candidateId }).lean(),
    ]);

    // 2. Identify Connected Proof Sources
    const sourcesConnected = {
      resume: !!(latestResume && latestResume.skills && latestResume.skills.length > 0),
      github: !!(githubDoc && githubDoc.username),
      leetcode: !!(leetcodeDoc && leetcodeDoc.username),
      gfg: false,
      codechef: false,
      codeforces: false,
      linkedin: false,
      portfolio: false,
      certifications: !!(profile?.certifications && profile.certifications.length > 0),
    };

    // 3. Collect Raw Skills from all sources
    const rawSkillsMap = new Map(); // canonicalKey -> { name, category, sources, resumeClaim, githubData, leetcodeEvidence, dbEvidence }

    // (A) Resume Skills
    const resumeSkills = latestResume?.skills || [];
    for (const rSkill of resumeSkills) {
      const name = typeof rSkill === 'string' ? rSkill : rSkill.name;
      if (!name) continue;
      const key = normalizeSkill(name);
      if (!rawSkillsMap.has(key)) {
        rawSkillsMap.set(key, {
          canonicalName: name,
          category: (typeof rSkill === 'object' && rSkill.category) || getSkillCategory(name),
          sources: new Set(['RESUME']),
          resumeClaim: {
            found: true,
            confidence: rSkill.confidence || 'MEDIUM',
            evidenceText: rSkill.evidenceText || 'Extracted from uploaded resume claims.',
          },
          githubEvidence: null,
          leetcodeEvidence: null,
          dbEvidence: null,
        });
      } else {
        const item = rawSkillsMap.get(key);
        item.sources.add('RESUME');
        item.resumeClaim = {
          found: true,
          confidence: rSkill.confidence || 'MEDIUM',
          evidenceText: rSkill.evidenceText || item.resumeClaim?.evidenceText,
        };
      }
    }

    // (B) StudentProfile self-reported skills
    const profileSkills = profile?.skills || [];
    for (const pSkill of profileSkills) {
      if (!pSkill.name) continue;
      const key = normalizeSkill(pSkill.name);
      if (!rawSkillsMap.has(key)) {
        rawSkillsMap.set(key, {
          canonicalName: pSkill.name,
          category: pSkill.category || getSkillCategory(pSkill.name),
          sources: new Set(['PROFILE']),
          resumeClaim: null,
          githubEvidence: null,
          leetcodeEvidence: null,
          dbEvidence: null,
        });
      }
    }

    // (C) GitHub Discovered Technologies & Repositories
    const githubRepos = githubDoc?.repositories || [];
    const ownedRepos = githubRepos.filter((r) => r.ownershipStatus === 'OWNED');

    for (const repo of githubRepos) {
      const detectedTechs = [
        ...(repo.detectedTechnologies || []),
        ...(repo.languages || []).map((l) => l.name),
      ];

      for (const tech of detectedTechs) {
        if (!tech) continue;
        let matchedKey = null;

        // Check if tech matches any existing skill key
        for (const [key, val] of rawSkillsMap.entries()) {
          if (isSkillMatch(tech, val.canonicalName) || isSkillMatch(tech, key)) {
            matchedKey = key;
            break;
          }
        }

        if (!matchedKey) {
          matchedKey = normalizeSkill(tech);
          rawSkillsMap.set(matchedKey, {
            canonicalName: tech,
            category: getSkillCategory(tech),
            sources: new Set(['GITHUB']),
            resumeClaim: null,
            githubEvidence: {
              repositories: [],
              hasOwnedRepo: false,
              hasDependencies: false,
            },
            leetcodeEvidence: null,
            dbEvidence: null,
          });
        }

        const skillEntry = rawSkillsMap.get(matchedKey);
        skillEntry.sources.add('GITHUB');
        if (!skillEntry.githubEvidence) {
          skillEntry.githubEvidence = {
            repositories: [],
            hasOwnedRepo: false,
            hasDependencies: false,
          };
        }

        const alreadyAdded = skillEntry.githubEvidence.repositories.some((r) => r.name === repo.name);
        if (!alreadyAdded) {
          const isOwned = repo.ownershipStatus === 'OWNED';
          const hasDeps = repo.dependencyFilesFound?.length > 0;
          if (isOwned) skillEntry.githubEvidence.hasOwnedRepo = true;
          if (hasDeps) skillEntry.githubEvidence.hasDependencies = true;

          skillEntry.githubEvidence.repositories.push({
            name: repo.name,
            fullName: repo.fullName || `${repo.owner}/${repo.name}`,
            htmlUrl: repo.htmlUrl,
            description: repo.description || '',
            ownership: repo.ownershipStatus || (repo.isFork ? 'FORKED' : 'OWNED'),
            isFork: !!repo.isFork,
            stars: repo.stars || 0,
            forks: repo.forks || 0,
            activity: repo.recencyStatus || 'ACTIVE',
            evidenceStrength: repo.evidenceStrength || 'HIGH',
            primaryLanguage: repo.primaryLanguage || '',
            dependencyFiles: repo.dependencyFilesFound || [],
            detectedTechnologies: repo.detectedTechnologies || [],
          });
        }
      }
    }

    // (D) LeetCode Coding Activity & DSA Proof
    if (leetcodeDoc && leetcodeDoc.totalSolved > 0) {
      const lcVerified = leetcodeDoc.verifiedClaims || [];
      for (const item of lcVerified) {
        let matchedKey = null;
        for (const [key, val] of rawSkillsMap.entries()) {
          if (isSkillMatch(item.skill, val.canonicalName) || isSkillMatch(item.skill, key)) {
            matchedKey = key;
            break;
          }
        }

        if (!matchedKey) {
          matchedKey = normalizeSkill(item.skill);
          rawSkillsMap.set(matchedKey, {
            canonicalName: item.canonicalName || item.skill,
            category: 'DSA & Problem Solving',
            sources: new Set(['LEETCODE']),
            resumeClaim: null,
            githubEvidence: null,
            leetcodeEvidence: item,
            dbEvidence: null,
          });
        } else {
          const skillEntry = rawSkillsMap.get(matchedKey);
          skillEntry.sources.add('LEETCODE');
          skillEntry.leetcodeEvidence = item;
        }
      }
    }

    // (E) Attach DB Evidence records
    for (const ev of dbEvidenceList) {
      if (!ev.skill) continue;
      for (const [key, val] of rawSkillsMap.entries()) {
        if (isSkillMatch(ev.skill, val.canonicalName)) {
          val.dbEvidence = ev;
          break;
        }
      }
    }

    // 4. Compute Canonical Verification Status & Explanations
    const fusedSkills = [];

    for (const [key, entry] of rawSkillsMap.entries()) {
      const sourcesArray = Array.from(entry.sources);
      const gh = entry.githubEvidence;
      const lc = entry.leetcodeEvidence;
      const rc = entry.resumeClaim;
      const ghRepos = gh?.repositories || [];

      let status = 'UNVERIFIED';
      let confidence = 'LOW';
      let reason = '';
      const evidenceChain = [];

      const ownedGhRepos = ghRepos.filter((r) => r.ownership === 'OWNED');
      const forkedGhRepos = ghRepos.filter((r) => r.ownership === 'FORKED' || r.isFork);

      if (rc && rc.found) {
        evidenceChain.push({
          source: 'RESUME',
          detail: rc.evidenceText || `Claimed on uploaded technical resume.`,
          strength: 'CLAIMED',
        });
      }

      // Evaluate GitHub Codebase Proof
      if (gh && ghRepos.length > 0) {
        if (ownedGhRepos.length > 0) {
          const topRepo = ownedGhRepos[0];
          const hasDeps = ownedGhRepos.some((r) => r.dependencyFiles?.length > 0);

          if (hasDeps) {
            status = 'VERIFIED';
            confidence = 'HIGH';
            reason = `${entry.canonicalName} is claimed in your resume and confirmed by ${ownedGhRepos.length} owned GitHub ${ownedGhRepos.length === 1 ? 'repository' : 'repositories'} (e.g. "${topRepo.name}") with verified package dependencies.`;
            evidenceChain.push({
              source: 'GITHUB',
              detail: `Verified in candidate-owned repository "${topRepo.name}" with manifest dependency proof (${topRepo.dependencyFiles.join(', ')}).`,
              strength: 'VERIFIED',
            });
          } else {
            status = 'VERIFIED';
            confidence = 'MEDIUM';
            reason = `${entry.canonicalName} is supported by ${ownedGhRepos.length} owned GitHub ${ownedGhRepos.length === 1 ? 'repository' : 'repositories'} (e.g. "${topRepo.name}") based on repository language and source files.`;
            evidenceChain.push({
              source: 'GITHUB',
              detail: `Observable in repository "${topRepo.name}" (${topRepo.primaryLanguage || 'Codebase'}).`,
              strength: 'VERIFIED',
            });
          }
        } else if (forkedGhRepos.length > 0) {
          status = 'PARTIALLY_VERIFIED';
          confidence = 'LOW';
          reason = `${entry.canonicalName} was detected in ${forkedGhRepos.length} forked repository (e.g. "${forkedGhRepos[0].name}"). Forked repositories provide partial proof pending original contributions.`;
          evidenceChain.push({
            source: 'GITHUB',
            detail: `Detected in forked repository "${forkedGhRepos[0].name}".`,
            strength: 'PARTIALLY_VERIFIED',
          });
        }
      }

      // Merge LeetCode Coding Activity Proof
      if (lc) {
        if (lc.status === 'VERIFIED') {
          if (status === 'VERIFIED') {
            // Verified across BOTH GitHub and LeetCode
            const solvedCount = lc.evidenceCount || leetcodeDoc?.totalSolved || 0;
            confidence = 'HIGH';
            reason = `${entry.canonicalName} is verified across both GitHub codebase repositories (${ownedGhRepos.length} repos) and LeetCode problem solving (${solvedCount} solved).`;
          } else {
            const solvedCount = lc.evidenceCount || leetcodeDoc?.totalSolved || 0;
            status = 'VERIFIED';
            confidence = lc.confidence || 'HIGH';
            reason = rc?.found
              ? `${entry.canonicalName} is claimed in your resume and verified by solving ${solvedCount} problems on LeetCode with active problem solving metrics.`
              : lc.reason;
          }
          evidenceChain.push({
            source: 'LEETCODE',
            detail: lc.reason,
            strength: lc.strength || 'VERY_STRONG',
          });
        } else if (lc.status === 'PARTIALLY_VERIFIED' && status !== 'VERIFIED') {
          status = 'PARTIALLY_VERIFIED';
          confidence = lc.confidence || 'MEDIUM';
          reason = lc.reason;
          evidenceChain.push({
            source: 'LEETCODE',
            detail: lc.reason,
            strength: lc.strength || 'MODERATE',
          });
        }
      }

      if (status === 'UNVERIFIED' && rc && rc.found) {
        confidence = 'LOW';
        reason = `Claimed on resume, but no matching public GitHub repository or LeetCode coding proof was found in connected accounts. Verification remains pending.`;
      } else if (status === 'UNVERIFIED' && !rc) {
        status = 'NOT_FOUND';
        confidence = 'LOW';
        reason = `No supporting public evidence found in connected sources.`;
      }

      // If already strongly verified in DB Evidence
      if (entry.dbEvidence?.finalStatus === 'STRONGLY_VERIFIED' || entry.dbEvidence?.finalStatus === 'VERIFIED') {
        if (status !== 'VERIFIED') {
          if (entry.dbEvidence.evidenceSources?.github?.found || entry.dbEvidence.evidenceSources?.leetcode?.found) {
            status = 'VERIFIED';
            confidence = entry.dbEvidence.confidence || 'HIGH';
          }
        }
      }

      fusedSkills.push({
        skill: entry.canonicalName,
        category: entry.category,
        status,
        confidence,
        confidenceScore: confidence === 'HIGH' ? 90 : confidence === 'MEDIUM' ? 70 : 25,
        sources: sourcesArray,
        evidenceCount: ghRepos.length + (lc ? lc.evidenceCount : 0) + (rc ? 1 : 0),
        repositories: ghRepos,
        leetcodeData: lc ? {
          totalSolved: leetcodeDoc?.totalSolved || 0,
          mediumSolved: leetcodeDoc?.mediumSolved || 0,
          hardSolved: leetcodeDoc?.hardSolved || 0,
          contestRating: leetcodeDoc?.contestRating || null,
          strength: lc.strength || 'STRONG',
          reason: lc.reason,
        } : null,
        reason,
        evidenceChain,
        isResumeClaim: !!rc,
        isGithubVerified: status === 'VERIFIED' && sourcesArray.includes('GITHUB'),
        isLeetcodeVerified: status === 'VERIFIED' && sourcesArray.includes('LEETCODE'),
      });
    }

    // Sort: VERIFIED first, then PARTIALLY_VERIFIED, then UNVERIFIED, then alphabetically
    const statusOrder = { VERIFIED: 1, STRONGLY_VERIFIED: 1, PARTIALLY_VERIFIED: 2, UNVERIFIED: 3, NOT_FOUND: 4 };
    fusedSkills.sort((a, b) => {
      const diff = (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
      if (diff !== 0) return diff;
      return a.skill.localeCompare(b.skill);
    });

    // 5. Compute Statistics & Coverage
    const totalSkills = fusedSkills.length;
    const verifiedSkills = fusedSkills.filter((s) => s.status === 'VERIFIED' || s.status === 'STRONGLY_VERIFIED');
    const partiallyVerifiedSkills = fusedSkills.filter((s) => s.status === 'PARTIALLY_VERIFIED');
    const unverifiedSkills = fusedSkills.filter((s) => s.status === 'UNVERIFIED');
    const claimedSkills = fusedSkills.filter((s) => s.isResumeClaim);

    const coveragePercentage = claimedSkills.length > 0
      ? Math.round((claimedSkills.filter((s) => s.status === 'VERIFIED').length / claimedSkills.length) * 100)
      : totalSkills > 0
      ? Math.round((verifiedSkills.length / totalSkills) * 100)
      : 0;

    // 6. Generate Deterministic Insights
    const insights = [
      `${verifiedSkills.length} of your ${totalSkills} tracked technical ${totalSkills === 1 ? 'skill has' : 'skills have'} verified public codebase or coding activity proof.`,
      sourcesConnected.github
        ? `Connected to GitHub (@${githubDoc.username}) with ${githubRepos.length} public repositories scanned.`
        : 'Connect your public GitHub handle to verify project and framework claims.',
      sourcesConnected.leetcode
        ? `Connected to LeetCode (@${leetcodeDoc.username}) with ${leetcodeDoc.totalSolved} problems solved (${leetcodeDoc.mediumSolved + leetcodeDoc.hardSolved} Medium/Hard).`
        : 'Connect LeetCode to verify Data Structures, Algorithms, and Problem Solving claims.',
      sourcesConnected.resume
        ? `Resume analysis extracted ${claimedSkills.length} technical claims from your latest uploaded resume.`
        : 'Upload a PDF resume to extract and benchmark your career claims.',
      unverifiedSkills.length > 0
        ? `${unverifiedSkills.length} ${unverifiedSkills.length === 1 ? 'skill claim is' : 'skill claims are'} pending public code or activity evidence.`
        : 'All detected resume claims have supporting repository or coding evidence.',
    ];

    return {
      success: true,
      candidateId,
      timestamp: new Date().toISOString(),
      summary: {
        totalSkills,
        verifiedCount: verifiedSkills.length,
        partiallyVerifiedCount: partiallyVerifiedSkills.length,
        unverifiedCount: unverifiedSkills.length,
        claimedCount: claimedSkills.length,
        evidenceCoveragePercentage: coveragePercentage,
        sourcesConnected,
        githubUsername: githubDoc?.username || null,
        leetcodeUsername: leetcodeDoc?.username || null,
        leetcodeTotalSolved: leetcodeDoc?.totalSolved || 0,
        resumeUploaded: sourcesConnected.resume,
      },
      insights,
      skills: fusedSkills,
    };
  }

  /**
   * Retrieves deep evidence breakdown for a single skill
   */
  async getSingleSkillEvidence(candidateId, skillName) {
    const fusionData = await this.getFusedSkillEvidence(candidateId);
    const target = fusionData.skills.find(
      (s) => isSkillMatch(s.skill, skillName) || normalizeSkill(s.skill) === normalizeSkill(skillName)
    );

    if (!target) {
      return {
        success: false,
        message: `Skill "${skillName}" not found in candidate claims or repository evidence.`,
        skill: null,
      };
    }

    return {
      success: true,
      skill: target,
      summary: fusionData.summary,
    };
  }

  /**
   * Synchronizes and persists candidate SkillClaim documents in MongoDB
   * Invoked whenever Resume is uploaded or GitHub is analyzed/switched/disconnected
   */
  async syncCandidateSkillClaims(candidateId) {
    if (!candidateId) return null;

    const profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] }).lean();
    const fusionData = await this.getFusedSkillEvidence(candidateId);
    const { skills: fusedSkills, summary } = fusionData;

    const updatedClaims = [];
    const processedNorms = new Set();

    for (const item of fusedSkills) {
      const norm = normalizeSkill(item.skill);
      if (!norm) continue;
      processedNorms.add(norm);

      const isClaimedInResume = item.isResumeClaim;
      const isVerified = item.status === 'VERIFIED' || item.status === 'STRONGLY_VERIFIED';
      const isPartial = item.status === 'PARTIALLY_VERIFIED';

      const updatePayload = {
        candidateId,
        studentId: candidateId,
        studentProfile: profile?._id || null,
        collegeId: profile?.collegeId || null,
        skill: item.skill,
        normalizedSkill: norm,
        category: item.category || getSkillCategory(item.skill),
        claimText: item.resumeClaimText || (isClaimedInResume ? `Claimed in resume under ${item.category || 'skills'}` : ''),
        source: isClaimedInResume ? 'RESUME' : 'GITHUB',
        status: item.status,
        verificationStatus: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'PENDING',
        confidence: item.confidence || 'LOW',
        confidenceScore: isVerified ? (item.confidence === 'HIGH' ? 95 : 80) : isPartial ? 50 : 25,
        supportingSources: item.sources || (isClaimedInResume ? ['RESUME'] : ['GITHUB']),
        evidenceCount: item.evidenceCount || (item.repositories?.length || 0),
        evidenceFound: isVerified || isPartial,
        evidenceNote: item.reason || '',
        reason: item.reason || '',
        lastVerifiedAt: (isVerified || isPartial) ? new Date() : null,
      };

      const claimDoc = await SkillClaim.findOneAndUpdate(
        { candidateId, normalizedSkill: norm },
        { $set: updatePayload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      updatedClaims.push(claimDoc);
    }

    // Clean up stale claims that were only external (e.g. removed GitHub repo skills not in resume)
    await SkillClaim.deleteMany({
      candidateId,
      normalizedSkill: { $nin: Array.from(processedNorms) },
      source: { $ne: 'RESUME' },
    });

    // Reset any leftover claims to UNVERIFIED
    await SkillClaim.updateMany(
      {
        candidateId,
        normalizedSkill: { $nin: Array.from(processedNorms) },
      },
      {
        $set: {
          status: 'UNVERIFIED',
          verificationStatus: 'PENDING',
          confidence: 'LOW',
          confidenceScore: 25,
          supportingSources: ['RESUME'],
          evidenceCount: 0,
          evidenceFound: false,
          lastVerifiedAt: null,
          reason: 'Claimed on resume, but no matching external proof was found in connected repositories. Verification remains pending.',
        },
      }
    );

    return {
      success: true,
      candidateId,
      claimsCount: updatedClaims.length,
      summary,
      claims: updatedClaims,
    };
  }
}

module.exports = new EvidenceFusionService();
module.exports.normalizeSkill = normalizeSkill;
module.exports.isSkillMatch = isSkillMatch;
module.exports.getSkillCategory = getSkillCategory;

