/**
 * CodeKro API Client
 * Backend-only adapter for the Auth, Problem, and Execution services.
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env?.VITE_API_BASE_URL || '',
  AUTH_SERVICE_URL:
    import.meta.env?.VITE_AUTH_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    '',
  PROBLEM_SERVICE_URL:
    import.meta.env?.VITE_PROBLEM_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    '',
  EXECUTION_SERVICE_URL:
    import.meta.env?.VITE_EXECUTION_API_URL ||
    import.meta.env?.VITE_API_BASE_URL ||
    '',
  TIMEOUT_MS: 15000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    HEALTH: '/auth/health',
  },
  PROBLEM: {
    FETCH_ALL: '/problem/fetchProblem',
    AI_SERVICE: '/problem/AI_service',
    BOOKMARK: '/problem/bookmark',
    HEALTH: '/problem/health',
  },
  EXECUTION: {
    EXECUTE: '/execution/service',
    HEALTH: '/execution/health',
  },
};

export const PROFILE_COOKIE_NAME = 'codekro_profile';
export const FRONTEND_RESET_MARKER = 'codekro_frontend_reset_v1';

const LEGACY_STORAGE_PREFIX = 'codekro_';

const readCookie = (name) => {
  try {
    const prefix = `${name}=`;
    const match = document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));

    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
  } catch {
    return null;
  }
};

const toAuthUser = (payload) => {
  if (!payload?.id) return null;

  return {
    id: String(payload.id),
    name: payload.name || payload.username || '',
    username: payload.username || '',
    email: payload.email || '',
    picture: payload.picture || payload.avatarUrl || '',
  };
};

const getCookieAuthUser = () => {
  const rawProfile = readCookie(PROFILE_COOKIE_NAME);
  if (!rawProfile) return null;

  try {
    return toAuthUser(JSON.parse(rawProfile));
  } catch {
    return null;
  }
};

export const getAuthToken = () => null;

export const getAuthUser = () => getCookieAuthUser();

export const setAuthToken = () => {};

const clearProfileCookie = () => {
  try {
    document.cookie = `${PROFILE_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    // Ignore in restricted environments.
  }
};

export const clearAuthToken = () => clearProfileCookie();

export const clearLegacyFrontendData = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(LEGACY_STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
  } catch {
    // Ignore in restricted environments.
  }
};

export const resetFrontendData = async () => {
  try {
    await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      timeout: 2000,
    });
  } catch {
    // The local reset still proceeds when the service is unavailable.
  }

  clearProfileCookie();
  clearLegacyFrontendData();

  try {
    localStorage.setItem(FRONTEND_RESET_MARKER, 'true');
  } catch {
    // Ignore in restricted environments.
  }
};

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(url, options = {}) {
  const {
    params,
    timeout = API_CONFIG.TIMEOUT_MS,
    headers = {},
    credentials = 'include',
    ...fetchOptions
  } = options;

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

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      credentials,
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

let authSessionPromise = null;

export const hydrateAuthSession = () => {
  const cookieUser = getCookieAuthUser();
  if (authSessionPromise) return authSessionPromise;

  const sessionPromise = (async () => {
    try {
      const res = await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.ME}`, {
        method: 'GET',
      });
      return toAuthUser(res?.user || res);
    } catch (error) {
      if (error?.status === 401 || error?.status === 404) {
        clearProfileCookie();
        return null;
      }
      return cookieUser;
    }
  })();

  authSessionPromise = sessionPromise;
  sessionPromise.finally(() => {
    if (authSessionPromise === sessionPromise) authSessionPromise = null;
  });

  return sessionPromise;
};

export const logout = async () => {
  try {
    await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
    });
  } finally {
    clearProfileCookie();
  }
};

const slugifyTitle = (title) =>
  String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatValue = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const normalizeProblem = (problem, index) => {
  const title = problem?.title || 'Untitled Problem';
  const id = problem?.id ?? problem?._id ?? `problem-${index + 1}`;
  const difficulty = String(problem?.difficulty || 'medium').toLowerCase();
  const acceptanceRate = Number(problem?.acceptanceRate);
  const frequency = Number(problem?.frequency);
  const rawTestCases = Array.isArray(problem?.test_case) ? problem.test_case : [];
  const rawExamples = Array.isArray(problem?.examples) ? problem.examples : [];

  const testCases = rawTestCases.map((testCase, testIndex) => ({
    id: `case-${testIndex + 1}`,
    input: formatValue(testCase?.input),
    expectedOutput: formatValue(testCase?.output ?? testCase?.expectedOutput),
    actualOutput: '',
    isPassed: null,
  }));
  const examples = rawExamples.length > 0
    ? rawExamples.map((example, exampleIndex) => ({
        id: example?.id ?? exampleIndex + 1,
        input: formatValue(example?.input),
        output: formatValue(example?.output ?? example?.expectedOutput),
        explanation: example?.explanation || '',
      }))
    : testCases.map((testCase, testIndex) => ({
        id: testIndex + 1,
        input: testCase.input,
        output: testCase.expectedOutput,
        explanation: '',
      }));
  return {
    ...problem,
    id,
    frontendQuestionId: problem?.frontendQuestionId ?? problem?.questionId ?? index + 1,
    title,
    titleSlug: problem?.titleSlug || slugifyTitle(title),
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    acceptanceRate: Number.isFinite(acceptanceRate) ? acceptanceRate : null,
    status: problem?.submitted ? 'solved' : problem?.status || 'todo',
    submitted: Boolean(problem?.submitted),
    frequency: Number.isFinite(frequency) ? frequency : null,
    topicTags: Array.isArray(problem?.topicTags) ? problem.topicTags : [],
    companies: Array.isArray(problem?.companies) ? problem.companies : [],
    testCases,
    examples,
    constraints: Array.isArray(problem?.constraints) ? problem.constraints : [],
    hints: Array.isArray(problem?.hints) ? problem.hints : [],
    editorial: Array.isArray(problem?.editorial) ? problem.editorial : [],
    solutions: Array.isArray(problem?.solutions) ? problem.solutions : [],
    starterCode:
      problem?.starterCode && typeof problem.starterCode === 'object'
        ? problem.starterCode
        : {},
    likes: Number(problem?.likes) || 0,
    dislikes: Number(problem?.dislikes) || 0,
    userVote: null,
    isBookmarked: Boolean(problem?.bookmarked),
    isEditorialLocked: false,
    description: problem?.description || '',
  };
};

export const apiClient = {
  config: API_CONFIG,
  request,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  hydrateSession: hydrateAuthSession,
  logout,
  getCurrentUserId() {
    return getAuthUser()?.id || '';
  },
  getCurrentUsername() {
    const user = getAuthUser();
    return user?.username || user?.email?.split('@')[0] || '';
  },

  async login(credentials) {
    const data = await request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      body: {
        email: credentials?.email,
        password: credentials?.password,
      },
    });
    await hydrateAuthSession();
    return data;
  },

  async register(data) {
    return request(`${API_CONFIG.AUTH_SERVICE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      body: {
        name: data?.name,
        username: data?.username,
        email: data?.email,
        password: data?.password,
      },
    });
  },

  async getMe() {
    const authUser = await hydrateAuthSession();
    if (!authUser?.id) return null;

    return {
      id: authUser.id,
      username: authUser.username || authUser.email?.split('@')[0] || '',
      name: authUser.name || authUser.username || '',
      email: authUser.email || '',
      avatarUrl: authUser.picture || '',
      lastAttemptedProblem: null,
    };
  },

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
      actiontype = 'all',
    } = params;

    let authUser = getAuthUser();
    if (!authUser?.id) {
      authUser = await hydrateAuthSession();
    }

    if (!authUser?.id) {
      throw new ApiError('Sign in required to load problems.', 401);
    }

    let sourceProblems = [];

    try {
      const res = await request(`${API_CONFIG.PROBLEM_SERVICE_URL}${ENDPOINTS.PROBLEM.FETCH_ALL}`, {
        method: 'POST',
        body: { actiontype: actiontype === 'submitted' ? 'submitted' : 'all' },
      });

      const list = Array.isArray(res)
        ? res
        : res?.problem ?? res?.problems ?? res?.Problem ?? res?.getProblemFromDB;

      if (!Array.isArray(list)) {
        throw new ApiError('Unexpected problem response from backend.', 502, res);
      }

      sourceProblems = list.map((problem, index) => normalizeProblem(problem, index));
    } catch (err) {
      if (err?.status === 404) {
        return { problems: [], total: 0, page: 1, totalPages: 1, limit };
      }
      throw err;
    }

    let filtered = sourceProblems;

    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(search) ||
          String(problem.frontendQuestionId).includes(search)
      );
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(
        (problem) => problem.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(
        (problem) => problem.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (tag && tag !== 'all') {
      filtered = filtered.filter((problem) =>
        problem.topicTags.some((item) => item.toLowerCase() === tag.toLowerCase())
      );
    }

    if (company && company !== 'all') {
      filtered = filtered.filter((problem) =>
        problem.companies.some((item) => item.toLowerCase() === company.toLowerCase())
      );
    }

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

  async generateProblem(service) {
    const requestText = String(service || '').trim();
    if (!requestText) {
      throw new ApiError('Describe the problem you want to generate.', 400);
    }

    const data = await request(
      `${API_CONFIG.PROBLEM_SERVICE_URL}${ENDPOINTS.PROBLEM.AI_SERVICE}`,
      {
        method: 'POST',
        body: { service: requestText },
      }
    );
    const jobId = data?.job_id ?? data?.jobId;

    if (jobId === undefined || jobId === null) {
      throw new ApiError('Problem generation did not return a job id.', 502, data);
    }

    return { ...data, jobId: String(jobId) };
  },

  async getProblemGenerationStatus(jobId) {
    if (!jobId) {
      throw new ApiError('A generation job id is required.', 400);
    }

    const data = await request(
      `${API_CONFIG.PROBLEM_SERVICE_URL}${ENDPOINTS.PROBLEM.AI_SERVICE}/${encodeURIComponent(jobId)}`
    );

    return {
      ...data,
      jobId: String(data?.job_id ?? jobId),
      state: String(data?.state || '').toLowerCase(),
      problem: data?.problem ? normalizeProblem(data.problem, 0) : null,
    };
  },

  async getUserStats() {
    return {
      totalSolved: 0,
      totalProblems: 0,
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
      acceptanceRate: 0,
      globalRanking: 0,
    };
  },

  async getUserActivity() {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      heatmap: [],
    };
  },

  async getDailyProblem() {
    return {
      date: new Date().toISOString().split('T')[0],
      timeRemainingSeconds: 0,
      problem: null,
    };
  },

  async getUpcomingContests() {
    return [];
  },

  async getRecentSubmissions() {
    return [];
  },

  async toggleBookmark(problemId, bookmarked) {
    if (!problemId) {
      throw new ApiError('A problem id is required to update the bookmark.', 400);
    }

    return request(
      `${API_CONFIG.PROBLEM_SERVICE_URL}${ENDPOINTS.PROBLEM.BOOKMARK}/${encodeURIComponent(problemId)}`,
      {
        method: 'PATCH',
        body: { bookmarked: Boolean(bookmarked) },
      }
    );
  },

  async getProblemBySlug(slug) {
    const data = await apiClient.getProblems({ page: 1, limit: 100 });
    const normalizedSlug = decodeURIComponent(String(slug || '')).toLowerCase();

    const problem = data.problems.find(
      (item) =>
        item.titleSlug.toLowerCase() === normalizedSlug ||
        String(item.id) === normalizedSlug ||
        String(item.frontendQuestionId) === normalizedSlug
    );

    if (!problem) {
      throw new ApiError(`Problem "${slug}" not found`, 404);
    }

    return {
      ...problem,
      description: problem.description || '',
      examples: problem.examples || [],
      constraints: problem.constraints || [],
      hints: problem.hints || [],
      editorial: problem.editorial || [],
      solutions: problem.solutions || [],
      starterCode: problem.starterCode || {},
      testCases: problem.testCases || [],
      likes: problem.likes || 0,
      dislikes: problem.dislikes || 0,
      userVote: null,
      isEditorialLocked: false,
    };
  },

  async getStarterCode(problemId, lang = 'cpp') {
    return {
      problemId,
      lang,
      code: '',
    };
  },

  async getProblemSubmissions() {
    return [];
  },

  async runCode({ problemId, lang, code, testcases }) {
    const queued = await request(
      `${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}`,
      {
        method: 'POST',
        body: {
          problem_id: problemId,
          code,
          language: lang,
          input: testcases?.[0]?.input || '',
          test_case: testcases,
        },
      }
    );
    return { ...queued, submissionId: queued.job_id };
  },

  async submitCode({ problemId, lang, code, testcases }) {
    const queued = await request(
      `${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}`,
      {
        method: 'POST',
        body: {
          problem_id: problemId,
          code,
          language: lang,
          input: testcases?.[0]?.input ?? '',
          test_case: testcases ?? [],
        },
      }
    );
    return { ...queued, submissionId: queued.job_id };
  },

  async getSubmissionStatus(submissionId) {
    const data = await request(
      `${API_CONFIG.EXECUTION_SERVICE_URL}${ENDPOINTS.EXECUTION.EXECUTE}/${submissionId}`
    );
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
          input: typeof testCase.input === 'object' ? JSON.stringify(testCase.input) : String(testCase.input ?? ''),
          expectedOutput: typeof testCase.expectedOutput === 'object' ? JSON.stringify(testCase.expectedOutput) : String(testCase.expectedOutput ?? ''),
          actualOutput: String(testCase.actualOutput ?? result.output ?? ''),
          isPassed: Boolean(testCase.passed),
          stdout: result.output || '',
        }))
      : [];

    return {
      submissionId,
      status: statusByVerdict[verdict] || 'Unknown',
      passedCases: score.passed ?? 0,
      totalCases: score.total ?? 0,
      stdout: result.output || '',
      compileError:
        verdict === 'COMPILATION_ERROR' ? result.error || 'Compilation failed' : undefined,
      runtimeError: verdict === 'RUNTIME_ERROR' ? result.error || 'Runtime error' : undefined,
      testResults,
    };
  },

  async voteProblem() {
    throw new ApiError('Voting is not available from the backend yet.', 501);
  },

  async getUserProfile(username) {
    const authUser = await hydrateAuthSession();
    if (!authUser?.id) {
      throw new ApiError('Sign in required to load a profile.', 401);
    }

    const currentUsername = authUser.username || authUser.email?.split('@')[0] || '';
    let normalized = String(username || '').trim().toLowerCase();
    try {
      normalized = decodeURIComponent(normalized);
    } catch {
      // Use the original identifier when the route contains malformed encoding.
    }

    const currentIdentifiers = new Set(
      [authUser.id, authUser.username, authUser.name, authUser.email]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase())
    );

    if (normalized && !currentIdentifiers.has(normalized)) {
      throw new ApiError(`User "${username}" not found`, 404);
    }

    return {
      id: authUser.id,
      username: currentUsername,
      name: authUser.name || currentUsername,
      email: authUser.email || '',
      avatarUrl: authUser.picture || '',
      bio: '',
      location: '',
      organization: '',
      website: '',
      github: '',
      linkedin: '',
      globalRank: 0,
      contestRating: 0,
      reputation: 0,
      followersCount: 0,
      followingCount: 0,
      joinedDate: '',
      lastActive: '',
      isOwner: true,
      isPrivate: false,
      skills: [],
      languages: [],
    };
  },

  async getUserBadges() {
    return [];
  },

  async getUserContests() {
    return {
      currentRating: 0,
      maxRating: 0,
      globalRank: 0,
      totalContests: 0,
      history: [],
    };
  },

  async getUserSolved() {
    try {
      const data = await apiClient.getProblems({ page: 1, limit: 10000, actiontype: 'submitted' });
      return data.problems;
    } catch {
      return [];
    }
  },

  async getUserSubmissions() {
    return {
      submissions: [],
      total: 0,
      page: 1,
      totalPages: 1,
    };
  },

  async getUserBookmarks() {
    return [];
  },

  async getPreferences() {
    return {};
  },

  async updatePreferences() {
    throw new ApiError('Preferences are not available from the backend yet.', 501);
  },

  async getPrivacy() {
    return {};
  },

  async updatePrivacy() {
    throw new ApiError('Privacy settings are not available from the backend yet.', 501);
  },

  async getNotifications() {
    return {};
  },

  async updateNotifications() {
    throw new ApiError('Notification settings are not available from the backend yet.', 501);
  },

  async updateProfile() {
    throw new ApiError('Profile editing is not available from the backend yet.', 501);
  },

  async checkUsernameAvailable() {
    throw new ApiError('Username checks are not available from the backend yet.', 501);
  },

  async uploadAvatar() {
    throw new ApiError('Avatar uploads are not available from the backend yet.', 501);
  },

  async changePassword() {
    throw new ApiError('Password changes are not available from the backend yet.', 501);
  },

  async deleteAccount() {
    throw new ApiError('Account deletion is not available from the backend yet.', 501);
  },

  async getFeaturedProblems(limit = 5) {
    if (!getAuthUser()?.id) return [];

    try {
      const data = await apiClient.getProblems({ limit: 100 });
      return data.problems.slice(0, limit).map((problem) => ({
        id: problem.id,
        frontendQuestionId: problem.frontendQuestionId,
        title: problem.title,
        titleSlug: problem.titleSlug,
        difficulty: problem.difficulty,
        topicTags: problem.topicTags,
        acceptanceRate: problem.acceptanceRate,
      }));
    } catch {
      return [];
    }
  },

  async getUpcomingContest() {
    return null;
  },

  async getPublicStats() {
    return {
      totalProblems: 0,
      totalTopics: 0,
      supportedLanguages: 0,
    };
  },
};

export const getFeaturedProblems = (limit) => apiClient.getFeaturedProblems(limit);
export const getUpcomingContest = () => apiClient.getUpcomingContest();
export const getPublicStats = () => apiClient.getPublicStats();

export default apiClient;
