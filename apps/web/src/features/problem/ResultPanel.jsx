import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, Terminal, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * ResultPanel Component
 * Displays judge output, execution metrics, per-case pass/fail diffs, compile/runtime errors,
 * and next-step actions.
 */
export default function ResultPanel({
  runResult,
  isLoading = false,
  loadingMessage = 'Running tests...',
  onNextProblem,
  onAddFailingToTestCases,
  onJumpToLine,
}) {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  // Announce results to screen readers
  const ariaAnnouncement = runResult
    ? `Submission finished with status: ${runResult.status}`
    : isLoading
    ? loadingMessage
    : 'Console idle';

  return (
    <div className="p-3 space-y-3 font-sans h-full overflow-y-auto" role="region" aria-label="Test Results">
      {/* Hidden Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {ariaAnnouncement}
      </div>

      {/* Loading Progress State */}
      {isLoading && (
        <div className="p-6 text-center flex flex-col items-center justify-center space-y-3">
          <StatusBadge status="running" size="md" />
          <p className="text-xs font-mono text-text-muted">{loadingMessage}</p>
        </div>
      )}

      {/* Idle State */}
      {!isLoading && (!runResult || runResult.status === 'Idle') && (
        <div className="p-6 text-center text-xs text-text-muted space-y-1">
          <p className="font-medium text-text-secondary">No recent test run</p>
          <p>Click "Run" or "Submit" to evaluate your solution against test cases.</p>
        </div>
      )}

      {/* Result State */}
      {!isLoading && runResult && runResult.status !== 'Idle' && (
        <div className="space-y-4">
          {/* Header Row: Status Badge & Primary Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border-default">
            <div className="flex items-center gap-3">
              <StatusBadge status={runResult.status} size="md" />
              {runResult.totalCases > 0 && (
                <span className="text-xs font-mono text-text-secondary">
                  {runResult.passedCases} / {runResult.totalCases} cases passed
                </span>
              )}
            </div>

            {/* Next Problem action on Accepted */}
            {runResult.status === 'Accepted' && onNextProblem && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onNextProblem}
                className="gap-1.5"
              >
                <span>Next problem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* Accepted Metric Cards (Runtime & Memory percentiles) */}
          {runResult.status === 'Accepted' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface space-y-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  {COPY.problem.console.runtimeLabel}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-text-primary">
                    {runResult.runtime || '4 ms'}
                  </span>
                  {runResult.runtimePercentile && (
                    <span className="text-xs text-text-secondary font-mono">
                      Beats {runResult.runtimePercentile}% of submissions
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface space-y-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  {COPY.problem.console.memoryLabel}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-text-primary">
                    {runResult.memory || '10.4 MB'}
                  </span>
                  {runResult.memoryPercentile && (
                    <span className="text-xs text-text-secondary font-mono">
                      Beats {runResult.memoryPercentile}% of submissions
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Compilation / Runtime Error Block */}
          {(runResult.compileError || runResult.runtimeError) && (
            <div className="p-3 rounded-[var(--radius-sm)] bg-bg-surface border border-error/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-error">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {runResult.compileError ? 'Compilation Output' : 'Runtime Exception'}
                </span>
              </div>
              <pre className="p-2.5 rounded bg-bg-input text-xs font-mono text-error/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                <code>{runResult.compileError || runResult.runtimeError}</code>
              </pre>
              {runResult.errorLine && onJumpToLine && (
                <button
                  type="button"
                  onClick={() => onJumpToLine(runResult.errorLine)}
                  className="text-xs text-accent hover:underline cursor-pointer"
                >
                  Jump to line {runResult.errorLine} in editor →
                </button>
              )}
            </div>
          )}

          {/* Failing Case Callout for Wrong Answer */}
          {runResult.status === 'Wrong Answer' && runResult.failingCase && (
            <div className="p-3 rounded-[var(--radius-sm)] border border-error/30 bg-bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Failed Testcase
                </span>
                {onAddFailingToTestCases && (
                  <button
                    type="button"
                    onClick={() => onAddFailingToTestCases(runResult.failingCase)}
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{COPY.problem.actions.addTestCase}</span>
                  </button>
                )}
              </div>

              <div className="font-mono text-xs space-y-1.5 p-2 rounded bg-bg-input">
                <div>
                  <span className="text-text-muted select-none">Input: </span>
                  <span className="text-text-primary">{runResult.failingCase.input}</span>
                </div>
                <div>
                  <span className="text-text-muted select-none">Output: </span>
                  <span className="text-error">{runResult.failingCase.actualOutput}</span>
                </div>
                <div>
                  <span className="text-text-muted select-none">Expected: </span>
                  <span className="text-accent">{runResult.failingCase.expectedOutput}</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Cases Selector & Details */}
          {runResult.testResults && runResult.testResults.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {runResult.testResults.map((tc, idx) => {
                  const isSelected = activeCaseIdx === idx;
                  return (
                    <button
                      key={tc.id || idx}
                      type="button"
                      onClick={() => setActiveCaseIdx(idx)}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-bg-surface-subtle text-accent border border-accent/30'
                          : 'bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tc.isPassed ? 'bg-accent' : 'bg-error'
                      }`} />
                      <span>{COPY.problem.actions.case} {idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {runResult.testResults[activeCaseIdx] && (
                <div className="p-3 rounded-[var(--radius-sm)] bg-bg-surface border border-border-default space-y-1.5 font-mono text-xs select-text">
                  <div>
                    <span className="text-text-muted select-none">Input: </span>
                    <span className="text-text-primary">{runResult.testResults[activeCaseIdx].input}</span>
                  </div>
                  <div>
                    <span className="text-text-muted select-none">Output: </span>
                    <span className={runResult.testResults[activeCaseIdx].isPassed ? 'text-text-primary' : 'text-error'}>
                      {runResult.testResults[activeCaseIdx].actualOutput}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted select-none">Expected: </span>
                    <span className="text-text-secondary">{runResult.testResults[activeCaseIdx].expectedOutput}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stdout if present */}
          {runResult.stdout && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                <Terminal className="w-3 h-3" />
                <span>{COPY.problem.meta.stdout}</span>
              </div>
              <pre className="p-2.5 rounded bg-bg-input border border-border-default text-xs font-mono text-text-secondary overflow-x-auto whitespace-pre-wrap">
                <code>{runResult.stdout}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
