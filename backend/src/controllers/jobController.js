const aiService = require('../services/ai/aiService');

const targetRolesList = [
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    category: 'Full Stack Engineering',
    description: 'Builds end-to-end web applications, designing responsive client interfaces, REST/GraphQL APIs, database schemas, and cloud deployment pipelines.',
    currentMatch: 74,
    requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Docker', 'AWS', 'Git', 'Testing (Jest)', 'System Design'],
    dsaExpectation: 'Intermediate (Arrays, Strings, Trees, Graphs, DP)',
    avgSalary: '₹10 - 22 LPA',
    demand: 'High',
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Client Engineering',
    description: 'Specializes in performant web interfaces, state management, UI component systems, and browser optimization.',
    currentMatch: 88,
    requiredSkills: ['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5/CSS3', 'REST APIs', 'Performance Optimization', 'Git'],
    dsaExpectation: 'Foundational (Arrays, Strings, HashMaps)',
    avgSalary: '₹8 - 18 LPA',
    demand: 'High',
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Server Engineering',
    description: 'Architects scalable microservices, relational and NoSQL databases, caching systems, and high-throughput APIs.',
    currentMatch: 81,
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'REST/gRPC', 'System Design'],
    dsaExpectation: 'High (Trees, Graphs, DP, Complexity Analysis)',
    avgSalary: '₹10 - 24 LPA',
    demand: 'High',
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer (Generalist)',
    category: 'Core Engineering',
    description: 'Solves core algorithmic and system problems, writing clean modular code across enterprise systems.',
    currentMatch: 76,
    requiredSkills: ['Data Structures & Algorithms', 'C++ / Java / Python', 'OOP & Design Patterns', 'Git', 'Databases', 'Testing'],
    dsaExpectation: 'High (400+ LeetCode problems, Contest rating > 1500)',
    avgSalary: '₹12 - 28 LPA',
    demand: 'Very High',
  },
  {
    id: 'devops-engineer',
    title: 'DevOps & Cloud Engineer',
    category: 'Infrastructure',
    description: 'Automates CI/CD delivery pipelines, manages Kubernetes clusters, and monitors cloud infrastructure.',
    currentMatch: 42,
    requiredSkills: ['Docker', 'Kubernetes', 'AWS/GCP', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Prometheus/Grafana'],
    dsaExpectation: 'Foundational (Scripting, HashTables, Strings)',
    avgSalary: '₹10 - 25 LPA',
    demand: 'High',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data Science',
    description: 'Extracts actionable insights from unstructured datasets using statistical modeling and machine learning algorithms.',
    currentMatch: 48,
    requiredSkills: ['Python', 'SQL', 'Pandas/NumPy', 'Scikit-Learn', 'Statistics', 'Data Visualization', 'Machine Learning'],
    dsaExpectation: 'Medium (Algorithms, Math, Optimization)',
    avgSalary: '₹9 - 22 LPA',
    demand: 'High',
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'AI & ML',
    description: 'Designs, trains, and deploys scalable machine learning and deep learning models into production environments.',
    currentMatch: 44,
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'MLOps', 'Docker', 'API Deployment', 'Mathematics & Linear Algebra'],
    dsaExpectation: 'High (Graph algorithms, Optimization)',
    avgSalary: '₹12 - 30 LPA',
    demand: 'High',
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    description: 'Designs intuitive user journeys, wireframes, high-fidelity prototypes, and cohesive design systems.',
    currentMatch: 65,
    requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Responsive Design', 'Usability Testing'],
    dsaExpectation: 'None',
    avgSalary: '₹7 - 16 LPA',
    demand: 'Moderate',
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    description: 'Monitors, protects, and audits enterprise networks, web applications, and identity systems against vulnerabilities.',
    currentMatch: 52,
    requiredSkills: ['Network Security', 'OWASP Top 10', 'Penetration Testing', 'JWT & OAuth2 Security', 'SIEM Tools', 'Linux'],
    dsaExpectation: 'Foundational',
    avgSalary: '₹8 - 20 LPA',
    demand: 'High',
  }
];

const getJobRoles = async (req, res, next) => {
  try {
    res.json({
      success: true,
      roles: targetRolesList,
    });
  } catch (error) {
    next(error);
  }
};

const analyzeJobMatch = async (req, res, next) => {
  try {
    const { roleId, jobDescription } = req.body;
    
    const analysis = await aiService.analyzeJobDescription(jobDescription);

    res.json({
      success: true,
      roleId: roleId || 'full-stack-developer',
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobRoles,
  analyzeJobMatch,
};
