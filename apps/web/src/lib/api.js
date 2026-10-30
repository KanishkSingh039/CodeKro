/**
 * CodeKro API Client & Services Adapter
 * Configured for seamless microservices integration (Auth, Problem, Execution)
 * with robust error handling, token management, and complete mock fallback engine.
 */

// Central Microservices & API Gateway Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_API_BASE_URL || '',
  AUTH_SERVICE_URL:
    import.meta.env?.VITE_AUTH_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    'http://localhost:3011',
  PROBLEM_SERVICE_URL:
    import.meta.env?.VITE_PROBLEM_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    'http://localhost:5000',
  EXECUTION_SERVICE_URL:
    import.meta.env?.VITE_EXECUTION_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    'http://localhost:4000',

  // Toggle mock vs real backend API. Set VITE_USE_MOCK_API='false' to target live backend.
  USE_MOCK: import.meta.env?.VITE_USE_MOCK_API !== 'false',
  TIMEOUT_MS: 15000,
};

// Known backend microservice endpoint patterns
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    HEALTH: '/auth/health',
  },
  PROBLEM: {
    FETCH_ALL: '/problem/fetchProblem',
    AI_SERVICE: '/problem/AI_service',
    HEALTH: '/problem/health',
  },
  EXECUTION: {
    EXECUTE: '/execution/service',
    HEALTH: '/execution/health',
  },
};

// Auth Token Management
export const TOKEN_STORAGE_KEY = 'codekro_auth_token';

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore in restricted environments
  }
};

export const clearAuthToken = () => setAuthToken(null);

// Normalized API Error Class
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal HTTP Request Helper with auth token injection, timeout, and response normalization
 * @param {string} url - Target URL or endpoint
 * @param {RequestInit & { params?: Record<string, any>, timeout?: number }} [options]
 * @returns {Promise<any>}
 */
