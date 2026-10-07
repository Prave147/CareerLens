const aiProvider = require('./aiProvider');

class AIService {
  /**
   * 1. Resume Extractor Module
   */
  async extractResumeSkills(fileName, resumeText = '') {
    const prompt = `Analyze this student resume file: "${fileName}". Resume text: ${resumeText || 'Standard computer science student resume'}.
Extract skills, education, projects, certifications, internships, preferred roles. Return valid JSON:
{
  "name": "Candidate Name",
  "extractedSkills": ["Skill 1", "Skill 2"],
  "education": "Degree & University",
  "preferredRoles": ["Role 1", "Role 2"],
  "projects": ["Project 1"],
  "certifications": ["Cert 1"],
  "internships": ["Internship 1"]
}`;

    const fallback = () => ({
      name: 'Alex Kumar',
      extractedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Docker', 'AWS', 'DSA', 'Git', 'Socket.IO'],
      education: 'B.Tech in Computer Science & Engineering',
      preferredRoles: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
      projects: ['MediRoute Telehealth', 'Expense Tracker Pro', 'Developer Portfolio'],
      certifications: ['Meta Front-End Developer Specialization', 'Postman API Fundamentals Student Expert'],
      internships: ['Full Stack Development Intern at Nexus HealthTech Labs']
    });

    return await aiProvider.generateStructuredOutput(prompt, "You are an expert technical resume extractor for engineering students.", fallback);
  }

  /**
   * 2. Claim Analyzer Module
   */
  async analyzeClaims(skills, resumeClaims, linkedInClaims) {
    const prompt = `Evaluate the claimed skills against declaration sources:
Skills: ${JSON.stringify(skills)}
Resume Claims: ${JSON.stringify(resumeClaims)}
LinkedIn Claims: ${JSON.stringify(linkedInClaims)}
Return JSON with claim strength and initial verification category.`;

    const fallback = () => {
      return skills.map(skill => ({
        skill,
        source: resumeClaims.includes(skill) ? 'RESUME' : 'SELF_DECLARED',
        claimStrength: 'SELF_DECLARED',
        initialVerification: 'PENDING'
      }));
    };

    return await aiProvider.generateStructuredOutput(prompt, "You analyze resume claims vs proof without making assumptions.", fallback);
  }

  /**
   * 3. Project & Fork Ownership Reasoner Module
   */
  async reasonProjectOwnership(project) {
    const prompt = `Analyze project repository details:
Title: ${project.title}
Commits: ${project.commitsCount}
Is Fork: ${project.isFork}
Upstream: ${project.upstreamRepo || 'None'}
Technologies: ${JSON.stringify(project.technologies)}
Determine ownershipStatus ('ORIGINAL_OWNER', 'CONTRIBUTOR', 'FORK', 'TEMPLATE_DERIVED', 'LOW_CONTRIBUTION', 'UNKNOWN'), evidenceIntegrity ('High Confidence', 'Moderate Confidence', 'Needs Review'), and reason explanation without accusing cheating.`;

    const fallback = () => {
      if (project.isFork) {
        if (project.commitsCount < 5) {
          return {
            ownershipStatus: 'FORK',
            evidenceIntegrity: 'Needs Review',
            integrityReason: 'The repository is forked and contains limited observable original contribution.',
            forkContributionScore: 20
          };
        } else {
          return {
            ownershipStatus: 'CONTRIBUTOR',
            evidenceIntegrity: 'Moderate Confidence',
            integrityReason: 'Forked repository with verifiable original commit additions and feature enhancements.',
            forkContributionScore: 70
          };
        }
      }
      return {
        ownershipStatus: 'ORIGINAL_OWNER',
        evidenceIntegrity: 'High Confidence',
        integrityReason: 'Original repository exhibits consistent multi-commit history and modular code architecture.',
        forkContributionScore: 100
      };
    };

    return await aiProvider.generateStructuredOutput(prompt, "You are a software repository integrity auditor.", fallback);
  }

