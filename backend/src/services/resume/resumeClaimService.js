const ResumeAnalysis = require('../../models/ResumeAnalysis');
const SkillClaim = require('../../models/SkillClaim');
const Evidence = require('../../models/Evidence');
const StudentProfile = require('../../models/StudentProfile');
const evidenceFusionService = require('../evidence/evidenceFusionService');
const { normalizeSkill, isSkillMatch, getCanonicalDisplayName } = require('../../utils/skillUtils');

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class ResumeClaimService {
  /**
   * Persists extracted resume intelligence, skill claims, and evidence records to MongoDB
   */
  async persistResumeIntelligence(candidateId, normalizedData, metadata, fileInfo) {
    // 1. Get or create StudentProfile
    let profile = await StudentProfile.findOne({ user: candidateId });
    if (!profile) {
      profile = await StudentProfile.findOne({ studentId: candidateId });
    }

    // 2. Persist ResumeAnalysis document
    const resumeAnalysis = await ResumeAnalysis.create({
      candidateId: candidateId,
      studentProfile: profile ? profile._id : null,
      originalFileName: fileInfo.originalFileName,
      fileType: fileInfo.fileType || 'application/pdf',
      fileSize: fileInfo.fileSize || 0,
      extractionStatus: 'COMPLETED',
      extractionVersion: 'v1.0-gemini',
      summary: normalizedData.summary || '',
      candidate: normalizedData.candidate,
      education: normalizedData.education,
      skills: normalizedData.skills,
      projects: normalizedData.projects,
      experience: normalizedData.experience,
      internships: normalizedData.internships,
      certifications: normalizedData.certifications,
      achievements: normalizedData.achievements,
      hackathons: normalizedData.hackathons,
      codingProfiles: normalizedData.codingProfiles,
      claims: normalizedData.claims,
      extractionMetadata: metadata,
    });

    // 3. Persist SkillClaims (Resume is a claim source: status = UNVERIFIED initially)
    let claimsCreated = 0;
    if (profile) {
      for (const skill of normalizedData.skills) {
        const norm = normalizeSkill(skill.name);
        try {
          await SkillClaim.findOneAndUpdate(
            { candidateId, normalizedSkill: norm },
            {
              $set: {
                candidateId,
                studentId: candidateId,
                studentProfile: profile._id,
                collegeId: profile.collegeId,
                skill: skill.name.trim(),
                normalizedSkill: norm,
                category: skill.category || 'OTHER',
                claimText: skill.evidenceText || `Claimed in resume under ${skill.category || 'skills'}`,
                source: 'RESUME',
                claimStrength: 'SELF_DECLARED',
                status: 'UNVERIFIED',
                verificationStatus: 'PENDING',
                confidence: skill.confidence || 'LOW',
                confidenceScore: 25,
                supportingSources: ['RESUME'],
                evidenceCount: 0,
                evidenceFound: false,
                evidenceNote: skill.evidenceText || '',
                reason: 'Claimed on technical resume. Awaiting connected external proof.',
              },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          claimsCreated++;
        } catch (err) {
          console.warn(`[ResumeClaimService] SkillClaim save error for ${skill.name}:`, err.message);
        }
      }

      // 4. Persist Evidence Records (status: UNVERIFIED, source: RESUME)
      for (const skill of normalizedData.skills) {
        const safeSkillPattern = new RegExp(`^${escapeRegex(skill.name.trim())}$`, 'i');
        try {
          let evidence = await Evidence.findOne({
            studentProfile: profile._id,
            skill: { $regex: safeSkillPattern },
          });

          if (!evidence) {
            await Evidence.create({
              studentProfile: profile._id,
              studentId: candidateId,
              collegeId: profile.collegeId,
              skill: skill.name.trim(),
              category: skill.category,
              claims: {
                resume: true,
                linkedIn: false,
                selfReported: true,
                portfolio: false,
              },
              evidenceSources: {
                resume: {
                  found: true,
                  level: 'Claimed',
                  detail: skill.evidenceText,
                },
              },
              finalStatus: 'UNVERIFIED',
              confidence: skill.confidence || 'MEDIUM',
              confidencePercentage: 25, // Unverified baseline
              evidenceChain: [
                {
                  source: 'RESUME',
                  detail: skill.evidenceText,
                  strength: 'CLAIMED',
                },
              ],
              whyVerifiedExplanation: 'Candidate claims this skill on their uploaded technical resume. Verification requires public repository commits or coding activity proof.',
            });
          } else {
            // Update existing evidence with resume claim
            evidence.claims.resume = true;
            evidence.evidenceSources.resume = {
              found: true,
              level: 'Claimed',
              detail: skill.evidenceText,
            };
            if (evidence.finalStatus === 'NOT_FOUND') {
              evidence.finalStatus = 'UNVERIFIED';
            }
            await evidence.save();
          }
        } catch (err) {
          console.warn(`[ResumeClaimService] Evidence save error for ${skill.name}:`, err.message);
        }
      }

      // 5. Update StudentProfile with parsed resume metadata & extracted data
      try {
        profile.resume = {
          fileName: fileInfo.originalFileName,
          fileSize: `${Math.round((fileInfo.fileSize || 0) / 1024)} KB`,
          uploadedAt: new Date(),
          extractedSkills: normalizedData.skills.map((s) => s.name),
          extractedProjects: normalizedData.projects.map((p) => p.name),
          extractedCertifications: normalizedData.certifications.map((c) => c.name),
          extractedExperience: normalizedData.experience.map((e) => `${e.role || ''} at ${e.company}`.trim()),
          status: 'ANALYZED',
        };

        // Update skills list in profile (marked unverified)
        const currentSkillNames = new Set((profile.skills || []).map((s) => s.name.toLowerCase()));
        for (const s of normalizedData.skills) {
          if (!currentSkillNames.has(s.name.toLowerCase())) {
            profile.skills.push({
              name: s.name,
              level: s.confidence === 'HIGH' ? 'Advanced' : s.confidence === 'LOW' ? 'Beginner' : 'Intermediate',
              category: s.category,
              verified: false,
              verificationStatus: 'UNVERIFIED',
            });
          }
        }

        // Add projects from resume if not present
        const currentProjectTitles = new Set((profile.projects || []).map((p) => p.title.toLowerCase()));
        for (const p of normalizedData.projects) {
          if (!currentProjectTitles.has(p.name.toLowerCase())) {
            profile.projects.push({
              title: p.name,
              description: p.description || '',
              technologies: p.technologies || [],
              repoUrl: p.githubUrl || '',
              liveUrl: p.demoUrl || '',
              commitsCount: 0,
              isFork: false,
              ownershipStatus: 'ORIGINAL_OWNER',
              evidenceIntegrity: 'Needs Review',
              integrityReason: 'Resume claim — awaiting GitHub repository link and commit audit.',
              highlight: p.responsibilities?.[0] || 'Extracted from resume',
            });
          }
        }

        // Add certifications from resume
        const currentCertTitles = new Set((profile.certifications || []).map((c) => c.title.toLowerCase()));
        for (const c of normalizedData.certifications) {
          if (!currentCertTitles.has(c.name.toLowerCase())) {
            profile.certifications.push({
              title: c.name,
              issuer: c.issuer || 'Online Certification',
              issueDate: c.date || 'Recent',
              credentialUrl: c.credentialUrl || '',
              verified: false,
            });
          }
        }

        // Add internships from resume
        if (normalizedData.internships.length > 0 && (!profile.internships || profile.internships.length === 0)) {
          profile.internships = normalizedData.internships.map((i) => ({
            role: i.role || 'Intern',
            company: i.company,
            duration: i.startDate ? `${i.startDate} - ${i.endDate || 'Present'}` : 'Recent',
            description: i.responsibilities?.join(' ') || '',
            technologies: i.technologies || [],
          }));
        }

        // Update coding platform handles if detected in resume
        for (const cp of normalizedData.codingProfiles) {
          if (cp.username || cp.url) {
            const handleOrUrl = cp.username || cp.url;
            if (cp.platform === 'GITHUB' && (!profile.platformHandles.github || profile.platformHandles.github === 'alexkumar-dev')) {
              profile.platformHandles.github = handleOrUrl;
            } else if (cp.platform === 'LEETCODE' && (!profile.platformHandles.leetcode || profile.platformHandles.leetcode === 'alex_code')) {
              profile.platformHandles.leetcode = handleOrUrl;
            } else if (cp.platform === 'GFG') {
              profile.platformHandles.gfg = handleOrUrl;
            } else if (cp.platform === 'CODECHEF') {
              profile.platformHandles.codechef = handleOrUrl;
            } else if (cp.platform === 'HACKERRANK') {
              profile.platformHandles.hackerrank = handleOrUrl;
            }
          }
        }

        await profile.save();
      } catch (err) {
        console.warn('[ResumeClaimService] StudentProfile update warning:', err.message);
      }
    }

    // 6. Automatically sync resume claims with global evidence fusion (fuses any connected GitHub evidence)
    try {
      await evidenceFusionService.syncCandidateSkillClaims(candidateId);
    } catch (syncErr) {
      console.warn('[ResumeClaimService] Evidence fusion sync warning:', syncErr.message);
    }

    return {
      resumeAnalysis,
      summary: {
        skillsFound: normalizedData.skills.length,
        projectsFound: normalizedData.projects.length,
        experienceFound: normalizedData.experience.length + normalizedData.internships.length,
        certificationsFound: normalizedData.certifications.length,
        claimsFound: normalizedData.claims.length,
      },
    };
  }
}

module.exports = new ResumeClaimService();
