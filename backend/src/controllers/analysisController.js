const githubConnector = require('../services/connectors/githubConnector');
const leetcodeConnector = require('../services/connectors/leetcodeConnector');
const linkedinConnector = require('../services/connectors/linkedinConnector');
const scoringEngine = require('../services/scoring/scoringEngine');

const getAnalysisSummary = async (req, res, next) => {
  try {
    const githubData = await githubConnector.fetchUserData('alexkumar-dev');
    const leetcodeData = await leetcodeConnector.fetchUserData('alex_code');
    const linkedinData = await linkedinConnector.fetchUserData('alex-kumar-engineer');

    const analysis = scoringEngine.calculateScore({
      evidenceList: [
        { finalStatus: 'VERIFIED' }, { finalStatus: 'VERIFIED' }, { finalStatus: 'VERIFIED' },
        { finalStatus: 'VERIFIED' }, { finalStatus: 'VERIFIED' }, { finalStatus: 'PARTIALLY_VERIFIED' }
      ],
      githubData,
      leetcodeData,
      linkedinData,
    });

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

const getSkillGaps = async (req, res, next) => {
  try {
    const skillGaps = {
      criticalGaps: [
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
      ],
      moderateGaps: [
        {
          skill: 'High-Concurrency Caching (Redis)',
          category: 'System Design & Performance',
          penalty: -2.5,
          whyItMatters: 'Critical for optimizing database queries and handling heavy traffic in scalable web applications.',
          currentEvidence: 'Direct MongoDB queries on every request with no cache layer.',
          expectedEvidence: 'Redis integration for caching frequent read queries and rate-limiting.',
          recommendedAction: 'Implement Redis caching layer for telemedicine appointment slots search.'
        },
        {
          skill: 'Formal System Architecture Docs',
          category: 'Engineering Communication',
          penalty: -1.5,
          whyItMatters: 'Demonstrates senior architectural thinking and clear communication for cross-functional engineering teams.',
          currentEvidence: 'Basic README files with install instructions only.',
          expectedEvidence: 'Sequence diagrams, API endpoint specifications (Swagger/Postman), and data flow charts.',
          recommendedAction: 'Add architecture diagrams and Open API 3.0 specs to MediRoute repository.'
        }
      ],
      minorGaps: [
        {
          skill: 'CI/CD Pipeline Automation',
          category: 'DevOps',
          penalty: -1.0,
          whyItMatters: 'Automates testing, linting, and build verification on every pull request.',
          currentEvidence: 'Manual deployments without GitHub Actions workflow badges.',
          expectedEvidence: '.github/workflows/ci.yml running tests on push.',
          recommendedAction: 'Set up GitHub Actions to automatically run linter and test suites on push.'
        }
      ]
    };

    res.json({
      success: true,
      skillGaps,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalysisSummary,
  getSkillGaps,
};
