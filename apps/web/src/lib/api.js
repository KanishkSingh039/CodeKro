/**
 * CodeKro API Client Stub & Mock Data Engine
 * Designed for pure UI development; cleanly swapped for the real backend later.
 */

// In-memory problem store with localStorage persistence for bookmarking/mutations
const STORAGE_BOOKMARKS_KEY = 'codekro_bookmarked_ids';

const getInitialBookmarks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [1, 42, 146];
  } catch {
    return [1, 42, 146];
  }
};

let userBookmarks = new Set(getInitialBookmarks());

const rawProblems = [
  {
    id: 1,
    frontendQuestionId: 1,
    title: 'Two Sum',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    acceptanceRate: 53.6,
    status: 'solved',
    frequency: 98,
    topicTags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Meta'],
    lastAttemptedAt: '2026-10-12T14:22:00Z',
  },
  {
    id: 2,
    frontendQuestionId: 2,
    title: 'Add Two Numbers',
    titleSlug: 'add-two-numbers',
    difficulty: 'Medium',
    acceptanceRate: 43.1,
    status: 'solved',
    frequency: 91,
    topicTags: ['Linked List', 'Math', 'Recursion'],
    companies: ['Amazon', 'Microsoft'],
    lastAttemptedAt: '2026-10-10T09:12:00Z',
  },
  {
    id: 3,
    frontendQuestionId: 3,
    title: 'Longest Substring Without Repeating Characters',
    titleSlug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    acceptanceRate: 34.8,
    status: 'todo',
    frequency: 94,
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Google', 'Meta', 'Apple'],
    lastAttemptedAt: null,
  },
  {
    id: 4,
    frontendQuestionId: 4,
    title: 'Median of Two Sorted Arrays',
    titleSlug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    acceptanceRate: 39.5,
    status: 'todo',
    frequency: 86,
    topicTags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon'],
    lastAttemptedAt: null,
  },
  {
    id: 5,
    frontendQuestionId: 5,
    title: 'Longest Palindromic Substring',
    titleSlug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    acceptanceRate: 33.9,
    status: 'attempted',
    frequency: 89,
    topicTags: ['Two Pointers', 'String', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft'],
    lastAttemptedAt: '2026-10-13T11:45:00Z',
  },
  {
    id: 11,
    frontendQuestionId: 11,
    title: 'Container With Most Water',
    titleSlug: 'container-with-most-water',
    difficulty: 'Medium',
    acceptanceRate: 55.4,
    status: 'solved',
    frequency: 88,
    topicTags: ['Array', 'Two Pointers', 'Greedy'],
    companies: ['Meta', 'Google'],
    lastAttemptedAt: '2026-10-08T18:20:00Z',
  },
  {
    id: 15,
    frontendQuestionId: 15,
    title: '3Sum',
    titleSlug: '3sum',
    difficulty: 'Medium',
    acceptanceRate: 34.6,
    status: 'attempted',
    frequency: 93,
    topicTags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Meta', 'Amazon', 'Apple'],
    lastAttemptedAt: '2026-10-13T20:10:00Z',
  },
  {
    id: 20,
    frontendQuestionId: 20,
    title: 'Valid Parentheses',
    titleSlug: 'valid-parentheses',
    difficulty: 'Easy',
    acceptanceRate: 40.8,
    status: 'solved',
    frequency: 96,
    topicTags: ['String', 'Stack'],
    companies: ['Amazon', 'Google', 'Bloomberg'],
    lastAttemptedAt: '2026-10-05T12:00:00Z',
  },
  {
    id: 21,
    frontendQuestionId: 21,
    title: 'Merge Two Sorted Lists',
    titleSlug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    acceptanceRate: 64.2,
    status: 'solved',
    frequency: 90,
    topicTags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Microsoft'],
    lastAttemptedAt: '2026-10-04T16:15:00Z',
  },
  {
    id: 23,
    frontendQuestionId: 23,
    title: 'Merge k Sorted Lists',
    titleSlug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    acceptanceRate: 52.8,
    status: 'todo',
    frequency: 85,
    topicTags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)'],
    companies: ['Meta', 'Amazon', 'Google'],
    lastAttemptedAt: null,
  },
  {
    id: 33,
    frontendQuestionId: 33,
    title: 'Search in Rotated Sorted Array',
    titleSlug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    acceptanceRate: 40.7,
    status: 'solved',
    frequency: 87,
    topicTags: ['Array', 'Binary Search'],
    companies: ['Google', 'Microsoft', 'Bloomberg'],
    lastAttemptedAt: '2026-10-09T14:00:00Z',
  },
  {
    id: 42,
    frontendQuestionId: 42,
    title: 'Trapping Rain Water',
    titleSlug: 'trapping-rain-water',
    difficulty: 'Hard',
    acceptanceRate: 61.4,
    status: 'attempted',
    frequency: 97,
    topicTags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    companies: ['Google', 'Amazon', 'Meta', 'Apple'],
    lastAttemptedAt: '2026-10-14T01:10:00Z',
  },
  {
    id: 46,
    frontendQuestionId: 46,
    title: 'Permutations',
    titleSlug: 'permutations',
    difficulty: 'Medium',
    acceptanceRate: 78.2,
    status: 'solved',
    frequency: 81,
    topicTags: ['Array', 'Backtracking'],
    companies: ['Amazon', 'Microsoft'],
    lastAttemptedAt: '2026-09-28T10:11:00Z',
  },
  {
    id: 49,
    frontendQuestionId: 49,
    title: 'Group Anagrams',
    titleSlug: 'group-anagrams',
    difficulty: 'Medium',
    acceptanceRate: 68.7,
    status: 'solved',
    frequency: 92,
    topicTags: ['Array', 'Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Apple', 'Google'],
    lastAttemptedAt: '2026-10-07T13:40:00Z',
  },
  {
    id: 53,
    frontendQuestionId: 53,
    title: 'Maximum Subarray',
    titleSlug: 'maximum-subarray',
    difficulty: 'Medium',
    acceptanceRate: 51.1,
    status: 'solved',
    frequency: 89,
    topicTags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    lastAttemptedAt: '2026-10-06T15:20:00Z',
  },
  {
    id: 70,
    frontendQuestionId: 70,
    title: 'Climbing Stairs',
    titleSlug: 'climbing-stairs',
    difficulty: 'Easy',
    acceptanceRate: 53.0,
    status: 'solved',
    frequency: 84,
    topicTags: ['Math', 'Dynamic Programming', 'Memoization'],
    companies: ['Amazon', 'Google'],
    lastAttemptedAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 76,
    frontendQuestionId: 76,
    title: 'Minimum Window Substring',
    titleSlug: 'minimum-window-substring',
    difficulty: 'Hard',
    acceptanceRate: 42.6,
    status: 'todo',
    frequency: 88,
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Meta', 'Amazon', 'Google'],
    lastAttemptedAt: null,
  },
  {
    id: 98,
    frontendQuestionId: 98,
    title: 'Validate Binary Search Tree',
    titleSlug: 'validate-binary-search-tree',
    difficulty: 'Medium',
    acceptanceRate: 33.1,
    status: 'solved',
    frequency: 83,
    topicTags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    companies: ['Amazon', 'Bloomberg', 'Meta'],
    lastAttemptedAt: '2026-10-01T17:30:00Z',
  },
  {
    id: 102,
    frontendQuestionId: 102,
    title: 'Binary Tree Level Order Traversal',
    titleSlug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    acceptanceRate: 67.5,
    status: 'solved',
    frequency: 82,
    topicTags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    companies: ['Amazon', 'Microsoft', 'Meta'],
    lastAttemptedAt: '2026-09-29T11:20:00Z',
  },
  {
    id: 121,
    frontendQuestionId: 121,
    title: 'Best Time to Buy and Sell Stock',
    titleSlug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    acceptanceRate: 54.4,
    status: 'solved',
    frequency: 95,
    topicTags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Google', 'Meta', 'Apple'],
    lastAttemptedAt: '2026-10-02T19:00:00Z',
  },
  {
    id: 124,
    frontendQuestionId: 124,
    title: 'Binary Tree Maximum Path Sum',
    titleSlug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    acceptanceRate: 40.2,
    status: 'todo',
    frequency: 86,
    topicTags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'],
    companies: ['Meta', 'Amazon', 'Google'],
    lastAttemptedAt: null,
  },
  {
    id: 128,
    frontendQuestionId: 128,
    title: 'Longest Consecutive Sequence',
    titleSlug: 'longest-consecutive-sequence',
    difficulty: 'Medium',
    acceptanceRate: 47.9,
    status: 'solved',
    frequency: 85,
    topicTags: ['Array', 'Hash Table', 'Union Find'],
    companies: ['Google', 'Amazon', 'Spotify'],
    lastAttemptedAt: '2026-10-03T21:10:00Z',
  },
  {
    id: 139,
    frontendQuestionId: 139,
    title: 'Word Break',
    titleSlug: 'word-break',
    difficulty: 'Medium',
    acceptanceRate: 46.8,
    status: 'attempted',
    frequency: 81,
    topicTags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    companies: ['Amazon', 'Bloomberg', 'Meta'],
    lastAttemptedAt: '2026-10-11T16:45:00Z',
  },
  {
    id: 141,
    frontendQuestionId: 141,
    title: 'Linked List Cycle',
    titleSlug: 'linked-list-cycle',
    difficulty: 'Easy',
    acceptanceRate: 50.3,
    status: 'solved',
    frequency: 87,
    topicTags: ['Hash Table', 'Linked List', 'Two Pointers'],
    companies: ['Amazon', 'Microsoft'],
    lastAttemptedAt: '2026-09-20T14:15:00Z',
  },
  {
    id: 146,
    frontendQuestionId: 146,
    title: 'LRU Cache',
    titleSlug: 'lru-cache',
    difficulty: 'Medium',
    acceptanceRate: 42.8,
    status: 'solved',
    frequency: 99,
    topicTags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    lastAttemptedAt: '2026-10-12T19:30:00Z',
  },
  {
    id: 200,
    frontendQuestionId: 200,
    title: 'Number of Islands',
    titleSlug: 'number-of-islands',
    difficulty: 'Medium',
    acceptanceRate: 59.3,
    status: 'solved',
    frequency: 94,
    topicTags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
    companies: ['Amazon', 'Google', 'Bloomberg'],
    lastAttemptedAt: '2026-10-05T10:20:00Z',
  },
  {
    id: 206,
    frontendQuestionId: 206,
    title: 'Reverse Linked List',
    titleSlug: 'reverse-linked-list',
    difficulty: 'Easy',
    acceptanceRate: 76.8,
    status: 'solved',
    frequency: 92,
    topicTags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Google', 'Apple'],
    lastAttemptedAt: '2026-10-13T18:50:00Z',
  },
  {
    id: 207,
    frontendQuestionId: 207,
    title: 'Course Schedule',
    titleSlug: 'course-schedule',
    difficulty: 'Medium',
    acceptanceRate: 47.4,
    status: 'todo',
    frequency: 87,
    topicTags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    companies: ['Google', 'Amazon', 'Meta'],
    lastAttemptedAt: null,
  },
  {
    id: 215,
    frontendQuestionId: 215,
    title: 'Kth Largest Element in an Array',
    titleSlug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    acceptanceRate: 67.2,
    status: 'solved',
    frequency: 90,
    topicTags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    companies: ['Meta', 'Amazon', 'Google'],
    lastAttemptedAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 238,
    frontendQuestionId: 238,
    title: 'Product of Array Except Self',
    titleSlug: 'product-of-array-except-self',
    difficulty: 'Medium',
    acceptanceRate: 66.1,
    status: 'solved',
    frequency: 91,
    topicTags: ['Array', 'Prefix Sum'],
    companies: ['Amazon', 'Apple', 'Meta'],
    lastAttemptedAt: '2026-10-06T11:00:00Z',
  },
  {
    id: 295,
    frontendQuestionId: 295,
    title: 'Find Median from Data Stream',
    titleSlug: 'find-median-from-data-stream',
    difficulty: 'Hard',
    acceptanceRate: 52.1,
    status: 'todo',
    frequency: 85,
    topicTags: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'],
    companies: ['Google', 'Amazon', 'Apple'],
    lastAttemptedAt: null,
  },
  {
    id: 300,
    frontendQuestionId: 300,
    title: 'Longest Increasing Subsequence',
    titleSlug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    acceptanceRate: 55.6,
    status: 'solved',
    frequency: 84,
    topicTags: ['Array', 'Binary Search', 'Dynamic Programming'],
    companies: ['Google', 'Microsoft'],
    lastAttemptedAt: '2026-09-25T14:00:00Z',
  },
  {
    id: 322,
    frontendQuestionId: 322,
    title: 'Coin Change',
    titleSlug: 'coin-change',
    difficulty: 'Medium',
    acceptanceRate: 44.5,
    status: 'solved',
    frequency: 89,
    topicTags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    companies: ['Amazon', 'Bloomberg', 'Google'],
    lastAttemptedAt: '2026-09-27T19:30:00Z',
  },
  {
    id: 347,
    frontendQuestionId: 347,
    title: 'Top K Frequent Elements',
    titleSlug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    acceptanceRate: 63.8,
    status: 'solved',
    frequency: 88,
    topicTags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort'],
    companies: ['Meta', 'Amazon', 'Google'],
    lastAttemptedAt: '2026-10-03T16:20:00Z',
  },
  {
    id: 424,
    frontendQuestionId: 424,
    title: 'Longest Repeating Character Replacement',
    titleSlug: 'longest-repeating-character-replacement',
    difficulty: 'Medium',
    acceptanceRate: 54.9,
    status: 'todo',
    frequency: 82,
    topicTags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Google', 'Amazon'],
    lastAttemptedAt: null,
  },
  {
    id: 560,
    frontendQuestionId: 560,
    title: 'Subarray Sum Equals K',
    titleSlug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    acceptanceRate: 44.2,
    status: 'solved',
    frequency: 87,
    topicTags: ['Array', 'Hash Table', 'Prefix Sum'],
    companies: ['Meta', 'Google'],
    lastAttemptedAt: '2026-10-07T12:00:00Z',
  },
];

