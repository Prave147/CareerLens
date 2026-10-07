/**
 * Resume Normalizer
 * Validates, standardizes, and sanitizes structured resume extraction output.
 * Ensures non-hallucinatory valid fields and consistent data types.
 */

const normalizeCategory = (category) => {
  if (!category) return 'OTHER';
  const c = category.toUpperCase().trim();
  const valid = ['PROGRAMMING', 'FRAMEWORK', 'DATABASE', 'AI_ML', 'CLOUD', 'DEVOPS', 'TOOL', 'OTHER'];
  if (valid.includes(c)) return c;
  if (c.includes('LANG') || c.includes('PROG')) return 'PROGRAMMING';
  if (c.includes('FRAME') || c.includes('LIB') || c.includes('REACT') || c.includes('NODE')) return 'FRAMEWORK';
  if (c.includes('DATA') || c.includes('SQL') || c.includes('MONGO')) return 'DATABASE';
  if (c.includes('AI') || c.includes('ML') || c.includes('LEARN')) return 'AI_ML';
  if (c.includes('CLOUD') || c.includes('AWS') || c.includes('GCP') || c.includes('AZURE')) return 'CLOUD';
  if (c.includes('DOCKER') || c.includes('CI') || c.includes('DEV') || c.includes('OPS')) return 'DEVOPS';
  if (c.includes('TOOL') || c.includes('GIT') || c.includes('POSTMAN')) return 'TOOL';
  return 'OTHER';
};

const normalizePlatform = (platform) => {
  if (!platform) return 'OTHER';
  const p = platform.toUpperCase().trim();
  const valid = ['GITHUB', 'LEETCODE', 'GFG', 'CODECHEF', 'CODEFORCES', 'HACKERRANK', 'OTHER'];
  if (valid.includes(p)) return p;
  if (p.includes('GIT')) return 'GITHUB';
  if (p.includes('LEET')) return 'LEETCODE';
  if (p.includes('GEEKS') || p.includes('GFG')) return 'GFG';
  if (p.includes('CHEF')) return 'CODECHEF';
  if (p.includes('FORCES')) return 'CODEFORCES';
  if (p.includes('RANK')) return 'HACKERRANK';
  return 'OTHER';
};

const normalizeConfidence = (confidence) => {
  if (!confidence) return 'MEDIUM';
  const c = confidence.toUpperCase().trim();
  if (['HIGH', 'MEDIUM', 'LOW'].includes(c)) return c;
  return 'MEDIUM';
};

const normalizeClaimType = (type) => {
  if (!type) return 'OTHER';
  const t = type.toUpperCase().trim();
  const valid = ['SKILL', 'PROJECT', 'EXPERIENCE', 'ACHIEVEMENT', 'CERTIFICATION', 'OTHER'];
  if (valid.includes(t)) return t;
  return 'OTHER';
};

