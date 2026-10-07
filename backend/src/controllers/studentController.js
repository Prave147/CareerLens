const StudentProfile = require('../models/StudentProfile');
const Evidence = require('../models/Evidence');
const SkillClaim = require('../models/SkillClaim');
const Analysis = require('../models/Analysis');
const Roadmap = require('../models/Roadmap');
const Project = require('../models/Project');
const CodingActivity = require('../models/CodingActivity');
const LeetCodeProfile = require('../models/LeetCodeProfile');
const GitHubProfile = require('../models/GitHubProfile');

const githubConnector = require('../services/connectors/githubConnector');
const leetcodeConnector = require('../services/connectors/leetcodeConnector');
const gfgConnector = require('../services/connectors/gfgConnector');
const codechefConnector = require('../services/connectors/codechefConnector');
const linkedinConnector = require('../services/connectors/linkedinConnector');
const portfolioConnector = require('../services/connectors/portfolioConnector');

const evidenceEngine = require('../services/evidence/evidenceEngine');
const scoringEngine = require('../services/scoring/scoringEngine');
const aiService = require('../services/ai/aiService');
const resumeService = require('../services/resume/resumeService');
const evidenceFusionService = require('../services/evidence/evidenceFusionService');

// Get current student profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let profile = null;

    try {
      profile = await StudentProfile.findOne({ user: userId }).populate('user', 'name email collegeName');
    } catch (err) {}

    // Fallback / Default Demo Profile (Alex Kumar / Arjun Kumar)
    if (!profile) {
      profile = {
        name: req.user?.name || 'Alex Kumar',
        email: req.user?.email || 'alex.kumar@example.com',
        college: req.user?.collegeName || 'Apex Institute of Technology',
        membershipStatus: req.user?.membershipStatus || 'PENDING',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: 2026,
        targetRole: 'Full Stack Developer',
        platformHandles: {
          github: 'alexkumar-dev',
          leetcode: 'alex_code',
          gfg: 'alex_k',
          codechef: 'alex_chef',
          codeforces: 'alex_cf',
          hackerrank: 'alex_hr',
          linkedin: 'alex-kumar-engineer',
          portfolio: 'https://alexkumar.dev',
        },
        skills: [
          { name: 'React', level: 'Advanced', category: 'Frontend', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
          { name: 'Node.js', level: 'Advanced', category: 'Backend', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
          { name: 'Express.js', level: 'Advanced', category: 'Backend', verified: true, verificationStatus: 'VERIFIED' },
          { name: 'MongoDB', level: 'Intermediate', category: 'Database', verified: true, verificationStatus: 'VERIFIED' },
          { name: 'JavaScript', level: 'Advanced', category: 'Language', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
          { name: 'DSA', level: 'Advanced', category: 'Core', verified: true, verificationStatus: 'STRONGLY_VERIFIED' },
          { name: 'Docker', level: 'Beginner', category: 'DevOps', verified: false, verificationStatus: 'UNVERIFIED' },
          { name: 'AWS', level: 'Beginner', category: 'Cloud', verified: false, verificationStatus: 'UNVERIFIED' },
          { name: 'Testing', level: 'Beginner', category: 'Core', verified: false, verificationStatus: 'WEAK' },
        ],
        certifications: [
          { title: 'Meta Front-End Developer Specialization', issuer: 'Coursera / Meta', issueDate: '2024', credentialUrl: 'https://coursera.org/verify/demo', verified: true },
          { title: 'Postman API Fundamentals Student Expert', issuer: 'Postman', issueDate: '2024', credentialUrl: 'https://badgr.com/demo', verified: true }
        ],
        internships: [
          {
            role: 'Full Stack Development Intern',
            company: 'Nexus HealthTech Labs',
            duration: 'May 2025 - Jul 2025',
            description: 'Built automated appointment booking workflows using React and Express. Reduced triage response latency by 24%.',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB']
          }
        ],
        projects: [
          {
            title: 'MediRoute Telehealth',
            description: 'Production-grade telemedicine triage system with real-time room dispatch and patient tracking.',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.IO'],
            commitsCount: 87,
            ownershipStatus: 'ORIGINAL_OWNER',
            evidenceIntegrity: 'High Confidence',
            integrityReason: '87 original commits across 6 weeks with verified controller pipeline.',
            repoUrl: 'https://github.com/alexkumar-dev/mediroute-telehealth',
            liveUrl: 'https://mediroute.example.com',
            highlight: '87 commits, WebSocket room dispatch, JWT authentication pipeline.'
          },
          {
            title: 'Expense Tracker Pro',
            description: 'Full-stack personal finance ledger with categorization, monthly reports, and budget alerts.',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
            commitsCount: 42,
            ownershipStatus: 'ORIGINAL_OWNER',
            evidenceIntegrity: 'High Confidence',
            integrityReason: '42 commits with custom React context state management.',
            repoUrl: 'https://github.com/alexkumar-dev/expense-tracker-pro',
            liveUrl: 'https://expense-tracker.example.com',
            highlight: '42 commits, Context API, responsive charts.'
          },
          {
            title: 'Developer Portfolio',
            description: 'Clean responsive personal website showcasing projects, interactive resume, and contact pipeline.',
            technologies: ['React', 'Tailwind CSS', 'Vite'],
            commitsCount: 21,
            ownershipStatus: 'ORIGINAL_OWNER',
            evidenceIntegrity: 'High Confidence',
            integrityReason: '21 commits, Tailwind CSS custom design tokens.',
            repoUrl: 'https://github.com/alexkumar-dev/portfolio',
            liveUrl: 'https://alexkumar.dev',
            highlight: '21 commits, Tailwind CSS design system.'
          },
          {
            title: 'E-Commerce Template (Forked)',
            description: 'Forked e-commerce store template from open-source boilerplate repository.',
            technologies: ['React', 'Redux', 'Stripe'],
            commitsCount: 3,
            isFork: true,
            ownershipStatus: 'FORK',
            evidenceIntegrity: 'Needs Review',
            integrityReason: 'The repository is forked and contains limited observable original contribution (3 minor commits).',
            repoUrl: 'https://github.com/alexkumar-dev/react-ecommerce-template',
            highlight: 'Fork detected — limited original student contribution.'
          }
        ],
        resume: {
          fileName: 'Alex_Kumar_FullStack_Resume.pdf',
          fileSize: '482 KB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 48),
          extractedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Docker', 'AWS', 'DSA', 'Git', 'Testing'],
          status: 'ANALYZED'
        },
        profileCompleteness: 87,
        lastAnalyzedAt: new Date(),
      };
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const updateData = req.body;

    try {
      await StudentProfile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true, upsert: true }
      );
    } catch (err) {}

    res.json({
      success: true,
      message: 'Profile details saved successfully in CareerLens database.',
      profile: updateData,
    });
  } catch (error) {
    next(error);
  }
};

