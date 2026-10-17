import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import ProblemTopBar from './ProblemTopBar';
import ProblemLayout from './ProblemLayout';
import ProblemDescription from './ProblemDescription';
import EditorialTab from './EditorialTab';
import SolutionsTab from './SolutionsTab';
import SubmissionTable from './SubmissionTable';
import EditorPanel from './EditorPanel';
import TestcasePanel from './TestcasePanel';
import ResultPanel from './ResultPanel';
import RunSubmitBar from './RunSubmitBar';
import Button from '../../components/ui/Button';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * ProblemWorkspace Component
 * Coordinates problem fetching, editor state, test cases, code execution judge polling,
 * keyboard shortcuts, and responsive layout.
 */
export default function ProblemWorkspace({
  slug = 'two-sum',
  onBackToList,
  onNavigateSlug,
  theme = 'dark',
  onToggleTheme,
}) {
  const queryClient = useQueryClient();

  // 1. Fetch Problem Data
  const {
    data: problem,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['problem', slug],
    queryFn: () => apiClient.getProblemBySlug(slug),
  });

  // 2. Fetch User's Submission History for this problem
  const { data: submissions = [] } = useQuery({
    queryKey: ['problem-submissions', problem?.id],
    queryFn: () => apiClient.getProblemSubmissions(problem?.id),
    enabled: Boolean(problem?.id),
  });

  // UI state
  const [leftTab, setLeftTab] = useState('description');
  const [consoleTab, setConsoleTab] = useState('testcase'); // 'testcase' | 'result'
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState('description'); // 'description' | 'code' | 'results'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Editor State
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState([]);

  // Execution & Judge Polling State
  const [runResult, setRunResult] = useState(null);
  const [isJudging, setIsJudging] = useState(false);
  const [judgeMessage, setJudgeMessage] = useState('In queue...');
  const [showAcceptedCelebration, setShowAcceptedCelebration] = useState(false);

  const activePollingRef = useRef(null);

  // Load starter code or restored localStorage code on problem/language load
  useEffect(() => {
    if (!problem?.id) return;
    const storageKey = `codekro_code_${problem.id}_${language}`;
    try {
      const savedCode = localStorage.getItem(storageKey);
      if (savedCode) {
        setCode(savedCode);
      } else {
        const starter = problem.starterCode?.[language] || `// Code for ${language}\n`;
        setCode(starter);
      }
    } catch {
      setCode(problem.starterCode?.[language] || '');
    }
  }, [problem?.id, problem?.starterCode, language]);

  // Initialize testcases from problem if not already initialized
  useEffect(() => {
    if (problem?.testCases) {
      setTestCases(problem.testCases);
    }
  }, [problem?.id, problem?.testCases]);

  // Debounced Auto-save to localStorage
  useEffect(() => {
    if (!problem?.id || !code) return;
    const storageKey = `codekro_code_${problem.id}_${language}`;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, code);
      } catch {
        // ignore
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [problem?.id, language, code]);

  // Reset code handler
  const handleResetCode = () => {
    if (!problem) return;
    const starter = problem.starterCode?.[language] || `// Code for ${language}\n`;
    setCode(starter);
    try {
      localStorage.removeItem(`codekro_code_${problem.id}_${language}`);
    } catch {
      // ignore
    }
  };

  // Run Code mutation
  const runMutation = useMutation({
    mutationFn: () =>
      apiClient.runCode({
        problemId: problem.id,
        lang: language,
        code,
        testcases: testCases,
      }),
  });

  // Submit Code mutation
  const submitMutation = useMutation({
    mutationFn: () =>
      apiClient.submitCode({
        problemId: problem.id,
        lang: language,
        code,
      }),
  });

  // Start polling judge status until terminal status
  const startPolling = useCallback((submissionId) => {
    setIsJudging(true);
    setConsoleTab('result');
    setIsConsoleOpen(true);
    setMobileTab('results');
    setJudgeMessage('In queue...');

    if (activePollingRef.current) {
      clearInterval(activePollingRef.current);
    }

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await apiClient.getSubmissionStatus(submissionId);
        setJudgeMessage(statusData.message || 'Evaluating...');

        if (statusData.status !== 'Queued' && statusData.status !== 'Running') {
          clearInterval(pollInterval);
          activePollingRef.current = null;
          setIsJudging(false);
          setRunResult(statusData);

          if (statusData.status === 'Accepted') {
            setShowAcceptedCelebration(true);
            setTimeout(() => setShowAcceptedCelebration(false), 3500);
            queryClient.invalidateQueries({ queryKey: ['problem-submissions'] });
          }
        }
      } catch (err) {
        clearInterval(pollInterval);
        activePollingRef.current = null;
        setIsJudging(false);
        setRunResult({
          status: 'Runtime Error',
          runtimeError: err.message || 'Judge evaluation failed',
        });
      }
    }, 900);

    activePollingRef.current = pollInterval;
  }, [queryClient]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (activePollingRef.current) clearInterval(activePollingRef.current);
    };
  }, []);

  const handleRun = useCallback(async () => {
    if (isJudging || !problem) return;
    setRunResult(null);
    try {
      const res = await runMutation.mutateAsync();
      startPolling(res.submissionId);
    } catch (err) {
      console.error(err);
    }
  }, [isJudging, problem, runMutation, startPolling]);

  const handleSubmit = useCallback(async () => {
    if (isJudging || !problem) return;
    setRunResult(null);
    try {
      const res = await submitMutation.mutateAsync();
      startPolling(res.submissionId);
    } catch (err) {
      console.error(err);
    }
  }, [isJudging, problem, submitMutation, startPolling]);

  const handleRunRef = useRef(handleRun);
  const handleSubmitRef = useRef(handleSubmit);

  useEffect(() => {
    handleRunRef.current = handleRun;
    handleSubmitRef.current = handleSubmit;
  }, [handleRun, handleSubmit]);

  // Keyboard Shortcuts: Cmd/' to Run, Cmd/Enter to Submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key === "'") {
        e.preventDefault();
        handleRunRef.current?.();
      } else if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        handleSubmitRef.current?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Vote mutation (Like / Dislike)
  const voteMutation = useMutation({
    mutationFn: (type) => apiClient.voteProblem(problem.id, type),
    onSuccess: (updatedVotes) => {
      queryClient.setQueryData(['problem', slug], (old) => ({
        ...old,
        ...updatedVotes,
      }));
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: (id) => apiClient.toggleBookmark(id),
    onSuccess: ({ isBookmarked }) => {
      queryClient.setQueryData(['problem', slug], (old) => ({
        ...old,
        isBookmarked,
      }));
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-bg-base flex flex-col">
        <ProblemTopBar onBackToList={onBackToList} theme={theme} onToggleTheme={onToggleTheme} />
        <div className="flex-1 flex items-center justify-center text-xs font-mono text-text-muted gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span>Loading problem workspace...</span>
        </div>
      </div>
    );
  }

  // 404 / Error State
  if (isError || !problem) {
    return (
      <div className="h-screen w-full bg-bg-base flex flex-col">
        <ProblemTopBar onBackToList={onBackToList} theme={theme} onToggleTheme={onToggleTheme} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-error" />
          <h2 className="text-base font-semibold text-text-primary">
            {error?.status === 404 ? 'Problem not found' : 'Unable to load problem'}
          </h2>
          <p className="text-xs text-text-muted max-w-sm">
            {error?.message || 'The requested coding problem could not be loaded.'}
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={onBackToList}>
              Back to Problem List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-bg-base text-text-primary flex flex-col overflow-hidden select-none">
      {/* 48px Compact Top Bar */}
      <ProblemTopBar
        onBackToList={onBackToList}
        onPrevProblem={() => onNavigateSlug && onNavigateSlug('trapping-rain-water')}
        onNextProblem={() => onNavigateSlug && onNavigateSlug('longest-substring-without-repeating-characters')}
        onPickRandom={() => onNavigateSlug && onNavigateSlug('trapping-rain-water')}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Split Layout */}
      <ProblemLayout
        // Left Tabs
        leftActiveTab={leftTab}
        onLeftTabChange={setLeftTab}
        submissionsCount={submissions.length}
        descriptionContent={
          <ProblemDescription
            problem={problem}
            onVote={(type) => voteMutation.mutate(type)}
            onBookmarkToggle={(id) => bookmarkMutation.mutate(id)}
          />
        }
        editorialContent={
          <EditorialTab
            editorial={problem.editorial}
            isLocked={problem.isEditorialLocked}
            onUnlock={() => {}}
          />
        }
        solutionsContent={<SolutionsTab solutions={problem.solutions} />}
        submissionsContent={<SubmissionTable submissions={submissions} />}

        // Right Pane - Editor
        editorContent={
          <EditorPanel
            problemId={problem.id}
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onResetCode={handleResetCode}
            theme={theme}
            fullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        }

        // Right Pane - Console (Testcase / Result)
        isConsoleOpen={isConsoleOpen}
        consoleContent={
          <div className="flex flex-col h-full overflow-hidden select-text">
            {/* Console Tabs Bar (32px) */}
            <div className="h-8 px-3 bg-bg-surface-subtle border-b border-border-default flex items-center gap-2 text-xs select-none shrink-0">
              <button
                type="button"
                onClick={() => setConsoleTab('testcase')}
                className={`px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer ${
                  consoleTab === 'testcase'
                    ? 'bg-bg-surface text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {COPY.problem.console.testcaseTab}
              </button>
              <button
                type="button"
                onClick={() => setConsoleTab('result')}
                className={`px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  consoleTab === 'result'
                    ? 'bg-bg-surface text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{COPY.problem.console.resultTab}</span>
                {runResult && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      runResult.status === 'Accepted'
                        ? 'bg-accent'
                        : runResult.status === 'Wrong Answer'
                        ? 'bg-error'
                        : 'bg-[var(--difficulty-medium)]'
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Console Active Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {consoleTab === 'testcase' ? (
                <TestcasePanel
                  testCases={testCases}
                  onUpdateTestCase={(idx, updated) => {
                    const next = [...testCases];
                    next[idx] = updated;
                    setTestCases(next);
                  }}
                  onAddTestCase={(newCase) => setTestCases([...testCases, newCase])}
                  onRemoveTestCase={(idx) => setTestCases(testCases.filter((_, i) => i !== idx))}
                />
              ) : (
                <ResultPanel
                  runResult={runResult}
                  isLoading={isJudging}
                  loadingMessage={judgeMessage}
                  onNextProblem={() =>
                    onNavigateSlug && onNavigateSlug('trapping-rain-water')
                  }
                  onAddFailingToTestCases={(failingCase) => {
                    setTestCases([...testCases, failingCase]);
                    setConsoleTab('testcase');
                  }}
                />
              )}
            </div>
          </div>
        }

        // Action Bar (Run & Submit)
        runSubmitBar={
          <RunSubmitBar
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={runMutation.isPending || (isJudging && !submitMutation.isPending)}
            isSubmitting={submitMutation.isPending || (isJudging && submitMutation.isPending)}
            isConsoleOpen={isConsoleOpen}
            onToggleConsole={() => setIsConsoleOpen(!isConsoleOpen)}
          />
        }

        // Mobile Controls
        mobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
      />

      {/* Tasteful Success Checkmark Toast on Accepted (Respects reduced motion) */}
      {showAcceptedCelebration && (
        <div className="fixed top-14 right-6 z-50 p-3 rounded-[var(--radius-sm)] border border-accent/40 bg-bg-surface shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-text-primary block">
              Solution Accepted!
            </span>
            <span className="text-[11px] text-text-muted font-mono block">
              Runtime: {runResult?.runtime || '4 ms'} • Memory: {runResult?.memory || '10.4 MB'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
