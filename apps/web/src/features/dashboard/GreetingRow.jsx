import React from 'react';
import { Play } from 'lucide-react';
import Button from '../../components/ui/Button';

/**
 * GreetingRow Component
 * Calm developer greeting with quick resume action.
 */
export default function GreetingRow({
  user,
  featuredProblem,
  onContinueProblem,
}) {
  const username = user?.name || user?.username || 'Developer';
  const lastProblem = user?.lastAttemptedProblem || featuredProblem;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
          Welcome back, {username}
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Pick up where you left off or explore new algorithmic challenges.
        </p>
      </div>

      {lastProblem && (
        <div className="shrink-0">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onContinueProblem && onContinueProblem(lastProblem)}
            className="w-full sm:w-auto gap-2"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span className="truncate max-w-[220px]">
              {user?.lastAttemptedProblem ? 'Continue' : 'Start'}: {lastProblem.title}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
