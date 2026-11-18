import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import OtpInput from '../../components/ui/OtpInput';
import Button from '../../components/ui/Button';
import { apiClient } from '../../lib/api';

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Enter the email address for your account.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.requestPasswordReset(email.trim().toLowerCase());
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Unable to send the reset code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.resetPassword(email.trim().toLowerCase(), otp, newPassword);
      setStep('done');
    } catch (err) {
      setError(err.message || 'Unable to reset the password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-2xl">
        <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-primary">
            <KeyRound className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold">Reset password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-bg-surface-hover cursor-pointer"
            aria-label="Close reset password"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'email' && (
            <form onSubmit={requestOtp} className="space-y-4">
              <p className="text-xs text-text-secondary">
                Enter your account email and we will send a one-time reset code.
              </p>
              <Input
                id="reset-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p className="text-xs text-error">{error}</p>}
              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Send reset code
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={resetPassword} className="space-y-4">
              <p className="text-xs text-text-secondary">
                Enter the code sent to <strong className="text-text-primary">{email}</strong>.
              </p>
              <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              <PasswordInput
                id="reset-password"
                label="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
              />
              <PasswordInput
                id="reset-confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
              {error && <p className="text-xs text-error">{error}</p>}
              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Reset password
              </Button>
            </form>
          )}

          {step === 'done' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-sm font-semibold text-text-primary">Password reset complete</p>
              <p className="text-xs text-text-secondary">
                You can now sign in with your new password.
              </p>
              <Button type="button" variant="primary" fullWidth onClick={onClose}>
                Back to sign in
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
