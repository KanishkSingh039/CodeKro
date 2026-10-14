/**
 * @fileoverview Type definitions for CodeKro Dashboard (JSDoc for pure JS)
 */

/**
 * @typedef {'Easy' | 'Medium' | 'Hard'} DifficultyLevel
 */

/**
 * @typedef {'solved' | 'attempted' | 'todo'} ProblemStatus
 */

/**
 * @typedef {Object} Problem
 * @property {number} id
 * @property {number} frontendQuestionId
 * @property {string} title
 * @property {string} titleSlug
 * @property {DifficultyLevel} difficulty
 * @property {number} acceptanceRate
 * @property {ProblemStatus} status
 * @property {number} frequency
 * @property {boolean} isBookmarked
 * @property {string[]} topicTags
 * @property {string[]} companies
 * @property {string | null} [lastAttemptedAt]
 */

/**
 * @typedef {'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error'} SubmissionStatus
 */

/**
 * @typedef {Object} Submission
 * @property {string} id
 * @property {number} problemId
 * @property {string} problemTitle
 * @property {string} problemSlug
 * @property {SubmissionStatus} status
 * @property {'C++' | 'Python3' | 'Java' | 'TypeScript' | 'Go'} language
 * @property {string} runtime
 * @property {string} memory
 * @property {string} submittedAt
 * @property {string} relativeTime
 */

/**
 * @typedef {Object} Contest
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} startTime
 * @property {number} durationMinutes
 * @property {boolean} isRegistered
 * @property {number} registeredCount
 */

/**
 * @typedef {Object} DifficultyStats
 * @property {number} solved
 * @property {number} total
 */

/**
 * @typedef {Object} UserStats
 * @property {number} totalSolved
 * @property {number} totalProblems
 * @property {DifficultyStats} easy
 * @property {DifficultyStats} medium
 * @property {DifficultyStats} hard
 * @property {number} acceptanceRate
 * @property {number} globalRanking
 */

/**
 * @typedef {Object} ActivityDay
 * @property {string} date
 * @property {number} count
 * @property {0 | 1 | 2 | 3 | 4} level
 */

/**
 * @typedef {Object} UserActivity
 * @property {number} currentStreak
 * @property {number} longestStreak
 * @property {number} totalActiveDays
 * @property {ActivityDay[]} heatmap
 */

/**
 * @typedef {Object} DailyProblem
 * @property {string} date
 * @property {Problem} problem
 * @property {number} timeRemainingSeconds
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} username
 * @property {string} name
 * @property {string} email
 * @property {string} [avatarUrl]
 * @property {{ id: number; title: string; titleSlug: string; difficulty: DifficultyLevel } | null} [lastAttemptedProblem]
 */

/**
 * @typedef {Object} ProblemFilters
 * @property {number} page
 * @property {number} limit
 * @property {string} [q]
 * @property {string} [difficulty]
 * @property {string} [status]
 * @property {string} [tag]
 * @property {string} [company]
 * @property {string} [sort]
 */

export {};
