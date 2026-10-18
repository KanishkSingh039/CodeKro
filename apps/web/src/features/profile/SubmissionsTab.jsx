import React from 'react';
import Card from '../../components/ui/Card';
import StatusBadge from '../problem/StatusBadge';
import { COPY } from '../../constants/copy';
import { ChevronLeft, ChevronRight, Bot } from 'lucide-react';

/**
 * SubmissionsTab Component
 * Paginated list of recent submissions (20/page).
 * Includes "AI-evaluated" caption next to submission statuses and "estimated" runtime notes.
 */
export default function SubmissionsTab({
  data,
  isLoading = false,
  page = 1,
  onPageChange,
  onSelectProblem,
}) {
  if (isLoading) {
    return (
      <Card padding="none" className="divide-y divide-border-subtle">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3.5 flex items-center justify-between">
            <div className="h-4 w-48 bg-border-default rounded animate-pulse" />
            <div className="h-4 w-24 bg-border-default rounded animate-pulse" />
          </div>
        ))}
      </Card>
    );
  }

  const { submissions = [], total = 0, totalPages = 1 } = data || {};

  if (submissions.length === 0) {
    return (
      <Card padding="md" className="text-center py-12 text-xs text-text-muted">
        {COPY.profile.empty.noSubmissions}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Verdict / AI Evaluation Clarification Banner */}
      <div className="px-3 py-2 rounded bg-bg-surface-subtle border border-border-subtle flex items-center gap-2 text-[11px] text-text-secondary">
        <Bot className="w-3.5 h-3.5 text-accent shrink-0" />
        <span>
          Verdicts and resource profiles are {COPY.profile.meta.verdictCaption.toLowerCase()}. Runtimes and memory allocations represent {COPY.profile.meta.estimatedRuntime} values.
        </span>
      </div>

      {/* Submissions List Card */}
      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-border-subtle">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-bg-surface-hover transition-colors"
            >
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onSelectProblem && onSelectProblem(sub.problemSlug)}
                  className="text-xs font-semibold text-text-primary hover:text-accent transition-colors truncate block text-left cursor-pointer"
                >
                  {sub.problemTitle}
                </button>
                <div className="flex items-center gap-2 text-[11px] text-text-muted mt-1 font-mono">
                  <span className="text-text-secondary">{sub.language}</span>
                  <span>•</span>
                  <span>{sub.relativeTime}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-text-muted font-sans bg-bg-surface px-1.5 py-0.2 rounded border border-border-subtle">
                    <Bot className="w-2.5 h-2.5 text-text-muted" />
                    <span>{COPY.profile.meta.verdictCaption}</span>
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <StatusBadge status={sub.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-border-default bg-bg-surface-subtle flex items-center justify-between text-xs">
            <span className="text-text-muted font-mono">
              Showing page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1 rounded border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-text-primary">{page}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1 rounded border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
