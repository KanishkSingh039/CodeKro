import React, { useState } from 'react';
import { Search, ThumbsUp, ArrowUpDown } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * SolutionsTab Component
 * Displays community solution writeups with search, language filters, and upvote counters.
 */
export default function SolutionsTab({ solutions = [] }) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('votes');

  const filtered = solutions
    .filter((sol) => {
      const matchSearch =
        !search ||
        sol.title.toLowerCase().includes(search.toLowerCase()) ||
        sol.author.toLowerCase().includes(search.toLowerCase());
      const matchTag =
        selectedTag === 'all' || sol.language.toLowerCase() === selectedTag.toLowerCase();
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') return b.upvotes - a.upvotes;
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 space-y-4 select-text overflow-y-auto">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={COPY.problem.solutions.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 text-xs bg-bg-surface border border-border-default rounded-[var(--radius-sm)] text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          aria-label="Filter solutions by language"
          className="h-8 px-2 text-xs bg-bg-surface border border-border-default rounded-[var(--radius-sm)] text-text-secondary focus:border-accent focus:outline-none cursor-pointer"
        >
          <option value="all">All Languages</option>
          <option value="C++">C++</option>
          <option value="Python3">Python3</option>
          <option value="JavaScript">JavaScript</option>
        </select>

        <div className="relative inline-flex items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort solutions"
            className="h-8 pl-6 pr-2.5 text-xs bg-bg-surface border border-border-default rounded-[var(--radius-sm)] text-text-secondary focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="votes">{COPY.problem.solutions.mostVotes}</option>
            <option value="newest">{COPY.problem.solutions.newest}</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-text-muted absolute left-2 pointer-events-none" />
        </div>
      </div>

      {/* Solutions List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-text-muted">
          No solutions match your search.
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {filtered.map((sol) => (
            <div
              key={sol.id}
              className="py-3.5 first:pt-0 last:pb-0 space-y-2 hover:bg-bg-surface-hover/50 p-2 rounded transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-text-primary hover:text-accent transition-colors">
                    {sol.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="text-text-secondary font-medium">@{sol.author}</span>
                    <span>•</span>
                    <span className="font-mono text-text-secondary">{sol.language}</span>
                    <span>•</span>
                    <span>{sol.createdAt}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-bg-surface border border-border-default text-xs text-text-secondary shrink-0">
                  <ThumbsUp className="w-3 h-3 text-accent" />
                  <span className="font-mono">{sol.upvotes}</span>
                </div>
              </div>

              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                {sol.preview}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {sol.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface-subtle border border-border-subtle text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
