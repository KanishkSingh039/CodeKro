import React from 'react';
import Card from '../../components/ui/Card';

/**
 * ProgressCard Component
 * Displays total solved / total problems with a neutral segmented ring
 * Difficulty colors are ONLY used on the numbers.
 */
export default function ProgressCard({ stats, isLoading = false }) {
  if (isLoading || !stats) {
    return (
      <Card padding="sm" className="space-y-4">
        <div className="h-4 w-28 bg-border-default rounded animate-pulse" />
        <div className="h-28 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const {
    totalSolved = 0,
    totalProblems = 3120,
    easy = { solved: 0, total: 820 },
    medium = { solved: 0, total: 1650 },
    hard = { solved: 0, total: 650 },
    acceptanceRate = 0,
  } = stats;

  // SVG circular calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * totalSolved) / totalProblems;

  return (
    <Card padding="sm" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-default">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Session Progress
        </h2>
        <span className="text-xs text-text-muted">
          AC Rate: <strong className="font-mono text-text-primary">{acceptanceRate}%</strong>
        </span>
      </div>

      {/* Main Stats Row: Neutral Circular Ring + Breakdown */}
      <div className="flex items-center gap-6">
        {/* Neutral Ring Chart */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-border-default"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Neutral foreground progress ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-text-secondary transition-all duration-700 ease-out"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg font-bold text-text-primary leading-tight">
              {totalSolved}
            </span>
            <span className="text-[10px] text-text-muted">
              / {totalProblems}
            </span>
          </div>
        </div>

        {/* Breakdown - Difficulty colors ONLY on numbers */}
        <div className="flex-1 space-y-2">
          {/* Easy */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary text-[11px]">Easy</span>
            <span className="font-mono text-xs">
              <strong className="text-[var(--difficulty-easy)]">{easy.solved}</strong>
              <span className="text-text-muted">/{easy.total}</span>
            </span>
          </div>
          <div className="w-full bg-bg-surface-subtle h-1 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-text-secondary/50 h-full rounded-full"
              style={{ width: `${(easy.solved / (easy.total || 1)) * 100}%` }}
            />
          </div>

          {/* Medium */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-text-secondary text-[11px]">Medium</span>
            <span className="font-mono text-xs">
              <strong className="text-[var(--difficulty-medium)]">{medium.solved}</strong>
              <span className="text-text-muted">/{medium.total}</span>
            </span>
          </div>
          <div className="w-full bg-bg-surface-subtle h-1 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-text-secondary/50 h-full rounded-full"
              style={{ width: `${(medium.solved / (medium.total || 1)) * 100}%` }}
            />
          </div>

          {/* Hard */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-text-secondary text-[11px]">Hard</span>
            <span className="font-mono text-xs">
              <strong className="text-[var(--difficulty-hard)]">{hard.solved}</strong>
              <span className="text-text-muted">/{hard.total}</span>
            </span>
          </div>
          <div className="w-full bg-bg-surface-subtle h-1 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-text-secondary/50 h-full rounded-full"
              style={{ width: `${(hard.solved / (hard.total || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
