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

  /**
   * GET /api/problems/:slug
   */
  async getProblemBySlug(slug) {
    await new Promise((r) => setTimeout(r, 70));
    const normalizedSlug = (slug || 'two-sum').toLowerCase();
    const foundProblem = rawProblems.find(
      (p) => p.titleSlug.toLowerCase() === normalizedSlug || String(p.id) === normalizedSlug || String(p.frontendQuestionId) === normalizedSlug
    );

    if (!foundProblem && normalizedSlug !== 'two-sum') {
      const err = new Error(`Problem "${slug}" not found`);
      err.status = 404;
      throw err;
    }

    const base = foundProblem || rawProblems[0];

    // Read stored user votes if any
    let votes = { likes: 14250, dislikes: 820, userVote: null };
    try {
      const stored = localStorage.getItem(`codekro_vote_${base.id}`);
      if (stored) votes = JSON.parse(stored);
    } catch {
      // fallback
    }

    // Default starter codes for the problem
    const starterCode = {
      'cpp': `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.find(complement) != seen.end()) {\n                return {seen[complement], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      'java': `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`,
      'python': `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i\n        return []`,
      'javascript': `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
      'go': `func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        complement := target - num\n        if idx, ok := seen[complement]; ok {\n            return []int{idx, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}`,
    };

    const testCases = [
      {
        id: 'case-1',
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        actualOutput: '[0,1]',
        isPassed: true,
      },
      {
        id: 'case-2',
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        actualOutput: '[1,2]',
        isPassed: true,
      },
      {
        id: 'case-3',
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        actualOutput: '[0,1]',
        isPassed: true,
      },
    ];

    const examples = [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        id: 2,
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        id: 3,
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].',
      },
    ];

    const constraints = [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ];

    const hints = [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions just for completeness, which is often a great way to start an interview.",
      "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x. Can we change our array somehow so that this search becomes faster?",
      "The second train of thought is, without changing the array, can we use additional space like a hash map to check whether y = target - x already exists in O(1) time?",
    ];

    const editorial = [
      {
        id: 'approach-1',
        title: 'Approach 1: One-Pass Hash Table (Optimal)',
        timeComplexity: 'O(n) - We traverse the list containing n elements only once. Each lookup in the hash table takes O(1) time on average.',
        spaceComplexity: 'O(n) - The extra space required depends on the number of items stored in the hash table, which stores at most n elements.',
        description:
          'While we iterate through the array, we check if the complement `target - nums[i]` exists in our hash table. If it exists, we return its index and the current index. If it does not exist, we store `nums[i]` and its index into the hash table for subsequent queries.',
        code: {
          'cpp': `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
          'python': `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
        },
      },
      {
        id: 'approach-2',
        title: 'Approach 2: Two-Pass Hash Table',
        timeComplexity: 'O(n) - Two iterations over the array.',
        spaceComplexity: 'O(n) - Space for the hash table.',
        description:
          'In the first pass, we add each element\'s value and its index to the table. In the second pass, we check if each element\'s complement (`target - nums[i]`) exists in the table and verify that the complement is not `nums[i]` itself.',
        code: {
          'cpp': `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        map[nums[i]] = i;\n    }\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (map.count(complement) && map[complement] != i) {\n            return {i, map[complement]};\n        }\n    }\n    return {};\n}`,
          'python': `def twoSum(nums: list[int], target: int) -> list[int]:\n    val_map = {num: i for i, num in enumerate(nums)}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in val_map and val_map[complement] != i:\n            return [i, val_map[complement]]\n    return []`,
        },
      },
    ];

    const solutions = [
      {
        id: 'sol-1',
        title: 'Clean One-Pass Hash Table in C++ / Python / Java with Step-by-Step Visualization',
        author: 'alex_code',
        upvotes: 1420,
        tags: ['Array', 'Hash Table', 'Beginner Friendly'],
        language: 'C++',
        createdAt: '2 days ago',
        preview: 'This solution uses a single pass over the numbers array with a hash table for O(n) runtime and O(n) memory. Here is how the lookup works with an example walk-through...',
      },
      {
        id: 'sol-2',
        title: 'Intuitive JavaScript Map Solution | Beats 99% Time',
        author: 'frontend_ninja',
        upvotes: 680,
        tags: ['JavaScript', 'Hash Table'],
        language: 'JavaScript',
        createdAt: '5 days ago',
        preview: 'Using ES6 Map provides high lookup performance without object prototype key pollution. Check out the clean 8-line solution...',
      },
      {
        id: 'sol-3',
        title: 'Memory-Efficient Python3 Dictionary Solution with Edge Cases Analysis',
        author: 'py_algorithmist',
        upvotes: 412,
        tags: ['Python3', 'Algorithms'],
        language: 'Python3',
        createdAt: '1 week ago',
        preview: 'We take advantage of Python dictionaries which are fast hash maps implemented in C. Note how duplicate elements are naturally handled...',
      },
    ];

    return {
      ...base,
      isBookmarked: userBookmarks.has(base.id),
      description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to* \`target\`.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.\n\nYou can return the answer in any order.`,
      examples,
      constraints,
      hints,
      followUp: 'Can you come up with an algorithm that is less than O(n²) time complexity?',
      likes: votes.likes,
      dislikes: votes.dislikes,
      userVote: votes.userVote,
      testCases,
      starterCode,
      editorial,
      isEditorialLocked: false,
      solutions,
    };
  },

  /**
   * GET /api/problems/:id/starter-code?lang=
   */
  async getStarterCode(problemId, lang = 'cpp') {
    await new Promise((r) => setTimeout(r, 40));
    const problem = await apiClient.getProblemBySlug(String(problemId));
    return {
      problemId: Number(problemId),
      lang,
      code: problem.starterCode[lang] || `// Write your ${lang} code here\n`,
    };
  },

  /**
   * GET /api/problems/:id/submissions
   */
  async getProblemSubmissions(problemId) {
    await new Promise((r) => setTimeout(r, 60));
    return [
      {
        id: 'sub-901',
        problemId: Number(problemId),
        problemTitle: 'Two Sum',
        problemSlug: 'two-sum',
        status: 'Accepted',
        language: 'C++',
        runtime: '4 ms',
        memory: '10.4 MB',
        submittedAt: '2026-10-15T14:22:00Z',
        relativeTime: '18m ago',
        code: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int complement = target - nums[i];\n            if (seen.count(complement)) {\n                return {seen[complement], i};\n            }\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      },
      {
        id: 'sub-884',
        problemId: Number(problemId),
        problemTitle: 'Two Sum',
        problemSlug: 'two-sum',
        status: 'Wrong Answer',
        language: 'Java',
        runtime: '18 ms',
        memory: '44.1 MB',
        submittedAt: '2026-10-14T09:12:00Z',
        relativeTime: 'Yesterday',
        code: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Incomplete brute force\n        return new int[] { 0, 1 };\n    }\n}`,
      },
      {
        id: 'sub-872',
        problemId: Number(problemId),
        problemTitle: 'Two Sum',
        problemSlug: 'two-sum',
        status: 'Accepted',
        language: 'Python3',
        runtime: '38 ms',
        memory: '17.8 MB',
        submittedAt: '2026-10-12T11:45:00Z',
        relativeTime: '3d ago',
        code: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`,
      },
    ];
  },

  /**
   * Judge In-Memory Submissions Tracker for async polling
   */
  _mockSubmissions: new Map(),

  /**
   * POST /api/problems/:id/run
   */
  async runCode({ problemId, lang, code, testcases }) {
    await new Promise((r) => setTimeout(r, 60));
    const submissionId = 'run_' + Math.random().toString(36).substring(2, 9);
    apiClient._mockSubmissions.set(submissionId, {
      id: submissionId,
      problemId,
      lang,
      code,
      testcases: testcases || [],
      isSubmit: false,
      createdAt: Date.now(),
    });
    return { submissionId };
  },

  /**
   * POST /api/problems/:id/submit
   */
  async submitCode({ problemId, lang, code }) {
    await new Promise((r) => setTimeout(r, 60));
    const submissionId = 'sub_' + Math.random().toString(36).substring(2, 9);
    apiClient._mockSubmissions.set(submissionId, {
      id: submissionId,
      problemId,
      lang,
      code,
      isSubmit: true,
      createdAt: Date.now(),
    });
    return { submissionId };
  },

  /**
   * GET /api/submissions/:id
   * Polls submission judge status with realistic cycle: Queued -> Running -> Accepted/WA
   */
  async getSubmissionStatus(submissionId) {
    await new Promise((r) => setTimeout(r, 80));
    const sub = apiClient._mockSubmissions.get(submissionId);
    const now = Date.now();
    const elapsed = sub ? now - sub.createdAt : 3000;

    // Phase 1: Queued (< 700ms)
    if (elapsed < 700) {
      return {
        submissionId,
        status: 'Queued',
        message: 'In queue...',
        progress: 10,
      };
    }

    // Phase 2: Running (700ms - 1700ms)
    if (elapsed < 1700) {
      const currentCase = elapsed < 1200 ? 1 : 2;
      return {
        submissionId,
        status: 'Running',
        message: `Running testcase ${currentCase} of 3...`,
        progress: Math.min(80, Math.floor((elapsed / 1700) * 100)),
      };
    }

    // Phase 3: Final evaluation result
    const code = (sub?.code || '').trim();

    // Syntax / compile error check
    if (code.includes('syntax_error') || code.includes('compile_error')) {
      return {
        submissionId,
        status: 'Compile Error',
        compileError: 'Line 5: Char 12: error: expected \';\' before \'}\' token\n    5 |     return {}\n      |            ^',
        errorLine: 5,
        passedCases: 0,
        totalCases: 3,
      };
    }

    // Runtime error check
    if (code.includes('throw') || code.includes('runtime_error')) {
      return {
        submissionId,
        status: 'Runtime Error',
        runtimeError: 'Line 8: Error: Vector out of range\n    at Solution.twoSum (solution.cpp:8:14)',
        errorLine: 8,
        passedCases: 1,
        totalCases: 3,
      };
    }

    // Wrong Answer check (if code returns empty or does not solve)
    if (code.includes('return {}') || code.includes('return []') || code.includes('return nil') || code.length < 40) {
      return {
        submissionId,
        status: 'Wrong Answer',
        passedCases: 0,
        totalCases: sub?.isSubmit ? 42 : 3,
        failingCase: {
          id: 'case-1',
          input: 'nums = [2,7,11,15], target = 9',
          expectedOutput: '[0,1]',
          actualOutput: '[]',
          stdout: '',
        },
        testResults: [
          {
            id: 'case-1',
            input: 'nums = [2,7,11,15], target = 9',
            expectedOutput: '[0,1]',
            actualOutput: '[]',
            isPassed: false,
            stdout: '',
          },
          {
            id: 'case-2',
            input: 'nums = [3,2,4], target = 6',
            expectedOutput: '[1,2]',
            actualOutput: '[]',
            isPassed: false,
            stdout: '',
          },
        ],
      };
    }

    // Accepted Success
    return {
      submissionId,
      status: 'Accepted',
      passedCases: sub?.isSubmit ? 42 : 3,
      totalCases: sub?.isSubmit ? 42 : 3,
      runtime: '4 ms',
      memory: '10.4 MB',
      runtimePercentile: 94.6,
      memoryPercentile: 83.2,
      stdout: sub?.code.includes('console.log') || sub?.code.includes('print') ? 'Processed elements: 4\nFound pair: 0, 1' : '',
      testResults: [
        {
          id: 'case-1',
          input: 'nums = [2,7,11,15], target = 9',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          isPassed: true,
          stdout: '',
        },
        {
          id: 'case-2',
          input: 'nums = [3,2,4], target = 6',
          expectedOutput: '[1,2]',
          actualOutput: '[1,2]',
          isPassed: true,
          stdout: '',
        },
        {
          id: 'case-3',
          input: 'nums = [3,3], target = 6',
          expectedOutput: '[0,1]',
          actualOutput: '[0,1]',
          isPassed: true,
          stdout: '',
        },
      ],
    };
  },

  /**
   * POST /api/problems/:id/vote
   */
  async voteProblem(problemId, type) {
    await new Promise((r) => setTimeout(r, 40));
    const key = `codekro_vote_${problemId}`;
    let votes = { likes: 14250, dislikes: 820, userVote: null };
    try {
      const stored = localStorage.getItem(key);
      if (stored) votes = JSON.parse(stored);
    } catch {
      // fallback
    }

    if (votes.userVote === type) {
      // Cancel vote
      if (type === 'like') votes.likes -= 1;
      if (type === 'dislike') votes.dislikes -= 1;
      votes.userVote = null;
    } else {
      // Switch vote
      if (votes.userVote === 'like') votes.likes -= 1;
      if (votes.userVote === 'dislike') votes.dislikes -= 1;

      if (type === 'like') votes.likes += 1;
      if (type === 'dislike') votes.dislikes += 1;
      votes.userVote = type;
    }

    try {
      localStorage.setItem(key, JSON.stringify(votes));
    } catch {
      // ignore
    }
    return votes;
  },
};

