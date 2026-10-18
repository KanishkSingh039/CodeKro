import React from 'react';
import { User, KeyRound, Sliders, Shield, Bell, ArrowLeft } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * SettingsLayout Component
 * Desktop sidebar navigation + mobile tab switcher for settings.
 */
export default function SettingsLayout({
  activeTab = 'profile',
  onTabChange,
  onBackToProfile,
  children,
}) {
  const tabs = [
    { id: 'profile', label: COPY.settings.tabs.profile, icon: User },
    { id: 'account', label: COPY.settings.tabs.account, icon: KeyRound },
    { id: 'preferences', label: COPY.settings.tabs.preferences, icon: Sliders },
    { id: 'privacy', label: COPY.settings.tabs.privacy, icon: Shield },
    { id: 'notifications', label: COPY.settings.tabs.notifications, icon: Bell },
  ];

  return (
    <div className="max-w-[1024px] mx-auto space-y-6">
      {/* Top Header with Back to Profile link */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={onBackToProfile}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </button>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">
          {COPY.settings.title}
        </h1>
        <p className="text-xs text-text-secondary">
          {COPY.settings.subtitle}
        </p>
      </div>

      {/* Main Grid: Sidebar (Desktop) or Dropdown (Mobile) + Form Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden">
          <label className="text-xs font-semibold text-text-muted mb-1 block uppercase tracking-wider">
            Section
          </label>
          <select
            value={activeTab}
            onChange={(e) => onTabChange && onTabChange(e.target.value)}
            className="w-full p-2.5 text-xs bg-bg-surface border border-border-default text-text-primary rounded-[var(--radius-sm)] focus:border-accent focus:outline-none"
          >
            {tabs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar Navigation (4 cols) */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-bg-surface border border-border-default rounded-[var(--radius-md)] p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-[var(--radius-sm)] transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-bg-surface-subtle text-accent border border-accent/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Form Content Panel (8 cols) */}
        <main className="md:col-span-8 lg:col-span-9 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
