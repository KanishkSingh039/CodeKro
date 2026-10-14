import React from 'react';
import { History, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';

/**
 * RecentSubmissionsCard Component
 * Displays the last 5 submissions with status, language, and relative timestamp.
 * Green is exclusively for the Accepted state.
 */
export default function RecentSubmissionsCard({
  submissions = [],
  isLoading = false,
  onViewAll,
}) {
  if (isLoading) {
    return (
      <Card padding="sm" className="space-y-3">
        <div className="h-4 w-36 bg-border-default rounded animate-pulse" />
        <div className="h-28 bg-border-default rounded animate-pulse" />
      </Card>
    );
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-error">
            <XCircle className="w-3.5 h-3.5" />
            <span>Wrong Answer</span>
          </span>
        );
      case 'Time Limit Exceeded':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--difficulty-medium)]">
            <Clock className="w-3.5 h-3.5" />
            <span>TLE</span>
          </span>
        );
    }
  };

  return (
    <Card padding="sm" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-default">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <History className="w-3.5 h-3.5 text-text-secondary" />
          <span>Recent Submissions</span>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] text-text-muted hover:text-accent transition-colors cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* Submissions list */}
      <div className="divide-y divide-border-subtle">
        {submissions.map((sub) => (
          <div key={sub.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-xs font-medium text-text-primary hover:text-accent transition-colors truncate">
                {sub.problemTitle}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                <span className="font-mono text-text-secondary">{sub.language}</span>
                <span>•</span>
                <span className="font-mono">{sub.runtime}</span>
                <span>•</span>
                <span>{sub.relativeTime}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              {renderStatus(sub.status)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
