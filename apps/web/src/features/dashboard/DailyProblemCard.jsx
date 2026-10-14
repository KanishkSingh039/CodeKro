import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DifficultyLabel from '../../components/ui/DifficultyLabel';

/**
 * DailyProblemCard Component
 * Displays the Daily Problem of the Day challenge with timer and Solve button.
 */
export default function DailyProblemCard({ daily, onSolve, isLoading = false }) {
  const initialSeconds = daily?.timeRemainingSeconds || 28410;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !daily?.problem) {
    return (
      <Card padding="sm" className="space-y-3">
        <div className="h-4 w-32 bg-border-default rounded animate-pulse" />
        <div className="h-16 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const { problem } = daily;
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;

  return (
    <Card padding="sm" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-default">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Calendar className="w-3.5 h-3.5 text-accent" />
          <span>Daily Challenge</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
          <Clock className="w-3 h-3" />
          <span>{formattedCountdown}</span>
        </div>
      </div>

      {/* Problem Details */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-muted">
                #{problem.frontendQuestionId}
              </span>
              <DifficultyLabel difficulty={problem.difficulty} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors">
              {problem.title}
            </h3>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {problem.topicTags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface-subtle border border-border-subtle text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Solve Button */}
      <div className="pt-1">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onSolve && onSolve(problem)}
          className="gap-1.5"
        >
          <span>Solve daily problem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </Card>
  );
}
