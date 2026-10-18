import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import DifficultyLabel from '../../components/ui/DifficultyLabel';
import TagChip from '../../components/ui/TagChip';
import { COPY } from '../../constants/copy';

/**
 * SolvedTab Component
 * Filterable table of solved problems with difficulty, topic tag, and language filters.
 */
export default function SolvedTab({
  solved = [],
  isLoading = false,
  onSelectProblem,
}) {
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <Card padding="none" className="divide-y divide-border-subtle">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3.5 flex items-center justify-between">
            <div className="h-4 w-48 bg-border-default rounded animate-pulse" />
            <div className="h-4 w-16 bg-border-default rounded animate-pulse" />
          </div>
        ))}
      </Card>
    );
  }

  // Filter items in memory
  const filtered = solved.filter((item) => {
    if (difficultyFilter !== 'all' && item.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }
    if (languageFilter !== 'all' && item.language.toLowerCase() !== languageFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-bg-surface border border-border-default rounded-[var(--radius-md)] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-bg-input border border-border-default text-text-primary px-2.5 py-1.5 rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
            aria-label="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="bg-bg-input border border-border-default text-text-primary px-2.5 py-1.5 rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
            aria-label="Filter by language"
          >
            <option value="all">All Languages</option>
            <option value="c++">C++</option>
            <option value="python3">Python3</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
          </select>
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Filter solved problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-bg-input border border-border-default text-text-primary px-3 py-1.5 rounded-[var(--radius-sm)] focus:border-accent focus:outline-none w-full sm:w-52"
        />
      </div>

      {/* Solved Problems Table */}
      <Card padding="none" className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            {COPY.profile.empty.noSolved}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-surface-subtle text-text-muted border-b border-border-subtle uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Problem</th>
                  <th className="py-2.5 px-4 font-medium">Difficulty</th>
                  <th className="py-2.5 px-4 font-medium">Tags</th>
                  <th className="py-2.5 px-4 font-medium">Language</th>
                  <th className="py-2.5 px-4 font-medium">Solved On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-surface-hover transition-colors">
                    <td className="py-2.5 px-4 font-medium">
                      <button
                        type="button"
                        onClick={() => onSelectProblem && onSelectProblem(item.titleSlug)}
                        className="text-text-primary hover:text-accent transition-colors truncate block text-left cursor-pointer"
                      >
                        {item.frontendQuestionId}. {item.title}
                      </button>
                    </td>
                    <td className="py-2.5 px-4">
                      <DifficultyLabel difficulty={item.difficulty} size="sm" />
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.topicTags.slice(0, 2).map((tag) => (
                          <TagChip key={tag}>{tag}</TagChip>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-text-secondary">
                      {item.language}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-text-muted">
                      {item.firstSolvedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
