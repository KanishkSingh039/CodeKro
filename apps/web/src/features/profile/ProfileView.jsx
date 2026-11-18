import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileSidebar from './ProfileSidebar';
import SolvedOverview from './SolvedOverview';
import ProfileHeatmap from './ProfileHeatmap';
import SubmissionsTab from './SubmissionsTab';
import SolvedTab from './SolvedTab';
import BookmarksTab from './BookmarksTab';
import SubmissionDetailModal from '../problem/SubmissionDetailModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { COPY } from '../../constants/copy';
import { AlertCircle, ArrowLeft, RotateCw } from 'lucide-react';

/**
 * ProfileView Component
 * Complete public and owner profile workspace (/u/:username).
 * Public profiles show stats, solved-problem calendar, solved list, and read-only code.
 */
export default function ProfileView({
  username = '',
  onNavigateSettings,
  onNavigateProblem,
  onBackToDashboard,
}) {
  const [activeTab, setActiveTab] = useState('solved');
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [calendarYear, setCalendarYear] = useState(() => String(new Date().getFullYear()));
  const [selectedSolved, setSelectedSolved] = useState(null);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['user-profile', username],
    queryFn: () => apiClient.getUserProfile(username),
    retry: false,
  });

  const profile = profileQuery.data;
  const isOwner = Boolean(profile?.isOwner);

  const activityQuery = useQuery({
    queryKey: ['user-activity', username, calendarYear],
    queryFn: () => apiClient.getUserActivity(username, calendarYear),
    enabled: Boolean(profile),
  });

  const submissionsQuery = useQuery({
    queryKey: ['user-submissions', username, submissionsPage],
    queryFn: () => apiClient.getUserSubmissions(username, submissionsPage, 20),
    enabled: Boolean(profile) && activeTab === 'submissions',
  });

  const solvedQuery = useQuery({
    queryKey: ['user-solved', username],
    queryFn: () => apiClient.getUserSolved(username),
    enabled: Boolean(profile) && activeTab === 'solved',
  });

  const bookmarksQuery = useQuery({
    queryKey: ['user-bookmarks', username],
    queryFn: () => apiClient.getUserBookmarks(username),
    enabled: Boolean(profile) && activeTab === 'bookmarks',
  });

  const solutionQuery = useQuery({
    queryKey: ['user-solved-solution', username, selectedSolved?.id],
    queryFn: () => apiClient.getUserSolution(username, selectedSolved?.id),
    enabled: Boolean(profile) && Boolean(selectedSolved?.id),
    retry: false,
  });

  const followMutation = useMutation({
    mutationFn: (following) => apiClient.followUser(username, following),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
    },
  });

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
          <Button variant="secondary" size="sm" onClick={onBackToDashboard} className="text-xs">
            {COPY.profile.notFound.backHome}
          </Button>
        </div>
      </div>
    );
  }

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

  const tabs = [
    { id: 'solved', label: COPY.profile.tabs.solved },
    { id: 'submissions', label: COPY.profile.tabs.submissions },
    { id: 'bookmarks', label: COPY.profile.tabs.bookmarks },
  ];

  return (
    <div className="max-w-[1280px] mx-auto space-y-6">
      <button
        type="button"
        onClick={onBackToDashboard}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Problems</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <Card padding="md">
            <ProfileSidebar
              profile={profile}
              isLoading={profileQuery.isLoading}
              onEditProfile={onNavigateSettings}
              onFollow={(following) => followMutation.mutate(following)}
              isFollowLoading={followMutation.isPending}
            />
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <SolvedOverview
            stats={profile?.stats}
            isLoading={profileQuery.isLoading}
          />

          <ProfileHeatmap
            activity={activityQuery.data}
            isLoading={activityQuery.isLoading || profileQuery.isLoading}
            selectedYear={calendarYear}
            onYearChange={setCalendarYear}
          />

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

          <div className="min-w-0">
            {activeTab === 'solved' && (
              <SolvedTab
                solved={solvedQuery.data}
                isLoading={solvedQuery.isLoading}
                onSelectProblem={(item) => setSelectedSolved(item)}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsTab
                data={submissionsQuery.data}
                isLoading={submissionsQuery.isLoading}
                page={submissionsPage}
                onPageChange={setSubmissionsPage}
                onSelectProblem={onNavigateProblem}
              />
            )}

            {activeTab === 'bookmarks' && (
              <BookmarksTab
                bookmarks={bookmarksQuery.data}
                isLoading={bookmarksQuery.isLoading}
                isOwner={isOwner}
                onSelectProblem={onNavigateProblem}
              />
            )}
          </div>
        </div>
      </div>

      {selectedSolved && solutionQuery.isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-bg-surface border border-border-default rounded-[var(--radius-md)] p-8 text-center text-xs text-text-muted">
            Loading submitted code...
          </div>
        </div>
      )}

      {selectedSolved && solutionQuery.isError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-[var(--radius-md)] p-6 text-center space-y-3">
            <p className="text-xs text-error">
              {solutionQuery.error?.message || 'Submitted code is unavailable.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setSelectedSolved(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {selectedSolved && solutionQuery.data && (
        <SubmissionDetailModal
          submission={{
            ...solutionQuery.data,
            problemTitle: selectedSolved.title,
          }}
          onClose={() => setSelectedSolved(null)}
        />
      )}
    </div>
  );
}
