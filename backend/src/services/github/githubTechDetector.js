/**
 * GitHub Technology & Dependency Detector
 * Discovers frameworks, libraries, databases, and tools directly from codebases, dependency files, and language breakdown.
 */

const JS_PACKAGES_MAP = {
  'react': 'React',
  'react-dom': 'React',
  'react-native': 'React Native',
  'vue': 'Vue.js',
  '@angular/core': 'Angular',
  'svelte': 'Svelte',
  'next': 'Next.js',
  'nuxt': 'Nuxt.js',
  'vite': 'Vite',
  'express': 'Express.js',
  '@nestjs/core': 'NestJS',
  'fastify': 'Fastify',
  'koa': 'Koa',
  'socket.io': 'Socket.IO',
  'socket.io-client': 'Socket.IO',
  'graphql': 'GraphQL',
  '@apollo/client': 'Apollo GraphQL',
  'apollo-server': 'Apollo GraphQL',
  'mongoose': 'MongoDB',
  'mongodb': 'MongoDB',
  'pg': 'PostgreSQL',
  'mysql2': 'MySQL',
  'mysql': 'MySQL',
  'sqlite3': 'SQLite',
  'redis': 'Redis',
  'ioredis': 'Redis',
  '@prisma/client': 'Prisma',
  'prisma': 'Prisma',
  'typeorm': 'TypeORM',
  'sequelize': 'Sequelize',
  'tailwindcss': 'Tailwind CSS',
  '@reduxjs/toolkit': 'Redux',
  'redux': 'Redux',
  'zustand': 'Zustand',
  'mobx': 'MobX',
  'jsonwebtoken': 'JWT',
  'bcrypt': 'Bcrypt',
  'bcryptjs': 'Bcrypt',
  'jest': 'Jest',
  'mocha': 'Mocha',
  'cypress': 'Cypress',
  '@playwright/test': 'Playwright',
  '@testing-library/react': 'Testing Library',
  'aws-sdk': 'AWS',
  '@aws-sdk/client-s3': 'AWS S3',
  'firebase': 'Firebase',
  '@supabase/supabase-js': 'Supabase',
  'stripe': 'Stripe',
  'three': 'Three.js',
  'd3': 'D3.js',
  'chart.js': 'Chart.js',
  'axios': 'Axios',
  'zod': 'Zod',
};

const PYTHON_PACKAGES_MAP = {
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'tensorflow': 'TensorFlow',
  'torch': 'PyTorch',
  'pytorch': 'PyTorch',
  'keras': 'Keras',
  'sklearn': 'scikit-learn',
  'scikit-learn': 'scikit-learn',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scipy': 'SciPy',
  'streamlit': 'Streamlit',
  'celery': 'Celery',
  'opencv-python': 'OpenCV',
  'cv2': 'OpenCV',
  'transformers': 'HuggingFace Transformers',
  'langchain': 'LangChain',
  'langchain-core': 'LangChain',
  'openai': 'OpenAI API',
  'sqlalchemy': 'SQLAlchemy',
  'pytest': 'Pytest',
  'nltk': 'NLTK',
  'spacy': 'spaCy',
  'matplotlib': 'Matplotlib',
  'seaborn': 'Seaborn',
  'pydantic': 'Pydantic',
  'pymongo': 'MongoDB',
  'psycopg2': 'PostgreSQL',
  'redis': 'Redis',
  'boto3': 'AWS (Boto3)',
};