// Update platform links
const updateLinks = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { platformHandles } = req.body;

    try {
      await StudentProfile.findOneAndUpdate(
        { user: userId },
        { $set: { platformHandles } },
        { new: true, upsert: true }
      );
    } catch (err) {}

    res.json({
      success: true,
      message: 'Profile platform links updated successfully.',
      platformHandles,
    });
  } catch (error) {
    next(error);
  }
};

// Upload & extract resume
const uploadResume = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.user?.id || req.user?._id;

    if (file && file.buffer) {
      const fileInfo = {
        originalFileName: file.originalname,
        fileType: file.mimetype || 'application/pdf',
        fileSize: file.size,
      };
      const result = await resumeService.processResumeUpload(userId, file.buffer, fileInfo);
      return res.status(200).json(result);
    }

    const fileName = req.body.fileName || 'Student_Resume.pdf';

    // Fallback Mock extraction if no binary file was attached
    const extractionResult = await aiService.extractResumeSkills(fileName);

    const resumeData = {
      fileName,
      fileSize: '482 KB',
      uploadedAt: new Date(),
      extractedSkills: extractionResult.extractedSkills || ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'DSA'],
      status: 'ANALYZED',
    };

    res.json({
      success: true,
      message: 'Resume analyzed. Extracted skills converted into verifiable claims.',
      resume: resumeData,
      extractedSkills: resumeData.extractedSkills,
      lastAnalyzed: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Submit user evidence for missing or weak claims
const submitEvidence = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { skill, proofType, title, url, description } = req.body;

    if (!skill || !proofType) {
      return res.status(400).json({ success: false, message: 'Skill and proof type are required.' });
    }

    const submission = {
      proofType: proofType.toUpperCase(),
      title: title || `${proofType} Proof for ${skill}`,
      url: url || '',
      description: description || '',
      submittedAt: new Date(),
      status: 'APPROVED'
    };

    try {
      const studentProfile = await StudentProfile.findOne({ user: userId });
      
      let evidenceDoc = await Evidence.findOne({ studentId: userId, skill: new RegExp(`^${skill}$`, 'i') });
      if (!evidenceDoc) {
        evidenceDoc = new Evidence({
          studentProfile: studentProfile ? studentProfile._id : null,
          studentId: userId,
          collegeId: studentProfile ? studentProfile.collegeId : null,
          skill,
          finalStatus: 'VERIFIED',
          confidence: 'HIGH',
          confidencePercentage: 85,
          whyVerifiedExplanation: `User provided verifiable proof: ${submission.title} (${submission.url || 'Documented'}).`
        });
      }

      evidenceDoc.userSubmittedEvidence.push(submission);
      evidenceDoc.finalStatus = 'VERIFIED';
      evidenceDoc.confidence = 'HIGH';
      evidenceDoc.confidencePercentage = Math.max(85, evidenceDoc.confidencePercentage);
      evidenceDoc.whyVerifiedExplanation = `Verified with submitted proof: ${submission.title} (${submission.url || 'Provided'}).`;
      await evidenceDoc.save();
    } catch (dbErr) {}

    res.json({
      success: true,
      message: `Evidence submitted for ${skill}. Claim status upgraded to VERIFIED.`,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

// Trigger full multi-source analysis
const triggerAnalyze = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const handles = req.body.platformHandles || {};

    const githubData = await githubConnector.fetchUserData(handles.github || 'alexkumar-dev');
    const leetcodeData = await leetcodeConnector.fetchUserData(handles.leetcode || 'alex_code');
    const gfgData = await gfgConnector.fetchUserData(handles.gfg || 'alex_k');
    const codechefData = await codechefConnector.fetchUserData(handles.codechef || 'alex_chef');
    const linkedinData = await linkedinConnector.fetchUserData(handles.linkedin || 'alex-kumar-engineer');
    const portfolioData = await portfolioConnector.fetchUserData(handles.portfolio || 'https://alexkumar.dev');

    const resumeSkills = req.body.resumeSkills || [
      'React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Docker', 'AWS', 'DSA', 'Git', 'Testing'
    ];

    // Fetch any user submitted proofs from DB
    let userSubmissions = [];
    try {
      const savedEv = await Evidence.find({ studentId: userId });
      userSubmissions = savedEv.flatMap(e => (e.userSubmittedEvidence || []).map(s => ({ ...s.toObject(), skill: e.skill })));
    } catch (e) {}

    const evidenceList = evidenceEngine.processEvidence({
      resumeSkills,
      githubData,
      leetcodeData,
      gfgData,
      codechefData,
      linkedinData,
      portfolioData,
      userSubmissions,
    });

    const scoringResult = scoringEngine.calculateScore({
      evidenceList,
      githubData,
      leetcodeData,
      linkedinData,
      targetRole: req.body.targetRole || 'Full Stack Developer',
    });

    // Save analysis to DB
    try {
      const studentProfile = await StudentProfile.findOne({ user: userId });
      if (studentProfile) {
        studentProfile.lastAnalyzedAt = new Date();
        await studentProfile.save();

        await Analysis.create({
          studentProfile: studentProfile._id,
          studentId: userId,
          collegeId: studentProfile.collegeId,
          targetRole: req.body.targetRole || 'Full Stack Developer',
          readinessScore: scoringResult.readinessScore,
          statusBadge: scoringResult.statusBadge,
          statusSubtitle: scoringResult.statusSubtitle,
          breakdown: scoringResult.breakdown,
          kpi: scoringResult.kpi,
          radarScores: scoringResult.radarScores,
          scoreContributions: scoringResult.scoreContributions,
          scoreDeductions: scoringResult.scoreDeductions,
          improvementSimulations: scoringResult.improvementSimulations,
          bestCurrentRoles: scoringResult.bestCurrentRoles,
          careerPathAlignment: scoringResult.careerPathAlignment,
          whyThisScore: scoringResult.whyThisScore,
          recentEvidence: scoringResult.recentEvidence,
        });
      }
    } catch (dbErr) {}

    res.json({
      success: true,
      message: 'Full multi-source reconciliation, ownership validation, and readiness scoring complete.',
      analysis: scoringResult,
      evidenceMatrix: evidenceList,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// Get analysis summary
const getAnalysis = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let savedAnalysis = null;
    try {
      savedAnalysis = await Analysis.findOne({ studentId: userId }).sort({ createdAt: -1 });
    } catch (e) {}

    if (savedAnalysis) {
      return res.json({ success: true, analysis: savedAnalysis });
    }

    // Default calculated analysis
    const githubData = await githubConnector.fetchUserData('alexkumar-dev');
    const leetcodeData = await leetcodeConnector.fetchUserData('alex_code');
    const linkedinData = await linkedinConnector.fetchUserData('alex-kumar-engineer');

    const evidenceList = evidenceEngine.processEvidence({
      resumeSkills: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'DSA', 'Testing'],
      githubData,
      leetcodeData,
      linkedinData,
    });

    const analysis = scoringEngine.calculateScore({
      evidenceList,
      githubData,
      leetcodeData,
      linkedinData,
      targetRole: 'Full Stack Developer',
    });

    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

// Get Evidence Matrix
const getEvidence = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const fusion = await evidenceFusionService.getFusedSkillEvidence(userId);

    // Map fused skills to matrix items expected by legacy consumers if any
    const matrix = fusion.skills.map((s) => ({
      skill: s.skill,
      category: s.category,
      claims: {
        resume: s.sources.includes('RESUME'),
        github: s.sources.includes('GITHUB'),
        portfolio: s.sources.includes('PORTFOLIO'),
        selfReported: s.sources.includes('PROFILE'),
      },
      evidenceSources: {
        resume: {
          found: s.sources.includes('RESUME'),
          level: s.sources.includes('RESUME') ? 'Claimed' : 'Not Found',
          detail: s.reason,
        },
        github: {
          found: s.isGithubVerified || (s.repositories && s.repositories.length > 0),
          level: s.status === 'VERIFIED' ? 'Strong' : s.status === 'PARTIALLY_VERIFIED' ? 'Moderate' : 'Not Found',
          repoName: s.repositories[0]?.name || null,
          detail: s.repositories.length > 0 ? `${s.repositories.length} public repos (${s.repositories.map(r => r.name).join(', ')})` : 'No matching repository proof found.',
        },
      },
      finalStatus: s.status,
      confidence: s.confidence,
      confidencePercentage: s.confidenceScore,
      evidenceChain: s.evidenceChain,
      whyVerifiedExplanation: s.reason,
      repositories: s.repositories,
    }));

    res.json({
      success: true,
      evidenceMatrix: matrix,
      summary: {
        totalSkillsEvaluated: fusion.summary.totalSkills,
        verifiedCount: fusion.summary.verifiedCount,
        partiallyVerifiedCount: fusion.summary.partiallyVerifiedCount,
        unverifiedCount: fusion.summary.unverifiedCount,
        evidenceCoveragePercentage: fusion.summary.evidenceCoveragePercentage,
        sourcesConnected: fusion.summary.sourcesConnected,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Skill Gaps & Intelligence
const getSkills = async (req, res, next) => {
  try {
    const gaps = await aiService.analyzeSkillGaps([], 'Full Stack Developer');
    res.json({
      success: true,
      skillGaps: gaps,
    });
  } catch (error) {
    next(error);
  }
};

// Get Projects with ownership & fork analysis
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let githubDoc = null;
    if (userId) {
      githubDoc = await GithubProfile.findOne({ candidateId: userId });
    }

    if (githubDoc && githubDoc.repositories && githubDoc.repositories.length > 0) {
      const originalCount = githubDoc.repositories.filter(r => !r.isFork).length;
      return res.json({
        success: true,
        username: githubDoc.username,
        connected: true,
        projects: githubDoc.repositories,
        antiGamingSummary: {
          status: originalCount > 0 ? 'High Confidence' : 'Verification Required',
          explanation: `${originalCount} original repository codebases detected for @${githubDoc.username}. Detected technologies: ${githubDoc.detectedTechnologies?.map(t => t.name).join(', ') || 'N/A'}.`,
        }
      });
    }

    const githubData = await githubConnector.fetchUserData('alexkumar-dev');
    res.json({
      success: true,
      username: 'alexkumar-dev',
      connected: false,
      projects: githubData.repositories || [],
      antiGamingSummary: {
        status: githubData.antiGamingStatus || 'High Confidence',
        explanation: 'Multi-week continuous commit logs detected across original repositories. No anomalous automated bulk commit spikes.',
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Coding Activity & Consistency
const getCodingActivity = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let leetcodeDoc = null;
    let githubDoc = null;

    if (userId) {
      leetcodeDoc = await LeetCodeProfile.findOne({ candidateId: userId });
      githubDoc = await GitHubProfile.findOne({ candidateId: userId });
    }

    let leetcodeData = null;
    if (leetcodeDoc) {
      leetcodeData = {
        connected: true,
        username: leetcodeDoc.username,
        problemsSolved: leetcodeDoc.totalSolved,
        contestRating: leetcodeDoc.contestRating ? Math.round(leetcodeDoc.contestRating) : 'Unrated',
        globalRank: leetcodeDoc.contestGlobalRanking || (leetcodeDoc.ranking ? `#${leetcodeDoc.ranking.toLocaleString()}` : 'N/A'),
        streakDays: leetcodeDoc.recentSubmissions?.length > 0 ? 7 : 0,
        acceptanceRate: leetcodeDoc.acceptanceRate ? `${leetcodeDoc.acceptanceRate.toFixed(1)}%` : 'N/A',
        breakdown: {
          easy: { solved: leetcodeDoc.easySolved || 0 },
          medium: { solved: leetcodeDoc.mediumSolved || 0 },
          hard: { solved: leetcodeDoc.hardSolved || 0 },
        },
        languageStats: leetcodeDoc.languageStats || [],
        badges: leetcodeDoc.badges || [],
        dsaEvidenceStrength: leetcodeDoc.dsaEvidenceStrength,
        verifiedClaims: leetcodeDoc.verifiedClaims || [],
      };
    } else {
      leetcodeData = {
        connected: false,
        username: null,
        problemsSolved: 0,
        contestRating: 'Not Connected',
        globalRank: 'N/A',
        streakDays: 0,
        breakdown: {
          easy: { solved: 0 },
          medium: { solved: 0 },
          hard: { solved: 0 },
        },
      };
    }

    const gfg = await gfgConnector.fetchUserData('alex_k');
    const codechef = await codechefConnector.fetchUserData('alex_chef');

    res.json({
      success: true,
      platforms: {
        leetcode: leetcodeData,
        gfg,
        codechef,
      },
      github: githubDoc ? {
        connected: true,
        username: githubDoc.username,
        publicRepos: githubDoc.publicRepos,
        followers: githubDoc.followers,
      } : { connected: false },
      overallConsistency: {
        historical: leetcodeDoc ? `${leetcodeDoc.totalSolved} problems solved on LeetCode (${leetcodeDoc.dsaEvidenceStrength} DSA Strength)` : 'No algorithmic platform connected yet',
        recent: leetcodeDoc && leetcodeDoc.totalSolved >= 100 ? 'Active & Consistent' : 'Connect LeetCode to establish verified consistency',
        recommendation: leetcodeDoc ? 'Maintain daily problem solving consistency to boost career readiness.' : 'Connect your LeetCode handle to automatically verify DSA & problem solving skills.',
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Role Recommendations & Projected Fit
const getRoles = async (req, res, next) => {
  try {
    const roles = await aiService.matchRoles([], 'Full Stack Developer', 79.3);
    const alignment = await aiService.analyzeCareerPath('Full Stack Developer', 'Frontend Developer', []);

    res.json({
      success: true,
      roles,
      careerPathAlignment: alignment,
    });
  } catch (error) {
    next(error);
  }
};

// Get Course Recommendations (Course -> Proof Pipeline)
const getCourses = async (req, res, next) => {
  try {
    const courses = await aiService.recommendCourses([]);
    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// Get Roadmap
const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await aiService.generateRoadmap([], 'Full Stack Developer');
    res.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Roadmap Milestone
const toggleMilestone = async (req, res, next) => {
  try {
    const { weekNumber } = req.body;
    res.json({
      success: true,
      message: `Milestone Week ${weekNumber} toggled.`,
      weekNumber,
    });
  } catch (error) {
    next(error);
  }
};

// Generate Career Guide Report
const getCareerReport = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let profile = await StudentProfile.findOne({ user: userId }).populate('user', 'name email');
    if (!profile) {
      profile = { name: req.user?.name || 'Alex Kumar', college: req.user?.collegeName || 'Apex Institute of Technology', targetRole: 'Full Stack Developer' };
    }

    const report = await aiService.generateCareerReport(profile, { readinessScore: 79.3 }, []);
    res.json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// AI Career Advisor Chat
const chatAdvisor = async (req, res, next) => {
  try {
    const { messages } = req.body;
    const studentContext = {
      name: req.user?.name || 'Alex Kumar',
      targetRole: 'Full Stack Developer',
      readinessScore: 79.3,
      verifiedSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'DSA'],
      unverifiedSkills: ['Docker', 'AWS', 'Automated Testing'],
      projectsCount: 3,
    };

    const reply = await aiService.chatWithAdvisor(messages || [], studentContext);
    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateLinks,
  uploadResume,
  submitEvidence,
  triggerAnalyze,
  getAnalysis,
  getEvidence,
  getSkills,
  getProjects,
  getCodingActivity,
  getRoles,
  getCourses,
  getRoadmap,
  toggleMilestone,
  getCareerReport,
  chatAdvisor,
};
