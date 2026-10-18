import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProfileSidebar from './ProfileSidebar';
import SolvedOverview from './SolvedOverview';
import ProfileHeatmap from './ProfileHeatmap';
import SubmissionsTab from './SubmissionsTab';
import SolvedTab from './SolvedTab';
import ContestsTab from './ContestsTab';
import BadgesTab from './BadgesTab';
import BookmarksTab from './BookmarksTab';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { COPY } from '../../constants/copy';
import { Lock, AlertCircle, ArrowLeft, RotateCw } from 'lucide-react';

/**
 * ProfileView Component
 * Complete public and owner profile workspace (/u/:username).
 * Manages desktop 4/8 two-column layout, mobile single column,
 * privacy shields, 404 not found, and loading skeletons.
 */
export default function ProfileView({
  username = 'kanishk',
  onNavigateSettings,
  onNavigateProblem,
  onBackToDashboard,
}) {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [calendarYear, setCalendarYear] = useState('2026');

  // 1. Fetch user profile
  const profileQuery = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => apiClient.getUserProfile(username),
    retry: false,
  });

  // 2. Fetch user stats
  const statsQuery = useQuery({
    queryKey: ['user-stats', username],
    queryFn: () => apiClient.getUserStats(),
    enabled: !!profileQuery.data && !profileQuery.data.isPrivate,
  });

  // 3. Fetch user activity (heatmap & streaks)
  const activityQuery = useQuery({
    queryKey: ['user-activity', username, calendarYear],
    queryFn: () => apiClient.getUserActivity(),
    enabled: !!profileQuery.data && !profileQuery.data.isPrivate,
  });

  // 4. Fetch submissions
  const submissionsQuery = useQuery({
    queryKey: ['user-submissions', username, submissionsPage],
    queryFn: () => apiClient.getUserSubmissions(username, submissionsPage, 20),
    enabled: !!profileQuery.data && (!profileQuery.data.isPrivate || profileQuery.data.isOwner),
  });

  // 5. Fetch solved problems
  const solvedQuery = useQuery({
    queryKey: ['user-solved', username],
    queryFn: () => apiClient.getUserSolved(username),
    enabled: !!profileQuery.data && (!profileQuery.data.isPrivate || profileQuery.data.isOwner),
  });

  // 6. Fetch contest rating data
  const contestsQuery = useQuery({
    queryKey: ['user-contests', username],
    queryFn: () => apiClient.getUserContests(username),
    enabled: !!profileQuery.data && (!profileQuery.data.isPrivate || profileQuery.data.isOwner),
  });

  // 7. Fetch badges
  const badgesQuery = useQuery({
    queryKey: ['user-badges', username],
    queryFn: () => apiClient.getUserBadges(username),
    enabled: !!profileQuery.data && (!profileQuery.data.isPrivate || profileQuery.data.isOwner),
  });

  // 8. Fetch bookmarks
  const bookmarksQuery = useQuery({
    queryKey: ['user-bookmarks', username],
    queryFn: () => apiClient.getUserBookmarks(username),
    enabled: !!profileQuery.data,
  });

  // Handle 404 User Not Found
  if (profileQuery.isError && profileQuery.error?.status === 404) {
    return (
      <div className="max-w-[640px] mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-bg-surface-subtle border border-border-default flex items-center justify-center mx-auto text-text-muted">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-text-primary">
            {COPY.profile.notFound.title}
          </h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {COPY.profile.notFound.desc}
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackToDashboard}
            className="text-xs"
          >
            {COPY.profile.notFound.backHome}
          </Button>
        </div>
      </div>
    );
  }

  // Handle generic network error with Retry
  if (profileQuery.isError) {
    return (
      <div className="max-w-[640px] mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto text-error">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-text-primary">Failed to load profile</h2>
          <p className="text-xs text-text-secondary">
            {profileQuery.error?.message || 'Could not communicate with profile services.'}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => profileQuery.refetch()}
          className="text-xs flex items-center gap-1.5 mx-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </Button>
      </div>
    );
  }

  const profile = profileQuery.data;
  const isPrivateVisitor = profile?.isPrivate && !profile?.isOwner;

  const tabs = [
    { id: 'submissions', label: COPY.profile.tabs.submissions },
    { id: 'solved', label: COPY.profile.tabs.solved },
    { id: 'contests', label: COPY.profile.tabs.contests },
    { id: 'bookmarks', label: COPY.profile.tabs.bookmarks },
    { id: 'badges', label: COPY.profile.tabs.badges },
  ];

  return (
    <div className="max-w-[1280px] mx-auto space-y-6">
      {/* Top back navigation */}
      <button
        type="button"
        onClick={onBackToDashboard}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Problems</span>
      </button>

      {/* Main Responsive Grid: Desktop (4 / 8 cols) | Mobile (Single Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Identity & Skills, 4 cols) */}
        <div className="lg:col-span-4">
          <Card padding="md">
            <ProfileSidebar
              profile={profile}
              isLoading={profileQuery.isLoading}
              onEditProfile={onNavigateSettings}
            />
          </Card>
        </div>

        {/* Right Column (Activity & Content, 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Private Profile Notice for Visitors */}
          {isPrivateVisitor ? (
            <Card padding="lg" className="text-center py-16 space-y-3 border-border-default">
              <div className="w-12 h-12 rounded-full bg-bg-surface-subtle border border-border-default flex items-center justify-center mx-auto text-text-muted">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-primary">
                  {COPY.profile.privateProfile.title}
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  {COPY.profile.privateProfile.desc}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* 1. Solved Overview Ring Card */}
              <SolvedOverview
                stats={statsQuery.data}
                isLoading={statsQuery.isLoading || profileQuery.isLoading}
              />

              {/* 2. 12-Month Contribution Heatmap Card */}
              <ProfileHeatmap
                activity={activityQuery.data}
                isLoading={activityQuery.isLoading || profileQuery.isLoading}
                selectedYear={calendarYear}
                onYearChange={setCalendarYear}
              />

              {/* 3. Navigation Tabs */}
              <div className="border-b border-border-default flex items-center gap-1 overflow-x-auto select-none">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'border-accent text-accent font-semibold'
                          : 'border-transparent text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Panels */}
              <div className="min-w-0">
                {activeTab === 'submissions' && (
                  <SubmissionsTab
                    data={submissionsQuery.data}
                    isLoading={submissionsQuery.isLoading}
                    page={submissionsPage}
                    onPageChange={setSubmissionsPage}
                    onSelectProblem={onNavigateProblem}
                  />
                )}

                {activeTab === 'solved' && (
                  <SolvedTab
                    solved={solvedQuery.data}
                    isLoading={solvedQuery.isLoading}
                    onSelectProblem={onNavigateProblem}
                  />
                )}

                {activeTab === 'contests' && (
                  <ContestsTab
                    contestsData={contestsQuery.data}
                    isLoading={contestsQuery.isLoading}
                  />
                )}

                {activeTab === 'bookmarks' && (
                  <BookmarksTab
                    bookmarks={bookmarksQuery.data}
                    isLoading={bookmarksQuery.isLoading}
                    isOwner={profile?.isOwner}
                    onSelectProblem={onNavigateProblem}
                  />
                )}

                {activeTab === 'badges' && (
                  <BadgesTab
                    badges={badgesQuery.data}
                    isLoading={badgesQuery.isLoading}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