class GithubTechDetector {
  /**
   * Detects technologies from package.json content
   */
  detectFromPackageJson(content) {
    const detected = new Set();
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      const allDeps = {
        ...(parsed.dependencies || {}),
        ...(parsed.devDependencies || {}),
        ...(parsed.peerDependencies || {}),
      };

      for (const [pkg, canonicalName] of Object.entries(JS_PACKAGES_MAP)) {
        if (allDeps[pkg]) {
          detected.add(canonicalName);
        }
      }

      // Add Node.js and JavaScript/TypeScript
      if (allDeps['typescript'] || parsed.types || parsed.typings) {
        detected.add('TypeScript');
      }
      detected.add('JavaScript');
      detected.add('Node.js');
    } catch (err) {}
    return Array.from(detected);
  }

  /**
   * Detects technologies from requirements.txt / pyproject.toml / Pipfile
   */
  detectFromRequirementsTxt(content) {
    const detected = new Set();
    if (typeof content !== 'string') return [];

    detected.add('Python');
    const lines = content.toLowerCase().split('\n');

    for (const line of lines) {
      const cleanLine = line.trim().split(/[=><~;]/)[0].trim();
      if (!cleanLine || cleanLine.startsWith('#')) continue;

      for (const [pkg, canonicalName] of Object.entries(PYTHON_PACKAGES_MAP)) {
        if (cleanLine === pkg || cleanLine.startsWith(pkg)) {
          detected.add(canonicalName);
        }
      }
    }

    return Array.from(detected);
  }

  /**
   * Detects technologies from Java pom.xml or build.gradle
   */
  detectFromJavaBuild(content) {
    const detected = new Set();
    if (typeof content !== 'string') return [];

    detected.add('Java');
    const lower = content.toLowerCase();

    if (lower.includes('spring-boot')) detected.add('Spring Boot');
    if (lower.includes('springframework')) detected.add('Spring Framework');
    if (lower.includes('hibernate')) detected.add('Hibernate');
    if (lower.includes('junit')) detected.add('JUnit');
    if (lower.includes('lombok')) detected.add('Lombok');
    if (lower.includes('postgresql')) detected.add('PostgreSQL');
    if (lower.includes('mysql')) detected.add('MySQL');
    if (lower.includes('mongodb')) detected.add('MongoDB');

    return Array.from(detected);
  }

  /**
   * Detects technologies from Go go.mod
   */
  detectFromGoMod(content) {
    const detected = new Set();
    if (typeof content !== 'string') return [];

    detected.add('Go');
    const lower = content.toLowerCase();

    if (lower.includes('github.com/gin-gonic/gin')) detected.add('Gin');
    if (lower.includes('github.com/gofiber/fiber')) detected.add('Fiber');
    if (lower.includes('github.com/labstack/echo')) detected.add('Echo');
    if (lower.includes('gorm.io/gorm')) detected.add('GORM');

    return Array.from(detected);
  }

  /**
   * Detects technologies from Rust Cargo.toml
   */
  detectFromCargoToml(content) {
    const detected = new Set();
    if (typeof content !== 'string') return [];

    detected.add('Rust');
    const lower = content.toLowerCase();

    if (lower.includes('actix-web')) detected.add('Actix Web');
    if (lower.includes('tokio')) detected.add('Tokio');
    if (lower.includes('rocket')) detected.add('Rocket');
    if (lower.includes('serde')) detected.add('Serde');

    return Array.from(detected);
  }

  /**
   * Scans README text for mentioned keywords
   */
  detectFromReadme(readmeContent) {
    const mentions = new Set();
    if (!readmeContent || typeof readmeContent !== 'string') return [];

    const text = readmeContent.toLowerCase();
    const keywords = [
      { key: 'react', name: 'React' },
      { key: 'node.js', name: 'Node.js' },
      { key: 'nodejs', name: 'Node.js' },
      { key: 'express', name: 'Express.js' },
      { key: 'mongodb', name: 'MongoDB' },
      { key: 'postgresql', name: 'PostgreSQL' },
      { key: 'postgres', name: 'PostgreSQL' },
      { key: 'mysql', name: 'MySQL' },
      { key: 'docker', name: 'Docker' },
      { key: 'kubernetes', name: 'Kubernetes' },
      { key: 'aws', name: 'AWS' },
      { key: 'tensorflow', name: 'TensorFlow' },
      { key: 'pytorch', name: 'PyTorch' },
      { key: 'socket.io', name: 'Socket.IO' },
      { key: 'redis', name: 'Redis' },
      { key: 'graphql', name: 'GraphQL' },
      { key: 'tailwind', name: 'Tailwind CSS' },
      { key: 'jwt', name: 'JWT' },
      { key: 'flask', name: 'Flask' },
      { key: 'django', name: 'Django' },
      { key: 'fastapi', name: 'FastAPI' },
      { key: 'streamlit', name: 'Streamlit' },
      { key: 'next.js', name: 'Next.js' },
      { key: 'nextjs', name: 'Next.js' },
      { key: 'typescript', name: 'TypeScript' },
      { key: 'python', name: 'Python' },
      { key: 'java', name: 'Java' },
      { key: 'c++', name: 'C++' },
    ];

    for (const item of keywords) {
      try {
        const escapedKey = item.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escapedKey}([^a-zA-Z0-9_]|$)`, 'i');
        if (regex.test(text)) {
          mentions.add(item.name);
        }
      } catch (e) {}
    }

    return Array.from(mentions);
  }
}

module.exports = new GithubTechDetector();