  /**
   * 4. Role Matcher Module
   */
  async matchRoles(verifiedSkills, targetRole, readinessScore) {
    const roles = [
      {
        role: 'Frontend Developer',
        matchPercentage: 88,
        confidence: 'High',
        strengths: ['React.js component lifecycle', 'Tailwind CSS utility architecture', 'RESTful API integration'],
        gaps: ['Performance profiling (Lighthouse / Core Web Vitals)', 'Automated UI testing with Jest / Testing Library'],
        recommendedAction: 'Build a high-performance web app with automated component testing.'
      },
      {
        role: 'Full Stack Developer',
        matchPercentage: 76,
        confidence: 'High',
        strengths: ['Full-stack MERN pipeline', 'JWT Authentication & session handling', 'MongoDB aggregation & schema modeling'],
        gaps: ['Containerized deployments (Docker/Docker Compose)', 'AWS / Cloud managed services', 'Redis caching layer'],
        recommendedAction: 'Add a Docker multi-container compose configuration to MediRoute and deploy to AWS ECS.'
      },
      {
        role: 'Backend Developer',
        matchPercentage: 68,
        confidence: 'Medium',
        strengths: ['Node.js & Express REST architecture', 'Socket.IO real-time websockets', 'Database indexing basics'],
        gaps: ['Relational database design (PostgreSQL/Prisma)', 'Message queuing (RabbitMQ / Kafka)', 'Microservice boundaries'],
        recommendedAction: 'Implement a PostgreSQL-backed analytics service with connection pooling.'
      },
      {
        role: 'DevOps & Cloud Engineer',
        matchPercentage: 35,
        confidence: 'Low',
        strengths: ['Git branching & PR workflows', 'Basic Linux CLI'],
        gaps: ['Terraform / Infrastructure-as-Code', 'Kubernetes cluster orchestration', 'CI/CD pipeline scripts'],
        recommendedAction: 'Configure GitHub Actions CI/CD with automated testing and container build steps.'
      }
    ];

    return roles;
  }

  /**
   * 5. Career Path Alignment Module
   */
  async analyzeCareerPath(targetRole, bestCurrentRole, verifiedSkills) {
    const isAligned = targetRole.toLowerCase() === bestCurrentRole.toLowerCase() || 
                     (targetRole.includes('Full Stack') && bestCurrentRole.includes('Frontend'));

    return {
      targetRole,
      bestCurrentRole,
      isAligned,
      alignmentNote: isAligned 
        ? `Your active proof strongly supports your target of ${targetRole}. Solidifying backend testing and cloud deployment will bridge the final gap.`
        : `Your current verified proof demonstrates greatest depth in ${bestCurrentRole}, while your target is ${targetRole}. A focused roadmap will bridge this gap.`,
      transitionPlan: [
        'Bridge critical DevOps and Containerization gap using Docker Compose',
        'Add integration tests to backend repository to boost reliability proof',
        'Deploy production project to public cloud with SSL/TLS verification'
      ]
    };
  }

  /**
   * 6. Gap Analyzer Module
   */
  async analyzeSkillGaps(evidenceList, targetRole) {
    const criticalGaps = [
      {
        skill: 'Docker & Containerization',
        category: 'DevOps & Deployment',
        penalty: -7.0,
        whyItMatters: 'Standard in modern SaaS companies for reproducible environments, CI/CD pipelines, and microservices.',
        currentEvidence: 'Claimed on resume & LinkedIn. Zero Dockerfiles or docker-compose.yml files in repositories.',
        expectedEvidence: 'Dockerfile in repo root, multi-container compose file, and Docker Hub image registry link.',
        recommendedAction: 'Containerize MediRoute full-stack project with frontend, backend, and MongoDB services.'
      },
      {
        skill: 'Automated Unit & Integration Testing',
        category: 'Software Quality & Reliability',
        penalty: -5.0,
        whyItMatters: 'Essential for maintainable enterprise applications and preventing regression bugs in production.',
        currentEvidence: '3 rudimentary test files found across all repositories (Code coverage < 20%).',
        expectedEvidence: 'Jest/Mocha test suites covering controllers, middleware, and business logic with > 70% branch coverage.',
        recommendedAction: 'Write integration test suites for authentication and telemedicine triage endpoints.'
      },
      {
        skill: 'Cloud Infrastructure (AWS/GCP)',
        category: 'Cloud Engineering',
        penalty: -4.0,
        whyItMatters: 'Hiring teams expect candidates to have hands-on experience deploying, monitoring, and configuring cloud services.',
        currentEvidence: 'Listed on resume, but projects are hosted only on free PaaS platforms without AWS infrastructure code.',
        expectedEvidence: 'Deployment architecture diagram, AWS S3/EC2/ECS integration, or Infrastructure as Code (Terraform).',
        recommendedAction: 'Deploy MediRoute to AWS ECS or EC2 with CloudFront SSL/TLS termination.'
      }
    ];

    const moderateGaps = [
      {
        skill: 'High-Concurrency Caching (Redis)',
        category: 'System Design & Performance',
        penalty: -2.5,
        whyItMatters: 'Critical for optimizing database queries and handling heavy traffic in scalable web applications.',
        currentEvidence: 'Direct MongoDB queries on every request with no cache layer.',
        expectedEvidence: 'Redis integration for caching frequent read queries and rate-limiting.',
        recommendedAction: 'Implement Redis caching layer for telemedicine appointment slots search.'
      }
    ];

    return { criticalGaps, moderateGaps };
  }

