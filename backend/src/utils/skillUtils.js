/**
 * CareerLens Canonical Skill Normalization & Matching Utilities (Backend CommonJS)
 */

function normalizeSkill(val) {
  if (!val) return '';
  let str = String(val)
    .trim()
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/[&+/]/g, ' and ')
    .replace(/[\-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Canonical DSA & Algorithmic Mappings
  if (
    str === 'dsa' ||
    str === 'data structures and algorithms' ||
    str === 'data structures algorithms' ||
    str === 'data structures and algorithm' ||
    str === 'data structures' ||
    str === 'data structure' ||
    str === 'algorithms' ||
    str === 'algorithm' ||
    str === 'dsa data structures and algorithms' ||
    str === 'data structures and algorithms dsa' ||
    str.includes('data structures and algorithms') ||
    str.includes('data structures & algorithms')
  ) {
    return 'data structures algorithms';
  }

  if (str === 'problem solving') return 'problem solving';
  if (str === 'competitive programming') return 'competitive programming';

  // Specific Algorithmic Topics
  if (str === 'dynamic programming' || str === 'dp') return 'dynamic programming';
  if (str === 'binary search' || str === 'binary searching') return 'binary search';
  if (str === 'graphs' || str === 'graph' || str === 'graph algorithms' || str === 'graph theory') return 'graphs';
  if (str === 'trees' || str === 'tree' || str === 'binary tree' || str === 'binary trees') return 'trees';
  if (str === 'hash tables' || str === 'hash table' || str === 'hash map' || str === 'hashmap' || str === 'hashing') return 'hash tables';
  if (str === 'two pointers' || str === 'two pointer') return 'two pointers';
  if (str === 'sliding window') return 'sliding window';
  if (str === 'greedy' || str === 'greedy algorithms') return 'greedy';
  if (str === 'backtracking') return 'backtracking';
  if (str === 'trie' || str === 'tries') return 'trie';
  if (str === 'linked list' || str === 'linked lists') return 'linked list';
  if (str === 'heap' || str === 'priority queue' || str === 'heaps') return 'heap / priority queue';
  if (str === 'arrays' || str === 'array') return 'arrays';
  if (str === 'strings' || str === 'string') return 'strings';

  // React
  if (str === 'react' || str === 'react js' || str === 'reactjs') return 'react';
  if (str === 'react native' || str === 'reactnative') return 'react native';

  // Node
  if (str === 'node' || str === 'node js' || str === 'nodejs') return 'node js';

  // Next
  if (str === 'next' || str === 'next js' || str === 'nextjs') return 'next js';

  // Vue
  if (str === 'vue' || str === 'vue js' || str === 'vuejs') return 'vue js';

  // C++ / C#
  if (str === 'c and and' || str === 'cpp' || str === 'c plus plus' || str === 'cplusplus') return 'c++';
  if (str === 'c sharp' || str === 'csharp' || str === 'c#') return 'c#';

  // Python
  if (str === 'python' || str === 'python 3' || str === 'python3') return 'python';

  // Mongo / Postgres
  if (str === 'mongo' || str === 'mongodb') return 'mongodb';
  if (str === 'postgres' || str === 'postgresql') return 'postgresql';

  // Express
  if (str === 'express' || str === 'express js' || str === 'expressjs') return 'express js';

  return str.replace(/\s+/g, '');
}

function isSkillMatch(skillA, skillB) {
  if (!skillA || !skillB) return false;
  const aNorm = normalizeSkill(skillA);
  const bNorm = normalizeSkill(skillB);
  if (aNorm && bNorm && aNorm === bNorm) return true;

  const aRaw = String(skillA).trim().toLowerCase();
  const bRaw = String(skillB).trim().toLowerCase();
  if (aRaw === bRaw) return true;

  // Strict false positive guards
  if ((aRaw === 'java' && bRaw.includes('script')) || (bRaw === 'java' && aRaw.includes('script'))) return false;
  if ((aRaw === 'c' && (bRaw === 'c++' || bRaw === 'c#' || bRaw === 'css')) || (bRaw === 'c' && (aRaw === 'c++' || aRaw === 'c#' || aRaw === 'css'))) return false;
  if ((aRaw === 'r' && (bRaw === 'react' || bRaw === 'rust')) || (bRaw === 'r' && (aRaw === 'react' || aRaw === 'rust'))) return false;

  // Algorithmic Topic Phrase Matching (e.g. "Experienced in Dynamic Programming" -> "Dynamic Programming")
  const ALGO_TOPICS = [
    'dynamic programming',
    'binary search',
    'hash table',
    'two pointer',
    'sliding window',
    'linked list',
    'priority queue',
    'graph',
    'tree',
    'backtracking',
    'greedy',
    'trie',
    'union find',
    'bit manipulation',
    'prefix sum',
    'recursion',
  ];

  for (const t of ALGO_TOPICS) {
    const hasA = aRaw.includes(t);
    const hasB = bRaw.includes(t);
    if (hasA && hasB) return true;
  }

  return false;
}

function getCanonicalDisplayName(skillName) {
  const norm = normalizeSkill(skillName);
  if (norm === 'data structures algorithms') return 'Data Structures & Algorithms';
  if (norm === 'problem solving') return 'Problem Solving';
  if (norm === 'competitive programming') return 'Competitive Programming';
  if (norm === 'react') return 'React';
  if (norm === 'react native') return 'React Native';
  if (norm === 'node js') return 'Node.js';
  if (norm === 'next js') return 'Next.js';
  if (norm === 'express js') return 'Express.js';
  if (norm === 'vue js') return 'Vue.js';
  if (norm === 'c++') return 'C++';
  if (norm === 'c#') return 'C#';
  if (norm === 'python') return 'Python';
  if (norm === 'mongodb') return 'MongoDB';
  if (norm === 'postgresql') return 'PostgreSQL';
  return String(skillName || '').trim();
}

module.exports = {
  normalizeSkill,
  isSkillMatch,
  getCanonicalDisplayName,
};
