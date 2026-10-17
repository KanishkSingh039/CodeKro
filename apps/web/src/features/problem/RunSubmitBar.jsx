import React from 'react';
import { Play, Check, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * RunSubmitBar Component
 * Bottom action bar with Run (secondary) and Submit (primary green) actions,
 * disabled states with loading spinners, and console panel toggle.
 */
export default function RunSubmitBar({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  isConsoleOpen = true,
  onToggleConsole,
  disabled = false,
}) {
  const isBusy = isRunning || isSubmitting;
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modifier = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="h-11 px-3 bg-bg-surface border-t border-border-default flex items-center justify-between select-none">
      {/* Console Toggle Button */}
      <button
        type="button"
        onClick={onToggleConsole}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-text-secondary hover:text-text-primary rounded hover:bg-bg-surface-hover transition-colors cursor-pointer"
        title="Toggle console drawer"
      >
        <span>Console</span>
        {isConsoleOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
        )}
      </button>

      {/* Action Buttons: Run & Submit */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onRun}
          loading={isRunning}
          disabled={disabled || isBusy}
          className="gap-1.5 h-7.5 px-3"
          title={`Run code (${modifier} + ')`}
        >
          {!isRunning && <Play className="w-3 h-3 fill-current" />}
          <span>{isRunning ? COPY.problem.actions.running : COPY.problem.actions.run}</span>
          <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono text-text-muted">
            {modifier}+'
          </kbd>
        </Button>

        {/* Submit Button (Primary Green) */}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={disabled || isBusy}
          className="gap-1.5 h-7.5 px-3 font-semibold"
          title={`Submit solution (${modifier} + Enter)`}
        >
          {!isSubmitting && <Check className="w-3.5 h-3.5" />}
          <span>{isSubmitting ? COPY.problem.actions.judging : COPY.problem.actions.submit}</span>
          <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono text-accent-text/80">
            {modifier}+↵
          </kbd>
        </Button>
      </div>
    </div>
  );
}
