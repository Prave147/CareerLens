/**
 * CareerLens — LeetCode Topic Normalizer (V2)
 * Maps raw LeetCode tags, slugs, and strings into 27 canonical algorithmic topics.
 */

const CANONICAL_TOPICS = [
  'Arrays',
  'Strings',
  'Hash Tables',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack',
  'Queue',
  'Linked List',
  'Trees',
  'Binary Search Tree',
  'Heap / Priority Queue',
  'Graphs',
  'BFS',
  'DFS',
  'Backtracking',
  'Greedy',
  'Dynamic Programming',
  'Trie',
  'Union Find',
  'Bit Manipulation',
  'Math',
  'Prefix Sum',
  'Sorting',
  'Intervals',
  'Matrix',
  'Recursion',
];

const TOPIC_ALIASES = {
  // Arrays
  'array': 'Arrays',
  'arrays': 'Arrays',

  // Strings
  'string': 'Strings',
  'strings': 'Strings',
  'string-matching': 'Strings',

  // Hash Tables
  'hash-table': 'Hash Tables',
  'hashtable': 'Hash Tables',
  'hash table': 'Hash Tables',
  'hash map': 'Hash Tables',
  'hash-map': 'Hash Tables',
  'hashing': 'Hash Tables',

  // Two Pointers
  'two-pointers': 'Two Pointers',
  'two pointers': 'Two Pointers',

  // Sliding Window
  'sliding-window': 'Sliding Window',
  'sliding window': 'Sliding Window',

  // Binary Search
  'binary-search': 'Binary Search',
  'binary search': 'Binary Search',

  // Stack
  'stack': 'Stack',
  'monotonic-stack': 'Stack',

  // Queue
  'queue': 'Queue',
  'monotonic-queue': 'Queue',

  // Linked List
  'linked-list': 'Linked List',
  'linked list': 'Linked List',
  'doubly-linked-list': 'Linked List',

  // Trees
  'tree': 'Trees',
  'trees': 'Trees',
  'binary-tree': 'Trees',
  'binary tree': 'Trees',

  // Binary Search Tree
  'binary-search-tree': 'Binary Search Tree',
  'binary search tree': 'Binary Search Tree',
  'bst': 'Binary Search Tree',

  // Heap / Priority Queue
  'heap': 'Heap / Priority Queue',
  'priority-queue': 'Heap / Priority Queue',
  'heap-priority-queue': 'Heap / Priority Queue',
  'heap (priority queue)': 'Heap / Priority Queue',

  // Graphs
  'graph': 'Graphs',
  'graphs': 'Graphs',
  'graph-theory': 'Graphs',
  'shortest-path': 'Graphs',
  'minimum-spanning-tree': 'Graphs',
  'topological-sort': 'Graphs',
  'eulerian-circuit': 'Graphs',

  // BFS / DFS
  'breadth-first-search': 'BFS',
  'breadth first search': 'BFS',
  'bfs': 'BFS',
  'depth-first-search': 'DFS',
  'depth first search': 'DFS',
  'dfs': 'DFS',

  // Backtracking
  'backtracking': 'Backtracking',

  // Greedy
  'greedy': 'Greedy',

  // Dynamic Programming
  'dynamic-programming': 'Dynamic Programming',
  'dynamic programming': 'Dynamic Programming',
  'dp': 'Dynamic Programming',
  'memoization': 'Dynamic Programming',

  // Trie
  'trie': 'Trie',

  // Union Find
  'union-find': 'Union Find',
  'union find': 'Union Find',
  'disjoint-set': 'Union Find',

  // Bit Manipulation
  'bit-manipulation': 'Bit Manipulation',
  'bit manipulation': 'Bit Manipulation',
  'bitmask': 'Bit Manipulation',

  // Math
  'math': 'Math',
  'mathematics': 'Math',
  'geometry': 'Math',
  'combinatorics': 'Math',
  'number-theory': 'Math',
  'game-theory': 'Math',

  // Prefix Sum
  'prefix-sum': 'Prefix Sum',
  'prefix sum': 'Prefix Sum',

  // Sorting
  'sorting': 'Sorting',
  'sort': 'Sorting',
  'merge-sort': 'Sorting',
  'quickselect': 'Sorting',
  'bucket-sort': 'Sorting',
  'counting-sort': 'Sorting',
  'radix-sort': 'Sorting',

  // Intervals
  'interval': 'Intervals',
  'intervals': 'Intervals',

  // Matrix
  'matrix': 'Matrix',

  // Recursion
  'recursion': 'Recursion',
  'divide-and-conquer': 'Recursion',
};

class LeetCodeTopicNormalizer {
  /**
   * Normalizes any LeetCode tag, topic slug, or name into a canonical topic.
   */
  normalize(rawTag) {
    if (!rawTag || typeof rawTag !== 'string') return null;
    const clean = rawTag
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]/g, '');

    if (TOPIC_ALIASES[clean]) {
      return TOPIC_ALIASES[clean];
    }

    const simpleClean = rawTag.trim().toLowerCase().replace(/[\-_]+/g, ' ');
    if (TOPIC_ALIASES[simpleClean]) {
      return TOPIC_ALIASES[simpleClean];
    }

    // Direct case-insensitive match against canonical list
    const directMatch = CANONICAL_TOPICS.find((t) => t.toLowerCase() === simpleClean);
    if (directMatch) {
      return directMatch;
    }

    return null;
  }

  /**
   * Returns the complete list of 27 canonical topics.
   */
  getCanonicalTopics() {
    return [...CANONICAL_TOPICS];
  }
}

module.exports = new LeetCodeTopicNormalizer();