export async function request(url, options = {}) {
  const { params, timeout = API_CONFIG.TIMEOUT_MS, headers = {}, ...fetchOptions } = options;

  let fullUrl = url;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    if (qs) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
    }
  }

  const token = getAuthToken();
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: requestHeaders,
      signal: controller.signal,
      body:
        fetchOptions.body &&
        typeof fetchOptions.body === 'object' &&
        !(fetchOptions.body instanceof FormData)
          ? JSON.stringify(fetchOptions.body)
          : fetchOptions.body,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        (typeof responseData === 'object' && (responseData?.message || responseData?.error)) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(message, response.status, responseData);
    }

    return responseData;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network request failed', 0, err);
  }
}


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
  // Config & Client Utilities
  config: API_CONFIG,
  request,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getCurrentUserId() {
    try {
      return localStorage.getItem('codekro_user_id') || 'usr_kanishk01';
    } catch {
      return 'usr_kanishk01';
    }
  },

  /**
   * Auth: Login user
   * Ready for real backend API: POST /auth/login
   */
  async login(credentials) {
    if (!API_CONFIG.USE_MOCK) {
      const data = await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        body: {
          email: credentials?.email,
          password: credentials?.password,
        },
      });
      if (data?.token) {
        setAuthToken(data.token);
      }
      return data;
    }
    console.info('[apiClient] login:', { email: credentials?.email });
    return Promise.resolve({ success: true, message: 'Ready for integration' });
  },

  /**
   * Auth: Register user
   * Ready for real backend API: POST /auth/register
   */
  async register(data) {
    if (!API_CONFIG.USE_MOCK) {
      const res = await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        body: {
          name: data?.name,
          username: data?.username,
          email: data?.email,
          password: data?.password,
        },
      });
      return res;
    }
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

    if (!API_CONFIG.USE_MOCK) {
      try {
        const res = await request(`${API_CONFIG.PROBLEM_SERVICE_URL}${ENDPOINTS.PROBLEM.FETCH_ALL}`, {
          method: 'POST',
          body: {
            user_id: apiClient.getCurrentUserId(),
            ...params,
          },
        });
        if (res?.Problem || res?.getProblemFromDB) {
          const list = res.Problem || res.getProblemFromDB || [];
          return {
            problems: Array.isArray(list) ? list : [],
            total: Array.isArray(list) ? list.length : 0,
            page,
            totalPages: Math.ceil((Array.isArray(list) ? list.length : 1) / limit),
          };
        }
      } catch (err) {
        console.warn('[apiClient] getProblems failed, falling back to mock:', err);
      }
    }

    await new Promise((r) => setTimeout(r, 90));

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
    if (!API_CONFIG.USE_MOCK) {
      try {
        const fetched = await request(`${API_CONFIG.PROBLEM_SERVICE_URL}/problem/${slug}`);
        if (fetched && (fetched.title || fetched.id)) {
          return {
            ...fetched,
            isBookmarked: userBookmarks.has(fetched.id),
            starterCode: fetched.starterCode || { cpp: '', java: '', python: '', javascript: '', go: '' },
          };
        }
      } catch (err) {
        console.warn(`[apiClient] getProblemBySlug(${slug}) API error, using mock fallback:`, err);
      }
    }

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

    // Starter code initialized to empty strings ("") ready for user code or API response
    const starterCode = {
      'cpp': '',
      'java': '',
      'python': '',
      'javascript': '',
      'go': '',
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
    if (!API_CONFIG.USE_MOCK) {
      try {
        return await request(`${API_CONFIG.PROBLEM_SERVICE_URL}/problem/${problemId}/starter-code`, {
          params: { lang },
        });
      } catch {
        // Fallback to local problem
      }
    }
    await new Promise((r) => setTimeout(r, 40));
    const problem = await apiClient.getProblemBySlug(String(problemId));
    return {
      problemId: Number(problemId),
      lang,
      code: problem?.starterCode?.[lang] ?? '',
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
   * Integrates with POST /execution/service
   */
  async runCode({ problemId, lang, code, testcases }) {
    if (!API_CONFIG.USE_MOCK) {
      const queued = await request(`${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}`, {
        method: 'POST',
        body: {
          user_id: apiClient.getCurrentUserId(),
          problem_id: problemId,
          code,
          language: lang,
          input: testcases?.[0]?.input || '',
          test_case: testcases,
        },
      });
      return { ...queued, submissionId: queued.job_id };
    }
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
   * Integrates with POST /execution/service
   */
  async submitCode({ problemId, lang, code }) {
    if (!API_CONFIG.USE_MOCK) {
      const queued = await request(`${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}`, {
        method: 'POST',
        body: {
          user_id: apiClient.getCurrentUserId(),
          problem_id: problemId,
          code,
          language: lang,
          input: '',
          test_case: [],
        },
      });
      return { ...queued, submissionId: queued.job_id };
    }
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
    if (!API_CONFIG.USE_MOCK) {
      const data = await request(`${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}/${submissionId}`);
      const state = data.state;

      if (state === 'waiting' || state === 'delayed' || state === 'prioritized') {
        return { submissionId, status: 'Queued', message: 'In queue...', progress: 10 };
      }
      if (state === 'active') {
        return { submissionId, status: 'Running', message: 'Running test cases...', progress: 50 };
      }
      if (state === 'failed') {
        return {
          submissionId,
          status: 'Runtime Error',
          runtimeError: data.error || 'Execution failed',
          passedCases: 0,
          totalCases: 0,
        };
      }
      if (state !== 'completed') {
        return {
          submissionId,
          status: 'Runtime Error',
          runtimeError: 'Execution state unavailable',
          passedCases: 0,
          totalCases: 0,
        };
      }

      const result = data.result || {};
      const judgement = result.judgement && typeof result.judgement === 'object' ? result.judgement : {};
      const verdict = judgement.verdict || 'UNKNOWN';
      const statusByVerdict = {
        ACCEPTED: 'Accepted',
        WRONG_ANSWER: 'Wrong Answer',
        TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
        MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
        RUNTIME_ERROR: 'Runtime Error',
        COMPILATION_ERROR: 'Compile Error',
      };
      const score = judgement.score || {};
      const testResults = Array.isArray(judgement.testCases)
        ? judgement.testCases.map((testCase, index) => ({
            id: `case-${index + 1}`,
            input: '',
            expectedOutput: '',
            actualOutput: '',
            isPassed: Boolean(testCase.passed),
            stdout: '',
          }))
        : [];

      return {
        submissionId,
        status: statusByVerdict[verdict] || 'Unknown',
        passedCases: score.passed ?? 0,
        totalCases: score.total ?? 0,
        stdout: result.output || '',
        compileError: verdict === 'COMPILATION_ERROR' ? result.error || 'Compilation failed' : undefined,
        runtimeError: verdict === 'RUNTIME_ERROR' ? result.error || 'Runtime error' : undefined,
        testResults,
      };
    }

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

  /**
   * Profile & Settings in-memory data store with localStorage sync
   */
  _mockProfiles: {
    kanishk: {
      id: 'usr_kanishk01',
      username: 'kanishk',
      name: 'Kanishk Singh',
      email: 'kanishk@codekro.dev',
      avatarUrl: '',
      bio: 'Algorithms engineer building fast competitive coding workspaces.',
      location: 'Bangalore, India',
      organization: 'CodeKro Engineering',
      website: 'https://kanishksingh.dev',
      github: 'KanishkSingh039',
      linkedin: 'https://linkedin.com/in/kanishk-singh',
      globalRank: 14290,
      contestRating: 1842,
      reputation: 340,
      followersCount: 128,
      followingCount: 42,
      joinedDate: 'January 2024',
      lastActive: 'Today',
      isOwner: true,
      isPrivate: false,
      skills: [
        { topic: 'Array', count: 82 },
        { topic: 'Hash Table', count: 64 },
        { topic: 'Dynamic Programming', count: 42 },
        { topic: 'Two Pointers', count: 38 },
        { topic: 'Tree', count: 29 },
        { topic: 'String', count: 26 },
        { topic: 'Binary Search', count: 21 },
        { topic: 'Graph', count: 18 },
      ],
      languages: [
        { language: 'C++', count: 142 },
        { language: 'Python3', count: 88 },
        { language: 'JavaScript', count: 36 },
        { language: 'Go', count: 18 },
      ],
    },
    tourist: {
      id: 'usr_tourist',
      username: 'tourist',
      name: 'Gennady Korotkevich',
      email: '',
      avatarUrl: '',
      bio: 'Competitive programmer. Multiple ACM-ICPC and Google Code Jam champion.',
      location: 'Gomel, Belarus',
      organization: 'ITMO University',
      website: 'https://codeforces.com/profile/tourist',
      github: 'tourist',
      linkedin: '',
      globalRank: 1,
      contestRating: 3842,
      reputation: 19400,
      followersCount: 15420,
      followingCount: 12,
      joinedDate: 'March 2022',
      lastActive: '2 hours ago',
      isOwner: false,
      isPrivate: false,
      skills: [
        { topic: 'Dynamic Programming', count: 450 },
        { topic: 'Graph', count: 390 },
        { topic: 'Data Structures', count: 340 },
        { topic: 'Math', count: 310 },
        { topic: 'Tree', count: 280 },
      ],
      languages: [
        { language: 'C++', count: 2200 },
        { language: 'Java', count: 180 },
        { language: 'Python3', count: 40 },
      ],
    },
    private_dev: {
      id: 'usr_privatedev',
      username: 'private_dev',
      name: 'Private Developer',
      email: '',
      avatarUrl: '',
      bio: 'Stealth developer practicing coding privately.',
      location: 'Remote',
      organization: 'Stealth Corp',
      website: '',
      github: '',
      linkedin: '',
      globalRank: 42100,
      contestRating: 1540,
      reputation: 80,
      followersCount: 4,
      followingCount: 1,
      joinedDate: 'June 2024',
      lastActive: '3 days ago',
      isOwner: false,
      isPrivate: true,
      skills: [],
      languages: [],
    },
  },

  _mockPreferences: {
    defaultLanguage: 'cpp',
    editorFontSize: 14,
    tabSize: 4,
    keybindings: 'default',
    theme: 'dark',
    timezone: 'Asia/Kolkata',
  },

  _mockPrivacy: {
    publicProfile: true,
    showHeatmap: true,
    showSubmissions: true,
    showSolved: true,
    showContests: true,
  },

  _mockNotifications: {
    contestReminders: true,
    dailyProblem: true,
    submissionFeedback: true,
    productUpdates: false,
  },

  /**
   * GET /api/users/:username
   */
  async getUserProfile(username) {
    await new Promise((r) => setTimeout(r, 70));
    const normalized = (username || '').toLowerCase();
    const currentSessionUser = 'kanishk';

    // Check if edited profile exists in localStorage
    let stored = null;
    try {
      const raw = localStorage.getItem(`codekro_profile_${normalized}`);
      if (raw) stored = JSON.parse(raw);
    } catch {
      // ignore
    }

    const base = stored || apiClient._mockProfiles[normalized];

    if (!base) {
      const err = new Error(`User "${username}" not found`);
      err.status = 404;
      throw err;
    }

    return {
      ...base,
      isOwner: normalized === currentSessionUser,
    };
  },

  /**
   * GET /api/users/:username/badges
   */
  async getUserBadges(_username) {
    await new Promise((r) => setTimeout(r, 50));
    return [
      {
        id: 'badge-50-days',
        name: '50 Days Badge 2024',
        description: 'Solved at least one problem for 50 distinct calendar days in 2024.',
        criteria: '50 active days in 2024',
        earnedDate: '2024-04-18',
        progress: 50,
        maxProgress: 50,
        category: 'streak',
      },
      {
        id: 'badge-100-days',
        name: '100 Days Badge 2024',
        description: 'Solved at least one problem for 100 distinct calendar days in 2024.',
        criteria: '100 active days in 2024',
        earnedDate: '2024-08-25',
        progress: 100,
        maxProgress: 100,
        category: 'streak',
      },
      {
        id: 'badge-knight',
        name: 'Knight Rating',
        description: 'Achieved contest rating equal to or above 1850.',
        criteria: 'Rating >= 1850 in Rated Contests',
        earnedDate: null,
        progress: 1842,
        maxProgress: 1850,
        category: 'contest',
      },
      {
        id: 'badge-dp-master',
        name: 'Dynamic Programming Specialist',
        description: 'Solved 50 Medium or Hard Dynamic Programming challenges.',
        criteria: '50 DP problems solved',
        earnedDate: null,
        progress: 42,
        maxProgress: 50,
        category: 'skill',
      },
      {
        id: 'badge-first-contest',
        name: 'Contest Pioneer',
        description: 'Participated and scored in first rated contest.',
        criteria: 'Participate in 1 rated contest',
        earnedDate: '2024-02-14',
        progress: 1,
        maxProgress: 1,
        category: 'contest',
      },
    ];
  },

  /**
   * GET /api/users/:username/contests
   */
  async getUserContests(_username) {
    await new Promise((r) => setTimeout(r, 60));
    return {
      currentRating: 1842,
      maxRating: 1890,
      globalRank: 4210,
      totalContests: 14,
      history: [
        { id: 'c-390', contestName: 'Weekly Contest 390', rank: 1420, ratingChange: 28, newRating: 1680, date: '2024-03-24' },
        { id: 'c-393', contestName: 'Weekly Contest 393', rank: 940, ratingChange: 42, newRating: 1722, date: '2024-04-14' },
        { id: 'c-128', contestName: 'Biweekly Contest 128', rank: 1100, ratingChange: -12, newRating: 1710, date: '2024-04-27' },
        { id: 'c-398', contestName: 'Weekly Contest 398', rank: 680, ratingChange: 54, newRating: 1764, date: '2024-05-19' },
        { id: 'c-131', contestName: 'Biweekly Contest 131', rank: 810, ratingChange: 32, newRating: 1796, date: '2024-06-08' },
        { id: 'c-402', contestName: 'Weekly Contest 402', rank: 540, ratingChange: 46, newRating: 1842, date: '2024-06-30' },
        { id: 'c-405', contestName: 'Weekly Contest 405', rank: 410, ratingChange: 48, newRating: 1890, date: '2024-07-21' },
        { id: 'c-134', contestName: 'Biweekly Contest 134', rank: 920, ratingChange: -48, newRating: 1842, date: '2024-08-03' },
      ],
    };
  },

  /**
   * GET /api/users/:username/solved?filters
   */
  async getUserSolved(_username, filters = {}) {
    await new Promise((r) => setTimeout(r, 60));
    const { difficulty = 'all', tag = 'all', lang = 'all' } = filters;

    let solved = rawProblems.filter((p) => p.status === 'solved').map((p) => ({
      id: p.id,
      frontendQuestionId: p.frontendQuestionId,
      title: p.title,
      titleSlug: p.titleSlug,
      difficulty: p.difficulty,
      topicTags: p.topicTags,
      language: p.id % 2 === 0 ? 'C++' : 'Python3',
      firstSolvedDate: '2024-05-12',
    }));

    if (difficulty !== 'all') {
      solved = solved.filter((s) => s.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (tag !== 'all') {
      solved = solved.filter((s) => s.topicTags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }
    if (lang !== 'all') {
      solved = solved.filter((s) => s.language.toLowerCase() === lang.toLowerCase());
    }

    return solved;
  },

  /**
   * GET /api/users/:username/submissions?page&limit
   */
  async getUserSubmissions(_username, page = 1, limit = 20) {
    await new Promise((r) => setTimeout(r, 60));
    // Full recent list of submissions with AI-evaluated note
    const baseList = [
      { id: 'sub-101', problemTitle: 'Two Sum', problemSlug: 'two-sum', status: 'Accepted', language: 'C++', relativeTime: '18m ago', submittedAt: '2026-10-18T00:10:00Z', isAiEvaluated: true },
      { id: 'sub-102', problemTitle: 'Trapping Rain Water', problemSlug: 'trapping-rain-water', status: 'Time Limit Exceeded', language: 'Python3', relativeTime: '2h ago', submittedAt: '2026-10-17T22:30:00Z', isAiEvaluated: true },
      { id: 'sub-103', problemTitle: 'Reverse Linked List', problemSlug: 'reverse-linked-list', status: 'Accepted', language: 'Go', relativeTime: '5h ago', submittedAt: '2026-10-17T19:00:00Z', isAiEvaluated: true },
      { id: 'sub-104', problemTitle: '3Sum', problemSlug: '3sum', status: 'Wrong Answer', language: 'Java', relativeTime: 'Yesterday', submittedAt: '2026-10-16T15:20:00Z', isAiEvaluated: true },
      { id: 'sub-105', problemTitle: 'LRU Cache', problemSlug: 'lru-cache', status: 'Accepted', language: 'C++', relativeTime: '2d ago', submittedAt: '2026-10-15T12:00:00Z', isAiEvaluated: true },
      { id: 'sub-106', problemTitle: 'Valid Parentheses', problemSlug: 'valid-parentheses', status: 'Accepted', language: 'C++', relativeTime: '3d ago', submittedAt: '2026-10-14T09:40:00Z', isAiEvaluated: true },
      { id: 'sub-107', problemTitle: 'Merge Two Sorted Lists', problemSlug: 'merge-two-sorted-lists', status: 'Accepted', language: 'Python3', relativeTime: '4d ago', submittedAt: '2026-10-13T17:15:00Z', isAiEvaluated: true },
      { id: 'sub-108', problemTitle: 'Search in Rotated Sorted Array', problemSlug: 'search-in-rotated-sorted-array', status: 'Accepted', language: 'C++', relativeTime: '5d ago', submittedAt: '2026-10-12T11:20:00Z', isAiEvaluated: true },
      { id: 'sub-109', problemTitle: 'Group Anagrams', problemSlug: 'group-anagrams', status: 'Accepted', language: 'Python3', relativeTime: '6d ago', submittedAt: '2026-10-11T14:00:00Z', isAiEvaluated: true },
      { id: 'sub-110', problemTitle: 'Maximum Subarray', problemSlug: 'maximum-subarray', status: 'Accepted', language: 'C++', relativeTime: '1w ago', submittedAt: '2026-10-10T16:50:00Z', isAiEvaluated: true },
      { id: 'sub-111', problemTitle: 'Binary Tree Level Order Traversal', problemSlug: 'binary-tree-level-order-traversal', status: 'Accepted', language: 'Java', relativeTime: '1w ago', submittedAt: '2026-10-09T18:30:00Z', isAiEvaluated: true },
      { id: 'sub-112', problemTitle: 'Climbing Stairs', problemSlug: 'climbing-stairs', status: 'Accepted', language: 'C++', relativeTime: '1w ago', submittedAt: '2026-10-08T08:15:00Z', isAiEvaluated: true },
      { id: 'sub-113', problemTitle: 'Container With Most Water', problemSlug: 'container-with-most-water', status: 'Accepted', language: 'C++', relativeTime: '1w ago', submittedAt: '2026-10-07T13:45:00Z', isAiEvaluated: true },
      { id: 'sub-114', problemTitle: 'Best Time to Buy and Sell Stock', problemSlug: 'best-time-to-buy-and-sell-stock', status: 'Accepted', language: 'Python3', relativeTime: '2w ago', submittedAt: '2026-10-04T10:00:00Z', isAiEvaluated: true },
      { id: 'sub-115', problemTitle: 'Word Break', problemSlug: 'word-break', status: 'Wrong Answer', language: 'C++', relativeTime: '2w ago', submittedAt: '2026-10-03T11:20:00Z', isAiEvaluated: true },
      { id: 'sub-116', problemTitle: 'Product of Array Except Self', problemSlug: 'product-of-array-except-self', status: 'Accepted', language: 'Go', relativeTime: '2w ago', submittedAt: '2026-10-02T14:10:00Z', isAiEvaluated: true },
      { id: 'sub-117', problemTitle: 'Coin Change', problemSlug: 'coin-change', status: 'Accepted', language: 'C++', relativeTime: '2w ago', submittedAt: '2026-10-01T20:30:00Z', isAiEvaluated: true },
      { id: 'sub-118', problemTitle: 'Top K Frequent Elements', problemSlug: 'top-k-frequent-elements', status: 'Accepted', language: 'Python3', relativeTime: '3w ago', submittedAt: '2026-09-28T19:00:00Z', isAiEvaluated: true },
      { id: 'sub-119', problemTitle: 'Number of Islands', problemSlug: 'number-of-islands', status: 'Accepted', language: 'C++', relativeTime: '3w ago', submittedAt: '2026-09-26T16:20:00Z', isAiEvaluated: true },
      { id: 'sub-120', problemTitle: 'Course Schedule', problemSlug: 'course-schedule', status: 'Runtime Error', language: 'Java', relativeTime: '3w ago', submittedAt: '2026-09-25T15:00:00Z', isAiEvaluated: true },
      { id: 'sub-121', problemTitle: 'Longest Consecutive Sequence', problemSlug: 'longest-consecutive-sequence', status: 'Accepted', language: 'C++', relativeTime: '4w ago', submittedAt: '2026-09-20T12:00:00Z', isAiEvaluated: true },
      { id: 'sub-122', problemTitle: 'Kth Largest Element in an Array', problemSlug: 'kth-largest-element-in-an-array', status: 'Accepted', language: 'Python3', relativeTime: '1mo ago', submittedAt: '2026-09-18T10:00:00Z', isAiEvaluated: true },
    ];

    const total = baseList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.min(Math.max(1, Number(page)), totalPages);
    const start = (validPage - 1) * limit;
    const items = baseList.slice(start, start + limit);

    return {
      submissions: items,
      total,
      page: validPage,
      totalPages,
    };
  },

  /**
   * GET /api/users/:username/bookmarks
   */
  async getUserBookmarks(_username) {
    await new Promise((r) => setTimeout(r, 50));
    return rawProblems.filter((p) => userBookmarks.has(p.id));
  },

  /**
   * Settings: GET /api/me/preferences
   */
  async getPreferences() {
    await new Promise((r) => setTimeout(r, 40));
    try {
      const stored = localStorage.getItem('codekro_preferences');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return apiClient._mockPreferences;
  },

  /**
   * Settings: PATCH /api/me/preferences
   */
  async updatePreferences(data) {
    await new Promise((r) => setTimeout(r, 80));
    try {
      localStorage.setItem('codekro_preferences', JSON.stringify(data));
    } catch {
      // ignore
    }
    return { success: true, preferences: data };
  },

  /**
   * Settings: GET /api/me/privacy
   */
  async getPrivacy() {
    await new Promise((r) => setTimeout(r, 40));
    try {
      const stored = localStorage.getItem('codekro_privacy');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return apiClient._mockPrivacy;
  },

  /**
   * Settings: PATCH /api/me/privacy
   */
  async updatePrivacy(data) {
    await new Promise((r) => setTimeout(r, 80));
    try {
      localStorage.setItem('codekro_privacy', JSON.stringify(data));
    } catch {
      // ignore
    }
    return { success: true, privacy: data };
  },

  /**
   * Settings: GET /api/me/notifications
   */
  async getNotifications() {
    await new Promise((r) => setTimeout(r, 40));
    try {
      const stored = localStorage.getItem('codekro_notifications');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return apiClient._mockNotifications;
  },

  /**
   * Settings: PATCH /api/me/notifications
   */
  async updateNotifications(data) {
    await new Promise((r) => setTimeout(r, 80));
    try {
      localStorage.setItem('codekro_notifications', JSON.stringify(data));
    } catch {
      // ignore
    }
    return { success: true, notifications: data };
  },

  /**
   * Settings: PATCH /api/me/profile
   */
  async updateProfile(data) {
    await new Promise((r) => setTimeout(r, 100));
    const current = apiClient._mockProfiles.kanishk;
    const updated = { ...current, ...data };
    apiClient._mockProfiles.kanishk = updated;
    try {
      localStorage.setItem('codekro_profile_kanishk', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return { success: true, profile: updated };
  },

  /**
   * Settings: Check username availability
   */
  async checkUsernameAvailable(username) {
    await new Promise((r) => setTimeout(r, 90));
    const lower = (username || '').toLowerCase();
    const taken = ['tourist', 'admin', 'root', 'codekro', 'system'];
    if (lower === 'kanishk') return { available: true };
    return { available: !taken.includes(lower) };
  },

  /**
   * Settings: POST /api/me/avatar
   */
  async uploadAvatar(fileDataUrl) {
    await new Promise((r) => setTimeout(r, 120));
    return { success: true, avatarUrl: fileDataUrl };
  },

  /**
   * Settings: POST /api/me/password
   */
  async changePassword(oldPassword, _newPassword) {
    await new Promise((r) => setTimeout(r, 100));
    if (oldPassword === 'wrong') {
      const err = new Error('Current password does not match.');
      throw err;
    }
    return { success: true, message: 'Password updated successfully.' };
  },

  /**
   * Settings: DELETE /api/me
   */
  async deleteAccount(confirmationPhrase) {
    await new Promise((r) => setTimeout(r, 120));
    if (confirmationPhrase !== 'delete my account') {
      const err = new Error('Confirmation phrase is incorrect.');
      throw err;
    }
    return { success: true, message: 'Account deleted.' };
  },

  /**
   * Landing: GET /api/problems?limit=5&featured=true
   */
  async getFeaturedProblems(limit = 5) {
    await new Promise((r) => setTimeout(r, 60));
    return rawProblems.slice(0, limit).map((p) => ({
      id: p.id,
      frontendQuestionId: p.frontendQuestionId,
      title: p.title,
      titleSlug: p.titleSlug,
      difficulty: p.difficulty,
      topicTags: p.topicTags,
      acceptanceRate: p.acceptanceRate,
    }));
  },

  /**
   * Landing: GET /api/contests?upcoming=true&limit=1
   */
  async getUpcomingContest() {
    await new Promise((r) => setTimeout(r, 50));
    const contests = await apiClient.getUpcomingContests();
    return contests.length > 0 ? contests[0] : null;
  },

  /**
   * Landing: GET /api/public/stats
   */
  async getPublicStats() {
    await new Promise((r) => setTimeout(r, 40));
    return {
      totalProblems: rawProblems.length > 0 ? 3120 : 0,
      totalTopics: 18,
      supportedLanguages: 5,
    };
  },
};

export const getFeaturedProblems = (limit) => apiClient.getFeaturedProblems(limit);
export const getUpcomingContest = () => apiClient.getUpcomingContest();
export const getPublicStats = () => apiClient.getPublicStats();

export default apiClient;




