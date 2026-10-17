export const COPY = {
  brand: {
    name: 'CodeKro',
    tagline: 'Practice coding. Prepare for interviews. Compete.',
    subtext: 'A structured environment for algorithm challenges and automated test evaluation.',
  },
  nav: {
    problems: 'Problems',
    contests: 'Contests',
    docs: 'Docs',
    themeToggleLight: 'Switch to light mode',
    themeToggleDark: 'Switch to dark mode',
  },
  showcase: {
    features: [
      {
        id: 'execution',
        title: 'Multi-language runtime',
        description: 'Isolated test execution across standard languages with resource limits.',
      },
      {
        id: 'evaluation',
        title: 'Automated test suite',
        description: 'Instant verification against hidden edge cases and time constraints.',
      },
      {
        id: 'library',
        title: 'Structured problem bank',
        description: 'Categorized challenges ranging from foundational data structures to dynamic programming.',
      },
    ],
    codeSnippet: {
      fileName: 'solution.cpp',
      code: `class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int left = 0, currentSum = 0;
        int minLength = INT_MAX;

        for (int right = 0; right < n; ++right) {
            currentSum += nums[right];
            while (currentSum >= target) {
                minLength = min(minLength, right - left + 1);
                currentSum -= nums[left++];
            }
        }
        return minLength == INT_MAX ? 0 : minLength;
    }
};`,
    },
  },
  auth: {
    loginTitle: 'Sign in',
    loginSubtitle: 'Enter your credentials to access your account.',
    registerTitle: 'Create your account',
    registerSubtitle: 'Get started with tracking problems and contest submissions.',
    tabs: {
      login: 'Sign In',
      register: 'Sign Up',
    },
    oauth: {
      google: 'Google',
      github: 'GitHub',
      divider: 'or',
    },
    fields: {
      name: {
        label: 'Full name',
        placeholder: 'Alex Morgan',
      },
      username: {
        label: 'Username',
        placeholder: 'alexmorgan',
      },
      email: {
        label: 'Email address',
        placeholder: 'alex@example.com',
      },
      password: {
        label: 'Password',
        placeholder: '••••••••',
        hint: 'Use 8 or more characters with letters and numbers.',
      },
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      agreeTerms: 'I agree to the Terms of Service and Privacy Policy.',
    },
    buttons: {
      login: 'Sign in',
      register: 'Create account',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
    },
    footer: {
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
    },
    validation: {
      emailRequired: 'Please enter a valid email address.',
      passwordRequired: 'Password is required.',
      nameRequired: 'Full name is required.',
      usernameRequired: 'Username is required.',
      termsRequired: 'You must accept the terms to continue.',
    },
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} CodeKro. All rights reserved.`,
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
  },
  problem: {
    backToList: 'Problem List',
    prevProblem: 'Previous problem',
    nextProblem: 'Next problem',
    pickRandom: 'Pick random',
    timerStart: 'Start timer',
    timerPause: 'Pause timer',
    timerReset: 'Reset timer',
    shortcuts: 'Keyboard shortcuts',
    tabs: {
      description: 'Description',
      editorial: 'Editorial',
      solutions: 'Solutions',
      submissions: 'Submissions',
    },
    meta: {
      topics: 'Topics',
      companies: 'Companies',
      hints: 'Hints',
      hint: 'Hint',
      constraints: 'Constraints',
      followUp: 'Follow-up',
      examples: 'Examples',
      example: 'Example',
      input: 'Input',
      output: 'Output',
      explanation: 'Explanation',
      expected: 'Expected',
      stdout: 'Stdout',
    },
    actions: {
      run: 'Run',
      running: 'Running...',
      submit: 'Submit',
      judging: 'Judging...',
      resetCode: 'Reset to default',
      confirmReset: 'Are you sure you want to discard your current code and reset to the starter template?',
      settings: 'Editor Settings',
      fullscreen: 'Toggle fullscreen',
      exitFullscreen: 'Exit fullscreen',
      like: 'Like',
      dislike: 'Dislike',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      share: 'Share',
      copied: 'Link copied to clipboard',
      report: 'Report issue',
      addTestCase: 'Add to test cases',
      customTestCase: 'Custom Testcase',
      addCase: 'Add case',
      case: 'Case',
    },
    console: {
      testcaseTab: 'Testcase',
      resultTab: 'Test Result',
      noCases: 'No testcases defined.',
      runningTests: 'Running test cases against solution...',
      runtimeLabel: 'Runtime',
      memoryLabel: 'Memory',
      beats: 'Beats',
      passedCases: 'Testcases passed',
      viewCode: 'View Code',
    },
    status: {
      idle: 'Idle',
      queued: 'In queue',
      running: 'Running tests',
      accepted: 'Accepted',
      wrongAnswer: 'Wrong Answer',
      runtimeError: 'Runtime Error',
      compileError: 'Compile Error',
      timeLimitExceeded: 'Time Limit Exceeded',
      memoryLimitExceeded: 'Memory Limit Exceeded',
    },
    editorial: {
      lockedTitle: 'Editorial Locked',
      lockedDesc: 'Solve this problem or unlock with credits to view optimal solution breakdowns and complexity analyses.',
      unlockBtn: 'Unlock Editorial',
      complexity: 'Complexity Analysis',
      timeComplexity: 'Time Complexity',
      spaceComplexity: 'Space Complexity',
      approach: 'Approach',
    },
    solutions: {
      searchPlaceholder: 'Search community solutions...',
      sortBy: 'Sort by',
      mostVotes: 'Most Votes',
      newest: 'Newest',
      upvotes: 'upvotes',
    },
  },
};
