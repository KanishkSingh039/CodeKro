import React from 'react';
import Card from '../../components/ui/Card';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import TagChip from '../../components/ui/TagChip';
import { Lock, Bookmark } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * BookmarksTab Component
 * Problem list for the owner; locked message for visitors.
 */
export default function BookmarksTab({
  bookmarks = [],
  isLoading = false,
  isOwner = false,
  onSelectProblem,
}) {
  if (!isOwner) {
    return (
      <Card padding="lg" className="text-center py-12 space-y-3 border-border-default">
        <div className="w-10 h-10 rounded-full bg-bg-surface-subtle border border-border-default flex items-center justify-center mx-auto text-text-muted">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">
            {COPY.profile.lockedBookmarks.title}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {COPY.profile.lockedBookmarks.desc}
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card padding="none" className="divide-y divide-border-subtle">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3.5 flex items-center justify-between">
            <div className="h-4 w-40 bg-border-default rounded animate-pulse" />
            <div className="h-4 w-16 bg-border-default rounded animate-pulse" />
          </div>
        ))}
      </Card>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Card padding="md" className="text-center py-12 text-xs text-text-muted">
        {COPY.profile.empty.noBookmarks}
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="divide-y divide-border-subtle">
        {bookmarks.map((problem) => (
          <div
            key={problem.id}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-bg-surface-hover transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-accent shrink-0" />
                <button
                  type="button"
                  onClick={() => onSelectProblem && onSelectProblem(problem.titleSlug)}
                  className="text-xs font-semibold text-text-primary hover:text-accent transition-colors truncate block text-left cursor-pointer"
                >
                  {problem.frontendQuestionId}. {problem.title}
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5 pl-5">
                {problem.topicTags?.slice(0, 3).map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>
            </div>

            <div className="shrink-0">
              <DifficultyLabel difficulty={problem.difficulty} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
