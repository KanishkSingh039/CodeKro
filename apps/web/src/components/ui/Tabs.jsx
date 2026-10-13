import React from 'react';

export default function Tabs({
  tabs = [], // [{ id: 'login', label: 'Sign In' }]
  activeTab,
  onChange,
  variant = 'underline', // 'underline' | 'segmented'
  className = '',
}) {
  if (variant === 'segmented') {
    return (
      <div 
        role="tablist" 
        className={`flex p-1 bg-bg-surface-subtle border border-border-default rounded-[var(--radius-sm)] ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              type="button"
              className={`flex-1 py-1.5 text-xs font-medium rounded-[4px] transition-colors cursor-pointer select-none ${
                isActive
                  ? 'bg-bg-surface text-text-primary shadow-xs border border-border-default'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant (default, LeetCode / clean modern style)
  return (
    <div 
      role="tablist" 
      className={`flex border-b border-border-default gap-6 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            type="button"
            className={`pb-2.5 text-sm font-medium transition-colors cursor-pointer relative select-none ${
              isActive
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