// Generate 12 weeks (84 days) of contribution activity
const generateHeatmap = () => {
  const days = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // Realistic coding activity distribution
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();
    let count = 0;
    let level = 0;

    if (rand > 0.35) {
      if (rand > 0.85) {
        count = isWeekend ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 6) + 5;
        level = 4;
      } else if (rand > 0.65) {
        count = Math.floor(Math.random() * 3) + 3;
        level = 3;
      } else if (rand > 0.5) {
        count = 2;
        level = 2;
      } else {
        count = 1;
        level = 1;
      }
    }
    days.push({ date: dateStr, count, level });
  }
  return days;
};

const activityHeatmap = generateHeatmap();

export const apiClient = {
  /**
   * Auth: Login user
   */
  async login(credentials) {
    console.info('[apiClient] login:', { email: credentials?.email });
    return Promise.resolve({ success: true, message: 'Ready for integration' });
  },

  /**
   * Auth: Register user
   */
  async register(data) {
    console.info('[apiClient] register:', { username: data?.username, email: data?.email });
    return Promise.resolve({ success: true, message: 'Ready for integration' });
  },

  /**
   * GET /api/me
   * Fetches current authenticated user profile
   */
  async getMe() {
    await new Promise((r) => setTimeout(r, 60));
    return {
      id: 'usr_kanishk01',
      username: 'kanishk',
      name: 'Kanishk Singh',
      email: 'kanishk@codekro.dev',
      avatarUrl: '',
      lastAttemptedProblem: {
        id: 42,
        title: 'Trapping Rain Water',
        titleSlug: 'trapping-rain-water',
        difficulty: 'Hard',
      },
    };
  },

  /**
   * GET /api/problems?page&limit&difficulty&status&tag&company&q&sort
   */
  async getProblems(params = {}) {
    await new Promise((r) => setTimeout(r, 90));
    const {
      page = 1,
      limit = 20,
      q = '',
      difficulty = 'all',
      status = 'all',
      tag = 'all',
      company = 'all',
      sort = 'id_asc',
    } = params;

    let filtered = rawProblems.map((p) => ({
      ...p,
      isBookmarked: userBookmarks.has(p.id),
    }));

    // Filter by search text
    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          String(p.frontendQuestionId).includes(search)
      );
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by topic tag
    if (tag && tag !== 'all') {
      filtered = filtered.filter((p) =>
        p.topicTags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    // Filter by company
    if (company && company !== 'all') {
      filtered = filtered.filter((p) =>
        p.companies.some((c) => c.toLowerCase() === company.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'id_desc':
          return b.frontendQuestionId - a.frontendQuestionId;
        case 'ac_rate_asc':
          return a.acceptanceRate - b.acceptanceRate;
        case 'ac_rate_desc':
          return b.acceptanceRate - a.acceptanceRate;
        case 'freq_desc':
          return b.frequency - a.frequency;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'id_asc':
        default:
          return a.frontendQuestionId - b.frontendQuestionId;
      }
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.min(Math.max(1, Number(page)), totalPages);
    const start = (validPage - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      problems: paginated,
      total,
      page: validPage,
      totalPages,
      limit,
    };
  },

  /**
   * GET /api/me/stats
   */
  async getUserStats() {
    await new Promise((r) => setTimeout(r, 60));
    return {
      totalSolved: 284,
      totalProblems: 3120,
      easy: { solved: 142, total: 820 },
      medium: { solved: 118, total: 1650 },
      hard: { solved: 24, total: 650 },
      acceptanceRate: 68.4,
      globalRanking: 14290,
    };
  },

  /**
   * GET /api/me/activity
   */
  async getUserActivity() {
    await new Promise((r) => setTimeout(r, 60));
    return {
      currentStreak: 14,
      longestStreak: 48,
      totalActiveDays: 62,
      heatmap: activityHeatmap,
    };
  },

  /**
   * GET /api/daily-problem
   */
  async getDailyProblem() {
    await new Promise((r) => setTimeout(r, 50));
    return {
      date: new Date().toISOString().split('T')[0],
      timeRemainingSeconds: 28410,
      problem: {
        id: 3,
        frontendQuestionId: 3,
        title: 'Longest Substring Without Repeating Characters',
        titleSlug: 'longest-substring-without-repeating-characters',
        difficulty: 'Medium',
        acceptanceRate: 34.8,
        status: 'todo',
        frequency: 94,
        isBookmarked: false,
        topicTags: ['Hash Table', 'String', 'Sliding Window'],
        companies: ['Google', 'Meta', 'Apple'],
      },
    };
  },

  /**
   * GET /api/contests?upcoming=true
   */
  async getUpcomingContests() {
    await new Promise((r) => setTimeout(r, 50));
    const now = Date.now();
    return [
      {
        id: 'c-412',
        title: 'Weekly Contest 412',
        slug: 'weekly-contest-412',
        startTime: new Date(now + 2 * 24 * 3600 * 1000 + 4 * 3600 * 1000).toISOString(),
        durationMinutes: 90,
        isRegistered: true,
        registeredCount: 18450,
      },
      {
        id: 'c-138',
        title: 'Biweekly Contest 138',
        slug: 'biweekly-contest-138',
        startTime: new Date(now + 5 * 24 * 3600 * 1000 + 11 * 3600 * 1000).toISOString(),
        durationMinutes: 90,
        isRegistered: false,
        registeredCount: 12210,
      },
      {
        id: 'c-cup4',
        title: 'CodeKro Cup #4 (Spring Invitational)',
        slug: 'codekro-cup-4',
        startTime: new Date(now + 9 * 24 * 3600 * 1000 + 7 * 3600 * 1000).toISOString(),
        durationMinutes: 120,
        isRegistered: false,
        registeredCount: 8930,
      },
    ];
  },

  /**
   * GET /api/me/submissions?limit=5
   */
  async getRecentSubmissions(limit = 5) {
    await new Promise((r) => setTimeout(r, 60));
    const list = [
      {
        id: 'sub-901',
        problemId: 1,
        problemTitle: 'Two Sum',
        problemSlug: 'two-sum',
        status: 'Accepted',
        language: 'C++',
        runtime: '4 ms',
        memory: '10.4 MB',
        submittedAt: '2026-10-14T03:15:00Z',
        relativeTime: '18m ago',
      },
      {
        id: 'sub-900',
        problemId: 42,
        problemTitle: 'Trapping Rain Water',
        problemSlug: 'trapping-rain-water',
        status: 'Time Limit Exceeded',
        language: 'Python3',
        runtime: 'N/A',
        memory: '18.2 MB',
        submittedAt: '2026-10-14T01:10:00Z',
        relativeTime: '2h ago',
      },
      {
        id: 'sub-899',
        problemId: 206,
        problemTitle: 'Reverse Linked List',
        problemSlug: 'reverse-linked-list',
        status: 'Accepted',
        language: 'Go',
        runtime: '2 ms',
        memory: '3.2 MB',
        submittedAt: '2026-10-13T22:30:00Z',
        relativeTime: '5h ago',
      },
      {
        id: 'sub-898',
        problemId: 15,
        problemTitle: '3Sum',
        problemSlug: '3sum',
        status: 'Wrong Answer',
        language: 'Java',
        runtime: '18 ms',
        memory: '44.1 MB',
        submittedAt: '2026-10-13T12:00:00Z',
        relativeTime: 'Yesterday',
      },
      {
        id: 'sub-897',
        problemId: 146,
        problemTitle: 'LRU Cache',
        problemSlug: 'lru-cache',
        status: 'Accepted',
        language: 'C++',
        runtime: '52 ms',
        memory: '38.6 MB',
        submittedAt: '2026-10-12T19:30:00Z',
        relativeTime: '2d ago',
      },
    ];
    return list.slice(0, limit);
  },

  /**
   * POST /api/problems/:id/bookmark
   */
  async toggleBookmark(problemId) {
    await new Promise((r) => setTimeout(r, 40));
    const numId = Number(problemId);
    if (userBookmarks.has(numId)) {
      userBookmarks.delete(numId);
    } else {
      userBookmarks.add(numId);
    }
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify([...userBookmarks]));
    } catch {
      // Ignore localStorage failure in restricted contexts
    }
    return {
      problemId: numId,
      isBookmarked: userBookmarks.has(numId),
    };
  },
};
