const Evidence = require('../../models/Evidence');
const SkillClaim = require('../../models/SkillClaim');
const StudentProfile = require('../../models/StudentProfile');
const Project = require('../../models/Project');

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class GithubEvidenceService {
  /**
   * Syncs GitHub repository evidence with MongoDB Evidence, SkillClaim, and StudentProfile documents
   */
  async syncEvidenceFromGithub(candidateId, verifiedSkillMatches, pendingSkillClaims, repositories, projectMatches) {
    let profile = await StudentProfile.findOne({ user: candidateId });
    if (!profile) {
      profile = await StudentProfile.findOne({ studentId: candidateId });
    }

    const collegeId = profile ? profile.collegeId : null;
    const studentProfileId = profile ? profile._id : null;

    // 1. Process VERIFIED skills (Confirmed in current GitHub repositories)
    const verifiedSkillNames = new Set(verifiedSkillMatches.map((m) => m.skill.toLowerCase().trim()));

    for (const match of verifiedSkillMatches) {
      const topRepo = match.matchingRepos[0]?.repoName || 'public repositories';
      const strength = match.strength || 'HIGH';
      const safeSkillPattern = new RegExp(`^${escapeRegex(match.skill.trim())}$`, 'i');

      try {
        let evidence = await Evidence.findOne({
          studentProfile: studentProfileId,
          skill: { $regex: safeSkillPattern },
        });

        if (!evidence) {
          evidence = new Evidence({
            studentProfile: studentProfileId,
            studentId: candidateId,
            collegeId: collegeId,
            skill: match.canonicalName || match.skill,
            category: 'Core Technology',
            claims: {
              resume: true,
              linkedIn: false,
              selfReported: true,
              portfolio: false,
            },
            evidenceSources: {
              github: {
                found: true,
                level: strength === 'HIGH' ? 'Strong' : 'Moderate',
                repoName: topRepo,
                detail: `Detected in repository "${topRepo}" with confirmed codebase evidence.`,
              },
            },
            finalStatus: strength === 'HIGH' ? 'STRONGLY_VERIFIED' : 'VERIFIED',
            confidence: strength,
            confidencePercentage: strength === 'HIGH' ? 92 : 78,
            evidenceChain: [
              {
                source: 'GITHUB',
                detail: `Repository "${topRepo}" contains verified ${match.canonicalName || match.skill} codebase implementation.`,
                strength: 'VERIFIED',
              },
            ],
            whyVerifiedExplanation: `Verified through observable code and dependency evidence in candidate's repository "${topRepo}".`,
          });
          await evidence.save();
        } else {
          // Update existing evidence with current GitHub proof
          evidence.evidenceSources.github = {
            found: true,
            level: strength === 'HIGH' ? 'Strong' : 'Moderate',
            repoName: topRepo,
            detail: `Detected in repository "${topRepo}" with confirmed codebase evidence.`,
          };
          evidence.finalStatus = strength === 'HIGH' ? 'STRONGLY_VERIFIED' : 'VERIFIED';
          evidence.confidence = strength;
          evidence.confidencePercentage = Math.max(evidence.confidencePercentage || 0, strength === 'HIGH' ? 92 : 78);

          // Remove old GitHub chain entries and insert fresh verified entry
          evidence.evidenceChain = (evidence.evidenceChain || []).filter((c) => c.source !== 'GITHUB');
          evidence.evidenceChain.push({
            source: 'GITHUB',
            detail: `Repository "${topRepo}" contains verified ${match.canonicalName || match.skill} codebase implementation.`,
            strength: 'VERIFIED',
          });
          evidence.whyVerifiedExplanation = `Verified through observable code and dependency evidence in candidate's repository "${topRepo}".`;
          await evidence.save();
        }

        // Update SkillClaim
        await SkillClaim.findOneAndUpdate(
          {
            studentId: candidateId,
            skill: { $regex: safeSkillPattern },
          },
          {
            $set: {
              verificationStatus: 'VERIFIED',
              evidenceFound: true,
              evidenceNote: `Verified in repository "${topRepo}".`,
            },
          }
        );
      } catch (err) {
        console.warn(`[GithubEvidenceService] Error updating evidence for ${match.skill}:`, err.message);
      }
    }

    // 2. Process UNVERIFIED claims (No GitHub evidence found in CURRENT profile)
    // CRITICAL: If a skill was previously marked verified by an OLD GitHub profile, reset it
    for (const pending of pendingSkillClaims) {
      const safePendingPattern = new RegExp(`^${escapeRegex(pending.skill.trim())}$`, 'i');
      try {
        let evidence = await Evidence.findOne({
          studentProfile: studentProfileId,
          skill: { $regex: safePendingPattern },
        });

        if (evidence) {
          // Reset GitHub source proof for this evidence
          evidence.evidenceSources.github = {
            found: false,
            level: 'Not Found',
            detail: 'No matching public GitHub repository found in connected profile.',
          };

          // If no other proof source exists (resume claim only), status is UNVERIFIED
          evidence.evidenceChain = (evidence.evidenceChain || []).filter((c) => c.source !== 'GITHUB');
          evidence.finalStatus = 'UNVERIFIED';
          evidence.confidence = 'MEDIUM';
          evidence.confidencePercentage = 25;
          evidence.whyVerifiedExplanation = 'No matching public GitHub evidence found in connected account. Verification remains pending.';
          await evidence.save();
        }

        await SkillClaim.findOneAndUpdate(
          {
            studentId: candidateId,
            skill: { $regex: safePendingPattern },
          },
          {
            $set: {
              verificationStatus: 'PENDING',
              evidenceFound: false,
              evidenceNote: 'Awaiting codebase verification.',
            },
          }
        );
      } catch (err) {
        console.warn(`[GithubEvidenceService] Error updating unverified claim for ${pending.skill}:`, err.message);
      }
    }

    // 3. Update StudentProfile skills and projects
    if (profile) {
      try {
        // Update verified status on profile skills (reflect current verified set)
        if (profile.skills && profile.skills.length > 0) {
          profile.skills = profile.skills.map((s) => {
            const isVer = verifiedSkillNames.has(s.name.toLowerCase().trim());
            return {
              ...s.toObject(),
              verified: isVer,
              verificationStatus: isVer ? 'VERIFIED' : 'UNVERIFIED',
            };
          });
        }

        // Update Project records with matched GitHub repository information
        if (projectMatches && projectMatches.length > 0) {
          for (const pm of projectMatches) {
            if (pm.matchStatus === 'MATCHED' && pm.matchedRepo) {
              const matchedRepo = pm.matchedRepo;
              const pIdx = (profile.projects || []).findIndex(
                (p) => p.title.toLowerCase() === pm.resumeProjectName.toLowerCase()
              );

              if (pIdx !== -1) {
                profile.projects[pIdx].repoUrl = matchedRepo.htmlUrl;
                profile.projects[pIdx].stars = matchedRepo.stars;
                profile.projects[pIdx].forks = matchedRepo.forks;
                profile.projects[pIdx].isFork = matchedRepo.isFork;
                profile.projects[pIdx].ownershipStatus = matchedRepo.ownershipStatus;
                profile.projects[pIdx].evidenceIntegrity =
                  matchedRepo.evidenceStrength === 'HIGH' ? 'High Confidence' : 'Moderate Confidence';
                profile.projects[pIdx].integrityReason =
                  matchedRepo.ownershipStatus === 'OWNED'
                    ? `Verified original owner repository on GitHub with ${matchedRepo.detectedTechnologies?.length || 0} confirmed technologies.`
                    : `Forked repository with ${matchedRepo.stars} stars.`;
              }
            }
          }
        }

        await profile.save();
      } catch (err) {
        console.warn('[GithubEvidenceService] Error saving StudentProfile:', err.message);
      }
    }
  }
}

module.exports = new GithubEvidenceService();
