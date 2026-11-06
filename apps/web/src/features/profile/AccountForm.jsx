import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import DangerZone from './DangerZone';
import { apiClient } from '../../lib/api';
import { COPY } from '../../constants/copy';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

/**
 * AccountForm Component
 * Manages username (with availability check), email verification, password change,
 * connected OAuth accounts, and DangerZone deletion.
 */
export default function AccountForm({
  initialUser = {},
  onDeleteAccount,
}) {
  const [username, setUsername] = useState(initialUser.username || '');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | 'invalid'
  const [usernameMessage, setUsernameMessage] = useState('');

  // Password change state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, success: '', error: '' });

  // Debounced username availability validation
  useEffect(() => {
    if (!username || username === initialUser.username) {
      setUsernameStatus(null);
      setUsernameMessage('');
      return;
    }

    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regex.test(username)) {
      setUsernameStatus('invalid');
      setUsernameMessage('Username must be 3-20 characters (letters, numbers, underscores).');
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.checkUsernameAvailable(username);
        if (res.available) {
          setUsernameStatus('available');
          setUsernameMessage(COPY.settings.accountForm.usernameAvailable);
        } else {
          setUsernameStatus('taken');
          setUsernameMessage(COPY.settings.accountForm.usernameTaken);
        }
      } catch {
        setUsernameStatus(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [username, initialUser.username]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: false, success: '', error: '' });

    if (!passwords.current) {
      setPasswordStatus({ loading: false, success: '', error: 'Please enter your current password.' });
      return;
    }
    if (passwords.newPass.length < 8) {
      setPasswordStatus({ loading: false, success: '', error: 'New password must be at least 8 characters.' });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordStatus({ loading: false, success: '', error: 'New passwords do not match.' });
      return;
    }

    setPasswordStatus({ loading: true, success: '', error: '' });
    try {
      await apiClient.changePassword(passwords.current, passwords.newPass);
      setPasswordStatus({ loading: false, success: 'Password updated successfully.', error: '' });
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setPasswordStatus({ loading: false, success: '', error: err.message || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Username & Email Security */}
      <Card padding="md" className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Account Credentials
        </h3>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary block">
            {COPY.settings.accountForm.usernameLabel}
          </label>
          <div className="relative">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              className="text-xs font-mono pr-8"
            />
            <div className="absolute right-2.5 top-2.5">
              {isCheckingUsername && <Loader2 className="w-4 h-4 text-text-muted animate-spin" />}
              {!isCheckingUsername && usernameStatus === 'available' && (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              )}
              {!isCheckingUsername && (usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                <XCircle className="w-4 h-4 text-error" />
              )}
            </div>
          </div>
          {usernameMessage && (
            <p
              className={`text-[11px] ${
                usernameStatus === 'available'
                  ? 'text-accent'
                  : 'text-error'
              }`}
            >
              {usernameMessage}
            </p>
          )}
          <p className="text-[11px] text-text-muted">
            {COPY.settings.accountForm.usernameHelp}
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1.5 pt-2 border-t border-border-subtle">
          <label className="text-xs font-semibold text-text-primary block">
            {COPY.settings.accountForm.emailLabel}
          </label>
          <Input
            value={initialUser.email || ''}
            readOnly
            className="text-xs font-mono bg-bg-surface-subtle"
          />
        </div>
      </Card>

      {/* 2. Password Change */}
      <Card padding="md" className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {COPY.settings.accountForm.passwordTitle}
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary block">
              {COPY.settings.accountForm.currentPasswordLabel}
            </label>
            <Input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
              className="text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary block">
                {COPY.settings.accountForm.newPasswordLabel}
              </label>
              <Input
                type="password"
                value={passwords.newPass}
                onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                placeholder="••••••••"
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary block">
                {COPY.settings.accountForm.confirmPasswordLabel}
              </label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••"
                className="text-xs font-mono"
              />
            </div>
          </div>

          {passwordStatus.error && (
            <p className="text-xs text-error">{passwordStatus.error}</p>
          )}
          {passwordStatus.success && (
            <p className="text-xs text-accent">{passwordStatus.success}</p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              loading={passwordStatus.loading}
              className="text-xs"
            >
              {COPY.settings.accountForm.changePasswordBtn}
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Connected OAuth Accounts */}
      <Card padding="md" className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {COPY.settings.accountForm.connectedTitle}
        </h3>

        <div className="divide-y divide-border-subtle">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-primary">Email</p>
              <p className="text-[11px] text-text-muted">
                {initialUser.email || 'Not available'}
              </p>
            </div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-primary">GitHub</p>
              <p className="text-[11px] text-text-muted">
                {initialUser.github ? `Connected as @${initialUser.github}` : 'Not connected'}
              </p>
            </div>
            <span className="text-xs font-mono text-text-muted">
              {initialUser.github ? 'Connected' : 'Not connected'}
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Danger Zone */}
      <DangerZone onDeleteAccount={onDeleteAccount} />
    </div>
  );
}