const normalizeResumeData = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return {
      candidate: { name: null, email: null, phone: null, location: null },
      summary: null,
      education: [],
      skills: [],
      projects: [],
      experience: [],
      internships: [],
      certifications: [],
      achievements: [],
      hackathons: [],
      codingProfiles: [],
      claims: [],
    };
  }

  // 1. Candidate Info
  const candidate = {
    name: raw.candidate?.name ? String(raw.candidate.name).trim() : null,
    email: raw.candidate?.email ? String(raw.candidate.email).trim().toLowerCase() : null,
    phone: raw.candidate?.phone ? String(raw.candidate.phone).trim() : null,
    location: raw.candidate?.location ? String(raw.candidate.location).trim() : null,
  };

  // 2. Summary
  const summary = raw.summary ? String(raw.summary).trim() : null;

  // 3. Education
  const education = Array.isArray(raw.education)
    ? raw.education
        .filter((e) => e && (e.degree || e.institution))
        .map((e) => ({
          degree: String(e.degree || '').trim(),
          institution: String(e.institution || '').trim(),
          field: e.field ? String(e.field).trim() : null,
          startYear: e.startYear ? Number(e.startYear) : null,
          endYear: e.endYear ? Number(e.endYear) : null,
          cgpa: e.cgpa ? String(e.cgpa).trim() : null,
          percentage: e.percentage ? String(e.percentage).trim() : null,
          evidenceText: e.evidenceText ? String(e.evidenceText).trim() : `${e.degree || ''} at ${e.institution || ''}`.trim(),
        }))
    : [];

  // 4. Skills (Deduplicated by normalized name)
  const skillsSeen = new Set();
  const skills = [];
  if (Array.isArray(raw.skills)) {
    for (const s of raw.skills) {
      if (!s || !s.name) continue;
      const cleanName = String(s.name).trim();
      const lower = cleanName.toLowerCase();
      if (!skillsSeen.has(lower) && cleanName.length > 0) {
        skillsSeen.add(lower);
        skills.push({
          name: cleanName,
          category: normalizeCategory(s.category),
          evidenceText: s.evidenceText ? String(s.evidenceText).trim() : `Mentioned as technical skill: ${cleanName}`,
          confidence: normalizeConfidence(s.confidence),
        });
      }
    }
  }

  // 5. Projects
  const projects = Array.isArray(raw.projects)
    ? raw.projects
        .filter((p) => p && p.name)
        .map((p) => ({
          name: String(p.name).trim(),
          description: p.description ? String(p.description).trim() : '',
          technologies: Array.isArray(p.technologies) ? p.technologies.map((t) => String(t).trim()).filter(Boolean) : [],
          responsibilities: Array.isArray(p.responsibilities) ? p.responsibilities.map((r) => String(r).trim()).filter(Boolean) : [],
          outcomes: Array.isArray(p.outcomes) ? p.outcomes.map((o) => String(o).trim()).filter(Boolean) : [],
          githubUrl: p.githubUrl ? String(p.githubUrl).trim() : null,
          demoUrl: p.demoUrl ? String(p.demoUrl).trim() : null,
          startDate: p.startDate ? String(p.startDate).trim() : null,
          endDate: p.endDate ? String(p.endDate).trim() : null,
          evidenceText: p.evidenceText ? String(p.evidenceText).trim() : `Project: ${p.name}`,
        }))
    : [];

  // 6. Experience
  const experience = Array.isArray(raw.experience)
    ? raw.experience
        .filter((exp) => exp && exp.company)
        .map((exp) => ({
          company: String(exp.company).trim(),
          role: exp.role ? String(exp.role).trim() : '',
          location: exp.location ? String(exp.location).trim() : null,
          startDate: exp.startDate ? String(exp.startDate).trim() : null,
          endDate: exp.endDate ? String(exp.endDate).trim() : null,
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.map((r) => String(r).trim()).filter(Boolean) : [],
          achievements: Array.isArray(exp.achievements) ? exp.achievements.map((a) => String(a).trim()).filter(Boolean) : [],
          evidenceText: exp.evidenceText ? String(exp.evidenceText).trim() : `${exp.role || 'Role'} at ${exp.company}`,
        }))
    : [];

  // 7. Internships
  const internships = Array.isArray(raw.internships)
    ? raw.internships
        .filter((i) => i && i.company)
        .map((i) => ({
          company: String(i.company).trim(),
          role: i.role ? String(i.role).trim() : null,
          startDate: i.startDate ? String(i.startDate).trim() : null,
          endDate: i.endDate ? String(i.endDate).trim() : null,
          responsibilities: Array.isArray(i.responsibilities) ? i.responsibilities.map((r) => String(r).trim()).filter(Boolean) : [],
          technologies: Array.isArray(i.technologies) ? i.technologies.map((t) => String(t).trim()).filter(Boolean) : [],
          evidenceText: i.evidenceText ? String(i.evidenceText).trim() : `Internship at ${i.company}`,
        }))
    : [];

  // 8. Certifications
  const certifications = Array.isArray(raw.certifications)
    ? raw.certifications
        .filter((c) => c && c.name)
        .map((c) => ({
          name: String(c.name).trim(),
          issuer: c.issuer ? String(c.issuer).trim() : null,
          date: c.date ? String(c.date).trim() : null,
          credentialUrl: c.credentialUrl ? String(c.credentialUrl).trim() : null,
          evidenceText: c.evidenceText ? String(c.evidenceText).trim() : `Certification: ${c.name}`,
        }))
    : [];

  // 9. Achievements
  const achievements = Array.isArray(raw.achievements)
    ? raw.achievements
        .filter((a) => a && a.title)
        .map((a) => ({
          title: String(a.title).trim(),
          description: a.description ? String(a.description).trim() : '',
          date: a.date ? String(a.date).trim() : null,
          evidenceText: a.evidenceText ? String(a.evidenceText).trim() : `Achievement: ${a.title}`,
        }))
    : [];

  // 10. Hackathons
  const hackathons = Array.isArray(raw.hackathons)
    ? raw.hackathons
        .filter((h) => h && h.name)
        .map((h) => ({
          name: String(h.name).trim(),
          role: h.role ? String(h.role).trim() : null,
          result: h.result ? String(h.result).trim() : null,
          date: h.date ? String(h.date).trim() : null,
          description: h.description ? String(h.description).trim() : null,
          evidenceText: h.evidenceText ? String(h.evidenceText).trim() : `Hackathon: ${h.name}`,
        }))
    : [];

  // 11. Coding Profiles
  const codingProfiles = Array.isArray(raw.codingProfiles)
    ? raw.codingProfiles
        .filter((cp) => cp && (cp.url || cp.username || cp.platform))
        .map((cp) => ({
          platform: normalizePlatform(cp.platform),
          username: cp.username ? String(cp.username).trim() : null,
          url: cp.url ? String(cp.url).trim() : null,
          evidenceText: cp.evidenceText ? String(cp.evidenceText).trim() : `Profile: ${cp.platform || ''}`,
        }))
    : [];

  // 12. Claims (Generate automatically from skills and projects if not explicitly populated)
  let claims = [];
  if (Array.isArray(raw.claims) && raw.claims.length > 0) {
    claims = raw.claims
      .filter((c) => c && c.claim)
      .map((c) => ({
        claim: String(c.claim).trim(),
        claimType: normalizeClaimType(c.claimType),
        sourceText: c.sourceText ? String(c.sourceText).trim() : String(c.claim).trim(),
        sourceSection: c.sourceSection ? String(c.sourceSection).trim() : 'General',
        relatedSkill: c.relatedSkill ? String(c.relatedSkill).trim() : null,
        verificationStatus: 'PENDING',
      }));
  }

  // Ensure every skill has a corresponding claim record
  const existingSkillClaims = new Set(claims.map((c) => (c.relatedSkill || c.claim).toLowerCase()));
  for (const skill of skills) {
    if (!existingSkillClaims.has(skill.name.toLowerCase())) {
      claims.push({
        claim: `Proficiency in ${skill.name}`,
        claimType: 'SKILL',
        sourceText: skill.evidenceText,
        sourceSection: 'Technical Skills',
        relatedSkill: skill.name,
        verificationStatus: 'PENDING',
      });
    }
  }

  // Ensure every project has a corresponding claim record
  for (const proj of projects) {
    claims.push({
      claim: `Built project ${proj.name}`,
      claimType: 'PROJECT',
      sourceText: proj.evidenceText || `${proj.name}: ${proj.description}`,
      sourceSection: 'Projects',
      relatedSkill: proj.technologies[0] || null,
      verificationStatus: 'PENDING',
    });
  }

  return {
    candidate,
    summary,
    education,
    skills,
    projects,
    experience,
    internships,
    certifications,
    achievements,
    hackathons,
    codingProfiles,
    claims,
  };
};

module.exports = {
  normalizeResumeData,
  normalizeCategory,
  normalizePlatform,
  normalizeConfidence,
  normalizeClaimType,
};
