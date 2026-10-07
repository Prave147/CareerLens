const Evidence = require('../../models/Evidence');
const StudentProfile = require('../../models/StudentProfile');

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class LeetCodeEvidenceService {
  /**
   * Syncs LeetCode coding proof into candidate's Evidence documents
   */
  async syncEvidenceFromLeetCode(candidateId, leetcodeProfile, verifiedSkills = []) {
    let profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });
    const collegeId = profile ? profile.collegeId : null;
    const studentProfileId = profile ? profile._id : null;

    for (const item of verifiedSkills) {
      const safeSkillPattern = new RegExp(`^${escapeRegex(item.skill.trim())}$`, 'i');
      const isVerified = item.status === 'VERIFIED';
      const isPartial = item.status === 'PARTIALLY_VERIFIED';

      try {
        let evidence = await Evidence.findOne({
          $or: [
            { studentId: candidateId, skill: { $regex: safeSkillPattern } },
            ...(studentProfileId ? [{ studentProfile: studentProfileId, skill: { $regex: safeSkillPattern } }] : []),
          ],
        });

        const leetcodeSourceEntry = {
          found: true,
          level: item.strength === 'VERY_STRONG' ? 'Strong' : item.strength === 'STRONG' ? 'Strong' : 'Moderate',
          problemsSolved: item.evidenceCount,
          detail: item.reason,
        };

        if (!evidence) {
          evidence = new Evidence({
            studentProfile: studentProfileId,
            studentId: candidateId,
            collegeId: collegeId,
            skill: item.canonicalName || item.skill,
            category: 'DSA & Problem Solving',
            claims: {
              resume: false,
              linkedIn: false,
              selfReported: false,
              portfolio: false,
            },
            evidenceSources: {
              leetcode: leetcodeSourceEntry,
            },
            finalStatus: isVerified ? 'VERIFIED' : isPartial ? 'PARTIALLY_VERIFIED' : 'UNVERIFIED',
            confidence: item.confidence,
            confidencePercentage: isVerified ? (item.confidence === 'HIGH' ? 95 : 82) : 55,
            evidenceChain: [
              {
                source: 'LEETCODE',
                detail: item.reason,
                strength: item.strength,
              },
            ],
            whyVerifiedExplanation: item.reason,
          });
          await evidence.save();
        } else {
          // Update existing evidence with LeetCode proof without overwriting GitHub proof
          if (!evidence.evidenceSources) evidence.evidenceSources = {};
          evidence.evidenceSources.leetcode = leetcodeSourceEntry;

          // Merge evidenceChain
          evidence.evidenceChain = (evidence.evidenceChain || []).filter((c) => c.source !== 'LEETCODE');
          evidence.evidenceChain.push({
            source: 'LEETCODE',
            detail: item.reason,
            strength: item.strength,
          });

          // Elevate status if verified by LeetCode
          if (isVerified && evidence.finalStatus !== 'STRONGLY_VERIFIED') {
            evidence.finalStatus = 'VERIFIED';
            evidence.confidence = item.confidence;
            evidence.confidencePercentage = Math.max(evidence.confidencePercentage || 0, item.confidence === 'HIGH' ? 95 : 82);
          } else if (isPartial && evidence.finalStatus === 'UNVERIFIED') {
            evidence.finalStatus = 'PARTIALLY_VERIFIED';
            evidence.confidence = 'MEDIUM';
            evidence.confidencePercentage = Math.max(evidence.confidencePercentage || 0, 55);
          }

          evidence.whyVerifiedExplanation = item.reason;
          await evidence.save();
        }
      } catch (err) {
        console.warn(`[LeetCodeEvidenceService] Error updating evidence for ${item.skill}:`, err.message);
      }
    }
  }

  /**
   * Resets LeetCode proof from Evidence documents when disconnected
   */
  async resetLeetCodeEvidence(candidateId) {
    let profile = await StudentProfile.findOne({ $or: [{ user: candidateId }, { studentId: candidateId }] });
    const evidenceList = await Evidence.find({
      $or: [{ studentId: candidateId }, ...(profile?._id ? [{ studentProfile: profile._id }] : [])],
    });

    for (const ev of evidenceList) {
      if (ev.evidenceSources?.leetcode?.found) {
        ev.evidenceSources.leetcode = {
          found: false,
          level: 'Not Found',
          detail: 'LeetCode account disconnected.',
        };
        ev.evidenceChain = (ev.evidenceChain || []).filter((c) => c.source !== 'LEETCODE');
        
        // If no other proof source exists (no github, no resume claims), revert
        const hasGithub = ev.evidenceSources?.github?.found;
        if (!hasGithub) {
          ev.finalStatus = 'UNVERIFIED';
          ev.confidence = 'LOW';
          ev.confidencePercentage = 25;
          ev.whyVerifiedExplanation = 'No active coding platform connected. Verification remains pending.';
        }
        await ev.save();
      }
    }
  }
}

module.exports = new LeetCodeEvidenceService();
