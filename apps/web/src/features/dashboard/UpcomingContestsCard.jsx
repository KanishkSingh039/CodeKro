import React, { useState } from 'react';
import { Trophy, Check, UserCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Format relative countdown string from ISO date string
 */
function getCountdownString(startTime) {
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return 'Live now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
}

/**
 * Format date in user's local timezone
 */
function formatLocalDate(isoString) {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * UpcomingContestsCard Component
 * Displays 2-3 upcoming contests with user's local timezone and registration action.
 */
export default function UpcomingContestsCard({ contests = [], isLoading = false }) {
  const [registeredIds, setRegisteredIds] = useState(new Set(['c-412']));

  const toggleRegister = (id) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card padding="sm" className="space-y-3">
        <div className="h-4 w-36 bg-border-default rounded animate-pulse" />
        <div className="h-24 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="sm" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-default">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Trophy className="w-3.5 h-3.5 text-accent" />
          <span>Upcoming Contests</span>
        </div>
        <a
          href="#contests"
          className="text-[11px] text-text-muted hover:text-accent transition-colors"
        >
          All contests
        </a>
      </div>

      {/* Contests List */}
      <div className="divide-y divide-border-subtle">
        {contests.map((contest) => {
          const isRegistered = registeredIds.has(contest.id);
          const countdown = getCountdownString(contest.startTime);
          const localDate = formatLocalDate(contest.startTime);

          return (
            <div key={contest.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors">
                    {contest.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                    <span>{localDate}</span>
                    <span>•</span>
                    <span className="font-mono text-text-secondary">{countdown}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isRegistered ? 'secondary' : 'secondary'}
                  size="sm"
                  onClick={() => toggleRegister(contest.id)}
                  className={`text-[11px] h-7 px-2.5 transition-colors shrink-0 ${
                    isRegistered
                      ? 'border-accent/40 text-accent bg-bg-surface-subtle'
                      : ''
                  }`}
                >
                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Register</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