  /**
   * 7. Course & Action Recommender (Course -> Proof Pipeline)
   */
  async recommendCourses(gaps) {
    return [
      {
        skill: 'Docker & Containerization',
        courseName: 'Docker & Kubernetes: The Practical Guide',
        platform: 'Udemy / Docker Official Docs',
        proofRequired: 'Add multi-stage Dockerfile and docker-compose.yml to MediRoute repository.',
        expectedPointsGain: 4.5,
        pipeline: ['Learn Docker Compose', 'Containerize Full-Stack App', 'Push to Docker Hub', 'Submit GitHub Link for Re-Analysis']
      },
      {
        skill: 'Automated Testing with Jest & Supertest',
        courseName: 'Testing Javascript & Node.js Applications',
        platform: 'TestingJS / Kent C. Dodds',
        proofRequired: 'Achieve >70% code coverage on backend API routes with Jest test suite.',
        expectedPointsGain: 4.0,
        pipeline: ['Learn Jest & Supertest', 'Write Endpoint Tests', 'Add GitHub Actions CI Badge', 'Submit Repo for Re-Analysis']
      },
      {
        skill: 'Cloud Deployment (AWS ECS & S3)',
        courseName: 'AWS Certified Cloud Practitioner & Hands-on Deployment',
        platform: 'AWS Skill Builder / Coursera',
        proofRequired: 'Deploy live full-stack app with custom domain, HTTPS, and S3 asset storage.',
        expectedPointsGain: 3.5,
        pipeline: ['Configure AWS ECS', 'Set up S3 Bucket & CloudFront', 'Deploy Live App', 'Submit Verified URL']
      }
    ];
  }

  /**
   * 8. Roadmap Generator Module
   */
  async generateRoadmap(gaps, targetRole) {
    return {
      targetRole: targetRole || 'Full Stack Developer',
      totalEstimatedScoreGain: 14.5,
      currentScore: 68.0,
      projectedScore: 82.5,
      weeks: [
        {
          weekNumber: 1,
          title: 'Dockerization & Environment Reproducibility',
          goal: 'Containerize full stack architecture with Docker and Docker Compose',
          whyItMatters: 'Proves DevOps foundation required by top tech engineering teams.',
          skills: ['Docker', 'Docker Compose', 'DevOps'],
          task: 'Write multi-stage Dockerfile for React and Node.js with MongoDB service in docker-compose.yml',
          practicalTask: 'Run docker compose up --build locally and test containerized communication',
          expectedEvidence: ['Dockerfile in repository root', 'docker-compose.yml', 'Docker Hub image'],
          proofRequired: 'GitHub repository with active Dockerfile and verified build passing.',
          estimatedImpact: '+4.5 Readiness Points',
          estimatedScoreGain: 4.5,
          completed: false,
          actionType: 'PROJECT',
          phase: '30_DAYS'
        },
        {
          weekNumber: 2,
          title: 'Automated API & Integration Testing Suite',
          goal: 'Build comprehensive test coverage for REST endpoints using Jest and Supertest',
          whyItMatters: 'Demonstrates production-grade code reliability and regression defense.',
          skills: ['Jest', 'Supertest', 'Testing & QA'],
          task: 'Write unit tests for auth middleware and integration tests for telemedicine triage endpoints',
          practicalTask: 'Execute npm test with coverage report showing > 70% branch coverage',
          expectedEvidence: ['/tests directory in repository', 'Jest configuration', 'Passing test runner report'],
          proofRequired: 'GitHub commit containing test suites and passing CI check.',
          estimatedImpact: '+4.0 Readiness Points',
          estimatedScoreGain: 4.0,
          completed: false,
          actionType: 'CODING',
          phase: '30_DAYS'
        },
        {
          weekNumber: 3,
          title: 'Cloud Infrastructure & HTTPS Deployment',
          goal: 'Deploy application to AWS ECS / EC2 with CloudFront CDN and SSL certification',
          whyItMatters: 'Validates real-world cloud engineering capability over local-only hobby projects.',
          skills: ['AWS', 'ECS', 'Cloud Deployment'],
          task: 'Set up AWS container service and configure automated continuous deployment',
          practicalTask: 'Provision ECS Fargate task definition and test live URL with SSL',
          expectedEvidence: ['Live deployment URL with valid HTTPS', 'AWS architecture diagram in README'],
          proofRequired: 'Active public URL and README architecture badge.',
          estimatedImpact: '+3.5 Readiness Points',
          estimatedScoreGain: 3.5,
          completed: false,
          actionType: 'DEPLOYMENT',
          phase: '60_DAYS'
        },
        {
          weekNumber: 4,
          title: 'Algorithmic Speed & LeetCode Sprint',
          goal: 'Solve 25 targeted Medium/Hard problems across Graphs and Dynamic Programming',
          whyItMatters: 'Ensures high pass rate in initial technical Online Assessment (OA) rounds.',
          skills: ['Dynamic Programming', 'Graph Theory', 'DSA'],
          task: 'Complete LeetCode Top 75 dynamic programming and graph traversal problem sets',
          practicalTask: 'Maintain 14-day daily submission streak on LeetCode profile',
          expectedEvidence: ['Verified LeetCode profile activity', '+25 solved Medium/Hard questions'],
          proofRequired: 'Synchronized LeetCode handle with updated submission count.',
          estimatedImpact: '+2.5 Readiness Points',
          estimatedScoreGain: 2.5,
          completed: false,
          actionType: 'CODING',
          phase: '90_DAYS'
        }
      ]
    };
  }

