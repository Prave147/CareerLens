/**
 * LinkedIn Connector Abstraction & Mock Service
 */
class LinkedinConnector {
  async fetchUserData(profileHandle) {
    return {
      handle: profileHandle || 'alex-kumar-engineer',
      headline: 'Full Stack Engineer | B.Tech Computer Science | React, Node.js, Distributed Systems',
      connections: '500+',
      education: [
        {
          degree: 'B.Tech in Computer Science and Engineering',
          institution: 'Apex Institute of Technology',
          year: '2022 - 2026',
          grade: '8.8 CGPA'
        }
      ],
      internships: [
        {
          role: 'Full Stack Development Intern',
          company: 'Nexus HealthTech Labs',
          duration: 'May 2025 - Jul 2025 (3 mos)',
          description: 'Built automated appointment booking workflows using React and Express. Reduced latency by 24%.',
          skills: ['React', 'Node.js', 'REST APIs', 'MongoDB']
        },
        {
          role: 'Software Engineering Intern',
          company: 'CloudMatrix Solutions',
          duration: 'Dec 2024 - Feb 2025 (3 mos)',
          description: 'Designed microservice endpoints and automated database indexing for client telemetry dashboards.',
          skills: ['Node.js', 'Express', 'Git', 'Postman']
        }
      ],
      skillsClaimed: [
        'React', 'Node.js', 'JavaScript', 'Python', 'AWS', 'MongoDB', 'Express.js', 'Git', 'Data Structures'
      ],
      certifications: [
        {
          title: 'Meta Front-End Developer Specialization',
          issuer: 'Coursera / Meta',
          date: '2024'
        },
        {
          title: 'Postman API Fundamentals Student Expert',
          issuer: 'Postman',
          date: '2024'
        }
      ],
      projectsListed: 4
    };
  }
}

module.exports = new LinkedinConnector();
