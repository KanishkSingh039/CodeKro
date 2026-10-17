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

/**
 * @typedef {'Idle' | 'Queued' | 'Running' | 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compile Error' | 'Time Limit Exceeded' | 'Memory Limit Exceeded'} JudgeStatus
 */

/**
 * @typedef {Object} TestCase
 * @property {string} id
 * @property {string} input
 * @property {string} expectedOutput
 * @property {string} [actualOutput]
 * @property {string} [stdout]
 * @property {boolean} [isPassed]
 */

/**
 * @typedef {Object} Example
 * @property {number} id
 * @property {string} input
 * @property {string} output
 * @property {string} [explanation]
 */

/**
 * @typedef {Object} EditorialApproach
 * @property {string} id
 * @property {string} title
 * @property {string} timeComplexity
 * @property {string} spaceComplexity
 * @property {string} description
 * @property {Record<string, string>} code
 */

/**
 * @typedef {Object} SolutionItem
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {number} upvotes
 * @property {string[]} tags
 * @property {string} language
 * @property {string} preview
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ProblemDetail
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
 * @property {string} description
 * @property {Example[]} examples
 * @property {string[]} constraints
 * @property {string[]} hints
 * @property {string} [followUp]
 * @property {number} likes
 * @property {number} dislikes
 * @property {'like' | 'dislike' | null} [userVote]
 * @property {TestCase[]} testCases
 * @property {Record<string, string>} starterCode
 * @property {EditorialApproach[]} [editorial]
 * @property {boolean} [isEditorialLocked]
 * @property {SolutionItem[]} [solutions]
 */

/**
 * @typedef {Object} RunResult
 * @property {string} submissionId
 * @property {JudgeStatus} status
 * @property {number} passedCases
 * @property {number} totalCases
 * @property {string} [runtime]
 * @property {string} [memory]
 * @property {number} [runtimePercentile]
 * @property {number} [memoryPercentile]
 * @property {string} [compileError]
 * @property {string} [runtimeError]
 * @property {number} [errorLine]
 * @property {string} [stdout]
 * @property {TestCase[]} [testResults]
 * @property {TestCase} [failingCase]
 */

export {};

