import React from 'react';
import { Search, Shuffle, X, ArrowUpDown } from 'lucide-react';
import Button from './Button';

/**
 * FilterBar Component
 * Dense toolbar for problem search, difficulty, status, company, and sorting.
 */
export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  onPickRandom,
  totalResults = 0,
}) {
  const hasActiveFilters = Boolean(
    (filters.q && filters.q.trim()) ||
    (filters.difficulty && filters.difficulty !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.tag && filters.tag !== 'all') ||
    (filters.company && filters.company !== 'all') ||
    (filters.sort && filters.sort !== 'id_asc')
  );

  return (
    <div className="flex flex-col gap-2.5 pb-3">
      {/* Search and Quick Action Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search input with keyboard shortcut hint */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={filters.q || ''}
            onChange={(e) => onFilterChange({ q: e.target.value, page: 1 })}
            placeholder="Search problems by name or #..."
            className="w-full h-9 pl-9 pr-8 bg-bg-input border border-border-default text-xs text-text-primary placeholder:text-text-muted rounded-[var(--radius-sm)] transition-colors focus:border-accent focus:outline-none"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => onFilterChange({ q: '', page: 1 })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-primary cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <select
          value={filters.difficulty || 'all'}
          onChange={(e) => onFilterChange({ difficulty: e.target.value, page: 1 })}
          aria-label="Filter by Difficulty"
          className="h-9 px-2.5 bg-bg-surface border border-border-default text-xs text-text-secondary hover:text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          aria-label="Filter by Status"
          className="h-9 px-2.5 bg-bg-surface border border-border-default text-xs text-text-secondary hover:text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
          <option value="todo">Todo</option>
        </select>

        {/* Company Filter */}
        <select
          value={filters.company || 'all'}
          onChange={(e) => onFilterChange({ company: e.target.value, page: 1 })}
          aria-label="Filter by Company"
          className="h-9 px-2.5 bg-bg-surface border border-border-default text-xs text-text-secondary hover:text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
        >
          <option value="all">All Companies</option>
          <option value="Google">Google</option>
          <option value="Amazon">Amazon</option>
          <option value="Meta">Meta</option>
          <option value="Microsoft">Microsoft</option>
          <option value="Apple">Apple</option>
          <option value="Bloomberg">Bloomberg</option>
        </select>

        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <select
            value={filters.sort || 'id_asc'}
            onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
            aria-label="Sort problems"
            className="h-9 pl-7 pr-3 bg-bg-surface border border-border-default text-xs text-text-secondary hover:text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="id_asc">Sort: # Ascending</option>
            <option value="id_desc">Sort: # Descending</option>
            <option value="title_asc">Sort: Title (A-Z)</option>
            <option value="ac_rate_desc">Sort: Acceptance (High to Low)</option>
            <option value="ac_rate_asc">Sort: Acceptance (Low to High)</option>
            <option value="freq_desc">Sort: Frequency</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-text-muted absolute left-2 pointer-events-none" />
        </div>

        {/* Pick Random Problem button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onPickRandom}
          className="h-9 px-3 gap-1.5"
          title="Pick a random problem"
        >
          <Shuffle className="w-3.5 h-3.5 text-accent" />
          <span>Pick random</span>
        </Button>

        {/* Clear Filters reset if active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Meta result count indicator */}
      <div className="flex items-center justify-between text-[11px] text-text-muted px-0.5">
        <span>
          Showing <strong className="font-mono text-text-secondary">{totalResults}</strong> problems
        </span>
        {filters.tag && filters.tag !== 'all' && (
          <span className="inline-flex items-center gap-1">
            Tag filter: <span className="text-accent font-medium">{filters.tag}</span>
            <button
              type="button"
              onClick={() => onFilterChange({ tag: 'all', page: 1 })}
              className="text-text-muted hover:text-text-primary ml-0.5 cursor-pointer"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
