import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Divider from '../../components/ui/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerifyForm from './OtpVerifyForm';
import { COPY } from '../../constants/copy';

/**
 * OTP is triggered from THREE entry points:
 *  1. Register form submit  → onSuccess(email)
 *  2. Login form submit     → onSuccess(email)
 *  3. Google / GitHub OAuth → onGoogleSuccess(email) / onGithubSuccess(email)
 *
 * In all cases, AuthCard transitions to the OTP verification screen.
 * After OTP is verified, the global onSuccess() is called to finish auth.
 */
export default function AuthCard({ activeTab, onTabChange, onSuccess }) {
  const isLogin = activeTab === 'login';

  // null  → show login/register forms
  // string → show OTP screen for that email
  const [otpEmail, setOtpEmail] = useState(null);

  const tabs = [
    { id: 'login', label: COPY.auth.tabs.login },
    { id: 'register', label: COPY.auth.tabs.register },
  ];

  /** Shared handler – any successful auth step calls this with the user's email */
  const triggerOtp = (email) => {
    if (email) {
      setOtpEmail(email);
    } else {
      // Safety fallback: if somehow email is missing, just proceed
      onSuccess?.();
    }
  };

  /** OTP verified → finish the auth flow */
  const handleOtpVerified = () => {
    setOtpEmail(null);
    onSuccess?.();
  };

  /** Back from OTP → return to whichever tab the user came from */
  const handleOtpBack = () => {
    setOtpEmail(null);
  };

  /** Tab change → always clear any pending OTP state */
  const handleTabChange = (tab) => {
    setOtpEmail(null);
    onTabChange?.(tab);
  };

  return (
    <div className="w-full max-w-[420px]">
      <Card padding="default" className="text-left w-full">

        {/* ── OTP Verification Step ── */}
        {otpEmail ? (
          <OtpVerifyForm
            email={otpEmail}
            onVerified={handleOtpVerified}
            onBack={handleOtpBack}
            autoSendOnMount={true}
          />
        ) : (
          <>
            {/* Title & Subtext */}
            <div className="mb-6 space-y-1">
              <h2 className="text-xl font-semibold text-text-primary tracking-tight">
                {isLogin ? COPY.auth.loginTitle : COPY.auth.registerTitle}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isLogin ? COPY.auth.loginSubtitle : COPY.auth.registerSubtitle}
              </p>
            </div>

            {/* Tab switch control */}
            <div className="mb-6">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={handleTabChange}
                variant="underline"
              />
            </div>

            <div className="space-y-4">
              {/* ── Social OAuth Buttons (Google + GitHub) ── */}
              {/* Both pass the OAuth account email into the OTP step */}
              <SocialAuthButtons
                onGoogleSuccess={(email) => triggerOtp(email)}
                onGithubSuccess={(email) => triggerOtp(email)}
              />

              <Divider label={COPY.auth.oauth.divider} />

              {/* ── Email / Password Forms ── */}
              {isLogin ? (
                <LoginForm
                  onSwitchToRegister={() => handleTabChange('register')}
                  onSuccess={(email) => triggerOtp(email)}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => handleTabChange('login')}
                  onSuccess={(email) => triggerOtp(email)}
                />
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
