import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SettingsLayout from './SettingsLayout';
import ProfileForm from './ProfileForm';
import AccountForm from './AccountForm';
import PreferencesForm from './PreferencesForm';
import PrivacyForm from './PrivacyForm';
import NotificationsForm from './NotificationsForm';
import { apiClient } from '../../lib/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * SettingsView Component
 * Top-level view for /settings/profile, managing queries, mutations, dirty state, and alerts.
 */
export default function SettingsView({
  initialTab = 'profile',
  onBackToProfile,
  onAccountDeleted,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = useQueryClient();

  // Queries for all settings datasets
  const profileQuery = useQuery({
    queryKey: ['profile', 'kanishk'],
    queryFn: () => apiClient.getUserProfile('kanishk'),
  });

  const preferencesQuery = useQuery({
    queryKey: ['settings-preferences'],
    queryFn: () => apiClient.getPreferences(),
  });

  const privacyQuery = useQuery({
    queryKey: ['settings-privacy'],
    queryFn: () => apiClient.getPrivacy(),
  });

  const notificationsQuery = useQuery({
    queryKey: ['settings-notifications'],
    queryFn: () => apiClient.getNotifications(),
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
      queryClient.invalidateQueries({ queryKey: ['profile', 'kanishk'] });
      setIsFormDirty(false);
      showToast('Profile updated successfully.');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update profile.');
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data) => apiClient.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-preferences'] });
      setIsFormDirty(false);
      showToast('Preferences updated successfully.');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update preferences.');
    },
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: (data) => apiClient.updatePrivacy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-privacy'] });
      setIsFormDirty(false);
      showToast('Privacy settings updated successfully.');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update privacy settings.');
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data) => apiClient.updateNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-notifications'] });
      setIsFormDirty(false);
      showToast('Notification settings updated successfully.');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update notifications.');
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
          initialProfile={profileQuery.data}
          isSaving={updateProfileMutation.isPending}
          onSave={(data) => updateProfileMutation.mutate(data)}
          onDirtyChange={setIsFormDirty}
        />
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <AccountForm
          initialUser={profileQuery.data}
          onDeleteAccount={async (phrase) => {
            await apiClient.deleteAccount(phrase);
            if (onAccountDeleted) onAccountDeleted();
          }}
        />
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <PreferencesForm
          initialPreferences={preferencesQuery.data}
          isSaving={updatePreferencesMutation.isPending}
          onSave={(data) => updatePreferencesMutation.mutate(data)}
          onDirtyChange={setIsFormDirty}
        />
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <PrivacyForm
          initialPrivacy={privacyQuery.data}
          isSaving={updatePrivacyMutation.isPending}
          onSave={(data) => updatePrivacyMutation.mutate(data)}
          onDirtyChange={setIsFormDirty}
        />
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <NotificationsForm
          initialNotifications={notificationsQuery.data}
          isSaving={updateNotificationsMutation.isPending}
          onSave={(data) => updateNotificationsMutation.mutate(data)}
          onDirtyChange={setIsFormDirty}
        />
      )}
    </SettingsLayout>
  );
}