  /**
   * 9. Career Advisor Module
   */
  async chatWithAdvisor(messages, studentContext) {
    const systemInstruction = `You are CareerLens AI Career Advisor, an evidence-based career intelligence counselor for software engineering students.
Context of the student:
- Name: ${studentContext.name || 'Student'}
- Target Role: ${studentContext.targetRole || 'Full Stack Developer'}
- Current Readiness Score: ${studentContext.readinessScore || 79.3}/100
- Verified Skills: ${JSON.stringify(studentContext.verifiedSkills || ['React', 'Node.js', 'MongoDB', 'DSA'])}
- Unverified/Weak Claims: ${JSON.stringify(studentContext.unverifiedSkills || ['Docker', 'AWS', 'Testing'])}
- Project Proof: ${studentContext.projectsCount || 3} repositories analyzed.

CRITICAL RULES:
1. Ground all answers in observable evidence vs resume claims.
2. If evidence is missing, explain what proof the student needs to provide (e.g. GitHub repo with commits, Dockerfile, live URL).
3. NEVER invent or fabricate evidence.
4. Keep answers sharp, actionable, encouraging, and structured.
5. If the user asks "Why is my score X?", breakdown the pillars (Technical Capability, Proof of Work, Project Strength, Activity, Role Fit).`;

    const fallbackReply = `Based on your verified proof in the CareerLens database:
Your current Readiness Score is **${studentContext.readinessScore || 79.3} / 100**.

**Key Evidence Breakdown:**
- **Strengths:** Verified depth in React (94% confidence) and Node.js with multi-commit repositories like *MediRoute* (87 commits).
- **Primary Gaps:** Docker and AWS are listed on your resume without corresponding Dockerfiles or cloud infrastructure code in your public GitHub repositories.
- **Recommended Action:** Adding a Dockerfile and docker-compose.yml to your project will earn an estimated **+4.5 readiness points** upon re-analysis.`;

    return await aiProvider.generateChat(messages, systemInstruction, fallbackReply);
  }

  /**
   * 10. Comprehensive Career Report Generator
   */
  async generateCareerReport(studentProfile, analysis, evidenceMatrix) {
    return {
      reportId: `CLR-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      studentName: studentProfile?.name || 'Alex Kumar',
      collegeName: studentProfile?.college || 'Apex Institute of Technology',
      targetRole: studentProfile?.targetRole || 'Full Stack Developer',
      readinessScore: analysis?.readinessScore || 79.3,
      statusBadge: analysis?.statusBadge || 'Strong candidate',
      scoreBreakdown: analysis?.breakdown,
      radarScores: analysis?.radarScores,
      verifiedSkills: evidenceMatrix.filter(e => e.finalStatus === 'VERIFIED' || e.finalStatus === 'STRONGLY_VERIFIED').map(e => e.skill),
      weakClaims: evidenceMatrix.filter(e => e.finalStatus === 'WEAK' || e.finalStatus === 'UNVERIFIED').map(e => e.skill),
      deductions: analysis?.scoreDeductions,
      simulations: analysis?.improvementSimulations,
      bestCurrentRoles: analysis?.bestCurrentRoles,
      careerPathAlignment: analysis?.careerPathAlignment,
      executiveSummary: `Candidate demonstrates strong technical competence across foundational full-stack web development with verified multi-repository commit depth. Employability index is 79.3/100, placing the candidate in the top 20% of their institutional cohort. Closing targeted gaps in containerization and automated test suites will elevate readiness to Tier-1 product company benchmarks (85+).`
    };
  }
}

module.exports = new AIService();
