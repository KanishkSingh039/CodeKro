import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sun,
  Moon,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { COPY } from '../../constants/copy';

/**
 * ProblemTopBar Component
 * Compact 48px top bar with Problem List back button, prev/next navigation,
 * pick random, toggleable timer, shortcuts modal trigger, theme toggle, and user avatar.
 */
export default function ProblemTopBar({
  onBackToList,
  onPrevProblem,
  onNextProblem,
  onPickRandom,
  theme = 'dark',
  onToggleTheme,
  user = { username: 'kanishk' },
}) {
  const [showTimer, setShowTimer] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="h-12 bg-bg-surface border-b border-border-default px-3 flex items-center justify-between select-none shrink-0 z-30">
      {/* Left: Logo & Navigation */}
      <div className="flex items-center gap-3">
        <a href="#dashboard" onClick={onBackToList} className="flex items-center">
          <Logo size="sm" />
        </a>

        <div className="h-4 w-px bg-border-default mx-1 hidden sm:block" />

        {/* Back to problem list link */}
        <button
          type="button"
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{COPY.problem.backToList}</span>
        </button>

        {/* Prev / Next problem arrows */}
        <div className="flex items-center gap-0.5 border border-border-default rounded-[var(--radius-sm)] bg-bg-surface overflow-hidden">
          <button
            type="button"
            onClick={onPrevProblem}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-bg-surface-hover cursor-pointer"
            title={COPY.problem.prevProblem}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="h-3 w-px bg-border-subtle" />
          <button
            type="button"
            onClick={onNextProblem}
            className="p-1 text-text-muted hover:text-text-primary hover:bg-bg-surface-hover cursor-pointer"
            title={COPY.problem.nextProblem}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pick random */}
        <button
          type="button"
          onClick={onPickRandom}
          className="p-1.5 rounded-[var(--radius-sm)] border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          title={COPY.problem.pickRandom}
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Timer, Shortcuts, Theme, User Avatar */}
      <div className="flex items-center gap-2">
        {/* Toggleable Stopwatch / Timer */}
        {showTimer ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-xs font-mono">
            <span className="text-text-primary font-medium w-12 text-center">
              {formatTimer(seconds)}
            </span>
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-0.5 text-text-muted hover:text-accent cursor-pointer"
              title={timerRunning ? COPY.problem.timerPause : COPY.problem.timerStart}
            >
              {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setSeconds(0);
              }}
              className="p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              title={COPY.problem.timerReset}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowTimer(false);
                setTimerRunning(false);
              }}
              className="p-0.5 text-text-muted hover:text-text-primary ml-0.5 cursor-pointer"
              title="Hide timer"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowTimer(true);
              setTimerRunning(true);
            }}
            className="p-1.5 rounded-[var(--radius-sm)] border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
            title="Open coding timer"
          >
            <Timer className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Shortcuts guide trigger */}
        <button
          type="button"
          onClick={() => setShowShortcuts(true)}
          className="p-1.5 rounded-[var(--radius-sm)] border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 rounded-[var(--radius-sm)] border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* User Avatar */}
        <div className="w-6 h-6 rounded bg-bg-surface-subtle border border-border-default flex items-center justify-center text-[10px] font-mono font-medium text-accent select-none">
          {user?.username ? user.username.slice(0, 2).toUpperCase() : 'CK'}
        </div>
      </div>

      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </header>
  );
}
