import React from 'react';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Divider from '../../components/ui/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { COPY } from '../../constants/copy';

export default function AuthCard({ activeTab, onTabChange }) {
  const isLogin = activeTab === 'login';

  const tabs = [
    { id: 'login', label: COPY.auth.tabs.login },
    { id: 'register', label: COPY.auth.tabs.register },
  ];

  return (
    <div className="w-full max-w-[420px]">
      <Card padding="default" className="text-left w-full">
        {/* Title & Subtext - No decorative icons */}
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
            onChange={onTabChange}
            variant="underline"
          />
        </div>

        {/* OAuth Buttons (Outlined, neutral, equal width) */}
        <div className="space-y-4">
          <SocialAuthButtons />

          {/* Neutral Divider: "or" */}
          <Divider label={COPY.auth.oauth.divider} />

          {/* Form Content */}
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => onTabChange('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => onTabChange('login')} />
          )}
        </div>
      </Card>
    </div>
  );
}
