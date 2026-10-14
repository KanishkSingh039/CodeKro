import React from 'react';
import { Star, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import StatusIcon from './StatusIcon';
import DifficultyLabel from './DifficultyLabel';
import Button from './Button';

/**
 * DataTable Component
 * Dense, calm developer problem list table with sticky headers, zebra/hover rows,
 * pagination, skeleton loading, empty state, and error handling.
 */
export default function DataTable({
  problems = [],
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load problems. Please retry.',
  onRetry,
  onBookmarkToggle,
  onProblemClick,
  onResetFilters,
  pagination = {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
    onPageChange: () => {},
  },
}) {
  // Skeleton Rows for loading state
  if (isLoading) {
    return (
      <div className="w-full border border-border-default rounded-[var(--radius-sm)] overflow-hidden bg-bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-default bg-bg-surface-subtle text-text-muted font-medium">
                <th className="py-2.5 px-3 w-10 text-center">Status</th>
                <th className="py-2.5 px-3 w-14">#</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3 w-24">Acceptance</th>
                <th className="py-2.5 px-3 w-20">Difficulty</th>
                <th className="py-2.5 px-3 w-24">Frequency</th>
                <th className="py-2.5 px-3 w-12 text-center">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {Array.from({ length: 12 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3 px-3 text-center">
                    <div className="w-4 h-4 rounded-full bg-border-default mx-auto" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-7 h-3 rounded bg-border-default" />
                  </td>
                  <td className="py-3 px-3">
                    <div
                      className="h-3.5 rounded bg-border-default"
                      style={{ width: `${35 + (i % 5) * 12}%` }}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-10 h-3 rounded bg-border-default" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-12 h-3 rounded bg-border-default" />
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-16 h-2 rounded bg-border-default" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="w-3.5 h-3.5 rounded bg-border-default mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="w-full border border-border-default rounded-[var(--radius-sm)] p-10 bg-bg-surface text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-7 h-7 text-error" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">Unable to load problem bank</p>
          <p className="text-xs text-text-muted">{errorMessage}</p>
        </div>
        {onRetry && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="mt-2 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </Button>
        )}
      </div>
    );
  }

  // Empty State
  if (!problems || problems.length === 0) {
    return (
      <div className="w-full border border-border-default rounded-[var(--radius-sm)] p-12 bg-bg-surface text-center flex flex-col items-center justify-center gap-2">
        <p className="text-sm font-medium text-text-primary">No problems match your filters</p>
        <p className="text-xs text-text-muted max-w-sm">
          Try loosening your search terms or resetting difficulty and status filters.
        </p>
        {onResetFilters && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            className="mt-3 text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  const { page, totalPages, total, limit, onPageChange } = pagination;
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="w-full border border-border-default rounded-[var(--radius-sm)] overflow-hidden bg-bg-surface flex flex-col">
      {/* Responsive Table / Cards container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs select-none">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 bg-bg-surface border-b border-border-default">
            <tr className="text-text-muted text-[11px] font-medium tracking-wide uppercase">
              <th scope="col" className="py-2.5 px-3 w-10 text-center">
                Status
              </th>
              <th scope="col" className="py-2.5 px-3 w-14">
                #
              </th>
              <th scope="col" className="py-2.5 px-3">
                Title
              </th>
              <th scope="col" className="py-2.5 px-3 w-24">
                Acceptance
              </th>
              <th scope="col" className="py-2.5 px-3 w-20">
                Difficulty
              </th>
              <th scope="col" className="py-2.5 px-3 w-28 hidden sm:table-cell">
                Frequency
              </th>
              <th scope="col" className="py-2.5 px-3 w-12 text-center">
                Save
              </th>
            </tr>
          </thead>

          {/* Plain Rows with subtle zebra and hover highlight (NO cards around rows) */}
          <tbody className="divide-y divide-border-subtle">
            {problems.map((problem, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={problem.id}
                  className={`group transition-colors cursor-pointer ${
                    isEven ? 'bg-bg-surface' : 'bg-bg-surface-subtle/50'
                  } hover:bg-bg-surface-hover`}
                  onClick={() => onProblemClick && onProblemClick(problem)}
                >
                  {/* Status Icon */}
                  <td className="py-2.5 px-3 text-center align-middle">
                    <div className="inline-flex items-center justify-center">
                      <StatusIcon status={problem.status} size={15} />
                    </div>
                  </td>

                  {/* Problem Number */}
                  <td className="py-2.5 px-3 font-mono text-text-muted align-middle">
                    {problem.frontendQuestionId}
                  </td>

                  {/* Title */}
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary group-hover:text-accent transition-colors">
                        {problem.title}
                      </span>
                      {problem.companies && problem.companies.length > 0 && (
                        <span className="hidden lg:inline-block text-[10px] text-text-muted px-1.5 py-0.5 rounded bg-bg-surface-subtle border border-border-subtle">
                          {problem.companies[0]}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Acceptance Rate */}
                  <td className="py-2.5 px-3 font-mono text-text-secondary align-middle">
                    {problem.acceptanceRate.toFixed(1)}%
                  </td>

                  {/* Difficulty */}
                  <td className="py-2.5 px-3 align-middle">
                    <DifficultyLabel difficulty={problem.difficulty} />
                  </td>

                  {/* Frequency Indicator */}
                  <td className="py-2.5 px-3 align-middle hidden sm:table-cell">
                    <div className="w-20 bg-bg-surface-subtle h-1.5 rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className="bg-text-muted/60 h-full rounded-full transition-all"
                        style={{ width: `${problem.frequency || 50}%` }}
                      />
                    </div>
                  </td>

                  {/* Bookmark Toggle */}
                  <td
                    className="py-2.5 px-3 text-center align-middle"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookmarkToggle) onBookmarkToggle(problem.id);
                    }}
                  >
                    <button
                      type="button"
                      aria-label={problem.isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                      className="p-1 text-text-muted hover:text-accent transition-colors cursor-pointer"
                    >
                      <Star
                        size={14}
                        className={
                          problem.isBookmarked
                            ? 'text-accent fill-accent'
                            : 'text-text-muted/50 hover:text-text-primary'
                        }
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-2.5 border-t border-border-default bg-bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
        <div>
          Showing <span className="font-mono text-text-secondary">{startIdx}</span>-
          <span className="font-mono text-text-secondary">{endIdx}</span> of{' '}
          <span className="font-mono text-text-secondary">{total}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
            className="p-1 rounded border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-mono text-[11px] text-text-secondary">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
            className="p-1 rounded border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
