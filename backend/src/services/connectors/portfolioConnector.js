/**
 * Portfolio Connector Abstraction & Mock Service
 */
class PortfolioConnector {
  async fetchUserData(portfolioUrl) {
    return {
      url: portfolioUrl || 'https://alexkumar.dev',
      isAccessible: true,
      lastUpdated: '2026-03-15',
      pagesDetected: ['Home', 'Projects', 'Case Studies', 'Blog', 'Contact'],
      projectsDemonstrated: [
        {
          name: 'MediRoute Telehealth',
          hasLiveDemo: true,
          demoUrl: 'https://mediroute.example.com',
          githubUrl: 'https://github.com/alexkumar-dev/mediroute-telehealth',
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
          caseStudyQuality: 'Comprehensive with architecture diagram'
        },
        {
          name: 'Expense Tracker Pro',
          hasLiveDemo: true,
          demoUrl: 'https://expense-tracker.example.com',
          githubUrl: 'https://github.com/alexkumar-dev/expense-tracker-pro',
          technologies: ['React', 'Chart.js', 'Node.js'],
          caseStudyQuality: 'Moderate'
        }
      ],
      technologiesIdentified: ['React', 'Tailwind CSS', 'JavaScript', 'Node.js', 'Vite', 'HTML5', 'CSS3']
    };
  }
}

module.exports = new PortfolioConnector();
