import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SettingsLayout from './SettingsLayout';
import ProfileForm from './ProfileForm';
import AccountForm from './AccountForm';
import { apiClient } from '../../lib/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * SettingsView Component
 * Top-level view for /settings/profile, managing queries, mutations, dirty state, and alerts.
 */
export default function SettingsView({
  user,
  initialTab = 'profile',
  onBackToProfile,
  onAccountDeleted,
  onSessionRefresh,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = useQueryClient();
  const profileIdentifier = user?.username || user?.email || '';

  // Queries for all settings datasets
  const profileQuery = useQuery({
    queryKey: ['profile', profileIdentifier],
    queryFn: () => apiClient.getUserProfile(profileIdentifier),
    enabled: Boolean(profileIdentifier),
  });

  // Warn on browser unload if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data) => apiClient.updateProfile(data),
    onSuccess: () => {
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsFormDirty(false);
      if (onSessionRefresh) void onSessionRefresh();
      showToast('Profile updated successfully.');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update profile.');
    },
  });

  const handleTabChange = (newTab) => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to switch tabs without saving?'
      );
      if (!confirmLeave) return;
    }
    setIsFormDirty(false);
    setActiveTab(newTab);
  };

  const handleBackToProfile = () => {
    if (isFormDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?'
      );
      if (!confirmLeave) return;
    }
    if (onBackToProfile) onBackToProfile();
  };

  return (
    <SettingsLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onBackToProfile={handleBackToProfile}
    >
      {/* Success Toast */}
      {toastMessage && (
        <div
          role="status"
          className="mb-4 px-3.5 py-2.5 rounded bg-accent/10 border border-accent/40 text-accent text-xs flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 px-3.5 py-2.5 rounded bg-error/10 border border-error/40 text-error text-xs flex items-center gap-2 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <ProfileForm
          key={profileQuery.data?.id || 'profile-loading'}
          initialProfile={profileQuery.data}
          isSaving={updateProfileMutation.isPending}
          onSave={(data) => updateProfileMutation.mutate(data)}
          onDirtyChange={setIsFormDirty}
        />
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <AccountForm
          key={profileQuery.data?.id || 'account-loading'}
          initialUser={profileQuery.data}
          onDeleteAccount={async (phrase) => {
            await apiClient.deleteAccount(phrase);
            if (onAccountDeleted) onAccountDeleted();
          }}
          onSessionRefresh={onSessionRefresh}
        />
      )}
    </SettingsLayout>
  );
}
