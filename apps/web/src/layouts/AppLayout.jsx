import React from 'react';
import Logo from '../components/ui/Logo';
import { COPY } from '../constants/copy';
import { Sun, Moon } from 'lucide-react';

export default function AppLayout({
  children,
  sidebar,
  theme = 'dark',
  onToggleTheme,
}) {
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      {/* Shell Header */}
      <header className="w-full border-b border-border-default bg-bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-secondary">
              <a href="#problems" className="hover:text-text-primary transition-colors">
                {COPY.nav.problems}
              </a>
              <a href="#contests" className="hover:text-text-primary transition-colors">
                {COPY.nav.contests}
              </a>
              <a href="#docs" className="hover:text-text-primary transition-colors">
                {COPY.nav.docs}
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? COPY.nav.themeToggleLight : COPY.nav.themeToggleDark}
              className="p-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Body with optional Sidebar slot and main content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {sidebar && (
          <aside className="w-64 border-r border-border-default bg-bg-surface p-4 hidden md:block">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
