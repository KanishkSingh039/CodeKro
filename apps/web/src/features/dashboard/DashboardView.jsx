import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import GreetingRow from './GreetingRow';
import TopicChips from './TopicChips';
import ProgressCard from './ProgressCard';
import StreakActivityCard from './StreakActivityCard';
import DailyProblemCard from './DailyProblemCard';
import UpcomingContestsCard from './UpcomingContestsCard';
import RecentSubmissionsCard from './RecentSubmissionsCard';
import FilterBar from '../../components/ui/FilterBar';
import DataTable from '../../components/ui/DataTable';

/**
 * Read initial filters from browser URL query params
 */
const getFiltersFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get('page') || '1', 10),
    limit: 20,
    q: params.get('q') || '',
    difficulty: params.get('difficulty') || 'all',
    status: params.get('status') || 'all',
    tag: params.get('tag') || 'all',
    company: params.get('company') || 'all',
    sort: params.get('sort') || 'id_asc',
  };
};

/**
 * DashboardView Component
 * The main post-login landing page at /dashboard.
 * Strictly adheres to developer-first calm aesthetic, token system,
 * 8/4 split on desktop, responsive single-column on mobile.
 */
export default function DashboardView({ onNavigateProblem }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(getFiltersFromURL);
  const [randomNotice, setRandomNotice] = useState(null);

  // Sync state when browser back/forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      setFilters(getFiltersFromURL());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync filters to URL query params
  const updateFilters = useCallback((newPartialFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newPartialFilters };
      const params = new URLSearchParams(window.location.search);

      // Keep tab/theme if present, update filter keys
      if (updated.page > 1) params.set('page', String(updated.page));
      else params.delete('page');

      if (updated.q) params.set('q', updated.q);
      else params.delete('q');

      if (updated.difficulty && updated.difficulty !== 'all') params.set('difficulty', updated.difficulty);
      else params.delete('difficulty');

      if (updated.status && updated.status !== 'all') params.set('status', updated.status);
      else params.delete('status');

      if (updated.tag && updated.tag !== 'all') params.set('tag', updated.tag);
      else params.delete('tag');

      if (updated.company && updated.company !== 'all') params.set('company', updated.company);
      else params.delete('company');

      if (updated.sort && updated.sort !== 'id_asc') params.set('sort', updated.sort);
      else params.delete('sort');

      const newRelativePathQuery =
        window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState(null, '', newRelativePathQuery);

      return updated;
    });
  }, []);

  const resetFilters = () => {
    updateFilters({
      page: 1,
      q: '',
      difficulty: 'all',
      status: 'all',
      tag: 'all',
      company: 'all',
      sort: 'id_asc',
    });
  };

  // 1. Current user profile
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: apiClient.getMe,
  });

  // 2. Problems list with filters, loaded page-by-page as the list is scrolled
  const {
    data: problemsData,
    isLoading: isProblemsLoading,
    isError: isProblemsError,
    error: problemsError,
    refetch: refetchProblems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['problems', filters],
    queryFn: ({ pageParam = 1 }) => apiClient.getProblems({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const problems = problemsData?.pages.flatMap((p) => p.problems) || [];
  const totalProblems = problemsData?.pages[0]?.total || 0;

  // 3. User session stats
  const { data: userStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: apiClient.getUserStats,
  });

  // 4. Streak & 12-week heatmap activity
  const { data: userActivity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: apiClient.getUserActivity,
  });

  // 5. Daily problem challenge
  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ['daily-problem'],
    queryFn: apiClient.getDailyProblem,
  });

  // 6. Upcoming contests
  const { data: upcomingContests, isLoading: isContestsLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: apiClient.getUpcomingContests,
  });

  // 7. Recent submissions
  const { data: recentSubmissions, isLoading: isSubmissionsLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => apiClient.getRecentSubmissions(5),
  });

  // Bookmark mutation with optimistic update
  const bookmarkMutation = useMutation({
    mutationFn: (problemId) => apiClient.toggleBookmark(problemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    },
  });

  const handleBookmarkToggle = (problemId) => {
    bookmarkMutation.mutate(problemId);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Pick random problem
  const handlePickRandom = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      const chosen = problems[randomIndex];
      setRandomNotice(`Random problem selected: #${chosen.frontendQuestionId} ${chosen.title}`);
      setTimeout(() => setRandomNotice(null), 4000);
      if (onNavigateProblem) onNavigateProblem(chosen);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100vh-6.5rem)] lg:min-h-0">
      {/* Top Greeting Row */}
      <div className="shrink-0">
        <GreetingRow
          user={user}
          onContinueProblem={(p) => {
            if (onNavigateProblem) onNavigateProblem(p);
          }}
        />
      </div>

      {/* Random Notice Notification if triggered */}
      {randomNotice && (
        <div className="p-2.5 text-xs rounded-[var(--radius-sm)] border border-accent/30 bg-bg-surface-subtle text-accent flex items-center justify-between">
          <span>{randomNotice}</span>
          <button
            type="button"
            onClick={() => setRandomNotice(null)}
            className="text-text-muted hover:text-text-primary ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Two Column Desktop Layout (8/4 Split) / Ordered Single Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:flex-1 lg:min-h-0 lg:items-stretch">
        {/* LEFT COLUMN: Main Problem Bank (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-4 order-3 lg:order-1 lg:min-h-0">
          {/* Topic Chips Row */}
          <div className="border-b border-border-default pb-2 shrink-0">
            <TopicChips
              selectedTag={filters.tag || 'all'}
              onSelectTag={(tag) => updateFilters({ tag, page: 1 })}
            />
          </div>

          {/* Filter Toolbar */}
          <div className="shrink-0">
            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
              onPickRandom={handlePickRandom}
              totalResults={totalProblems}
            />
          </div>

          {/* Core Problem List DataTable (scrolls internally, loads more rows) */}
          <DataTable
            problems={problems}
            isLoading={isProblemsLoading}
            isError={isProblemsError}
            errorMessage={problemsError?.message}
            onRetry={refetchProblems}
            onBookmarkToggle={handleBookmarkToggle}
            onProblemClick={(p) => {
              if (onNavigateProblem) onNavigateProblem(p);
            }}
            onResetFilters={resetFilters}
            total={totalProblems}
            hasMore={Boolean(hasNextPage)}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* RIGHT COLUMN: Sidebar Stats & Daily (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-2 lg:min-h-0 lg:overflow-y-auto overscroll-contain [&>*]:shrink-0">
          {/* 1. Session Progress Card */}
          <ProgressCard stats={userStats} isLoading={isStatsLoading} />

          {/* 2. Daily Problem Challenge */}
          <DailyProblemCard
            daily={dailyData}
            isLoading={isDailyLoading}
            onSolve={(p) => {
              if (onNavigateProblem) onNavigateProblem(p);
            }}
          />

          {/* 3. Streak and Activity Heatmap */}
          <StreakActivityCard activity={userActivity} isLoading={isActivityLoading} />

          {/* 4. Upcoming Contests */}
          <UpcomingContestsCard contests={upcomingContests} isLoading={isContestsLoading} />

          {/* 5. Recent Submissions */}
          <RecentSubmissionsCard
            submissions={recentSubmissions}
            isLoading={isSubmissionsLoading}
            onViewAll={() => updateFilters({ status: 'solved', page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
