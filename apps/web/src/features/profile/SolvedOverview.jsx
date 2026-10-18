import React from 'react';
import Card from '../../components/ui/Card';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import { COPY } from '../../constants/copy';

/**
 * SolvedOverview Component
 * Displays total solved with a neutral ProgressRing, Easy/Medium/Hard breakdown rows,
 * and acceptance rate / total submissions beside it.
 * Difficulty colors are used on small labels only.
 */
export default function SolvedOverview({ stats, isLoading = false }) {
  if (isLoading || !stats) {
    return (
      <Card padding="md" className="space-y-4">
        <div className="h-4 w-32 bg-border-default rounded animate-pulse" />
        <div className="h-32 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const {
    totalSolved = 284,
    totalProblems = 3120,
    easy = { solved: 142, total: 820 },
    medium = { solved: 118, total: 1650 },
    hard = { solved: 24, total: 650 },
    acceptanceRate = 68.4,
    totalSubmissions = 412,
  } = stats;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * totalSolved) / (totalProblems || 1);

  return (
    <Card padding="md" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-default">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Problem Solving Overview
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-text-muted">
            {COPY.profile.meta.acceptanceRate}:{' '}
            <strong className="font-mono text-text-primary">{acceptanceRate}%</strong>
          </span>
          <span className="text-text-muted hidden sm:inline-block">
            {COPY.profile.meta.totalSubmissions}:{' '}
            <strong className="font-mono text-text-primary">{totalSubmissions}</strong>
          </span>
        </div>
      </div>

      {/* Main Content: Ring + Difficulty Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Left: Neutral Progress Ring (4 cols) */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-border-default"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-text-secondary transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-xl font-bold text-text-primary leading-tight">
                {totalSolved}
              </span>
              <span className="text-[11px] text-text-muted">
                / {totalProblems}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-text-muted mt-2 font-medium">Problems Solved</p>
        </div>

        {/* Right: Breakdown Rows (8 cols) */}
        <div className="sm:col-span-8 space-y-3">
          {/* Easy */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <DifficultyLabel difficulty="Easy" size="sm" />
              <span className="font-mono text-xs">
                <strong className="text-text-primary">{easy.solved}</strong>
                <span className="text-text-muted">/{easy.total}</span>
              </span>
            </div>
            <div className="w-full bg-bg-surface-subtle h-1.5 rounded-full overflow-hidden border border-border-subtle">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${(easy.solved / (easy.total || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <DifficultyLabel difficulty="Medium" size="sm" />
              <span className="font-mono text-xs">
                <strong className="text-text-primary">{medium.solved}</strong>
                <span className="text-text-muted">/{medium.total}</span>
              </span>
            </div>
            <div className="w-full bg-bg-surface-subtle h-1.5 rounded-full overflow-hidden border border-border-subtle">
              <div
                className="bg-[var(--difficulty-medium)] h-full rounded-full transition-all duration-500"
                style={{ width: `${(medium.solved / (medium.total || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <DifficultyLabel difficulty="Hard" size="sm" />
              <span className="font-mono text-xs">
                <strong className="text-text-primary">{hard.solved}</strong>
                <span className="text-text-muted">/{hard.total}</span>
              </span>
            </div>
            <div className="w-full bg-bg-surface-subtle h-1.5 rounded-full overflow-hidden border border-border-subtle">
              <div
                className="bg-[var(--difficulty-hard)] h-full rounded-full transition-all duration-500"
                style={{ width: `${(hard.solved / (hard.total || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
