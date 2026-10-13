import React from 'react';
import Logo from '../components/ui/Logo';
import { COPY } from '../constants/copy';
import { Sun, Moon, Terminal, CheckCircle2, Layers } from 'lucide-react';

export default function AuthLayout({ children, theme = 'dark', onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen w-full bg-bg-base text-text-primary flex flex-col relative codekro-subtle-grid">
      {/* Header */}
      <header className="w-full border-b border-border-default bg-bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo + Wordmark (No version badge) */}
          <Logo />

          {/* Right Nav Links + Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-text-secondary">
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

            {/* Theme switcher */}
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

      {/* Main Content Area */}
      <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-12 lg:gap-14 lg:items-center">
          {/* Left Column: Short Value Proposition (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-7 space-y-8 pr-4">
            {/* Plain headline in single color */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary leading-snug">
                {COPY.brand.tagline}
              </h1>
              <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
                {COPY.brand.subtext}
              </p>
            </div>

            {/* Static Code Snippet Card with neutral border */}
            <div className="rounded-[var(--radius-md)] border border-border-default bg-bg-surface overflow-hidden text-left shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between px-3.5 py-2 bg-bg-surface-subtle border-b border-border-default text-xs text-text-muted font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-border-default"></span>
                  <span className="w-2 h-2 rounded-full bg-border-default"></span>
                  <span className="w-2 h-2 rounded-full bg-border-default"></span>
                  <span className="ml-2 text-text-secondary">{COPY.showcase.codeSnippet.fileName}</span>
                </div>
                <span className="text-[11px] text-text-muted">C++20</span>
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-text-primary bg-bg-input">
                <code>{COPY.showcase.codeSnippet.code}</code>
              </pre>
            </div>

            {/* 3-item list of features as plain text with small neutral icons (no colored tiles, no boxes) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Terminal className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-left">
                  <h3 className="text-xs font-semibold text-text-primary">
                    {COPY.showcase.features[0].title}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {COPY.showcase.features[0].description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-left">
                  <h3 className="text-xs font-semibold text-text-primary">
                    {COPY.showcase.features[1].title}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {COPY.showcase.features[1].description}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-left">
                  <h3 className="text-xs font-semibold text-text-primary">
                    {COPY.showcase.features[2].title}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {COPY.showcase.features[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card (Vertically centered, max-width 420px) */}
          <div className="w-full lg:col-span-5 flex justify-center">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-default bg-bg-surface/60 py-4 px-4 sm:px-6 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{COPY.footer.copyright}</p>
          <div className="flex items-center gap-5 text-text-secondary">
            <a href="#privacy" className="hover:text-text-primary transition-colors">
              {COPY.footer.privacy}
            </a>
            <a href="#terms" className="hover:text-text-primary transition-colors">
              {COPY.footer.terms}
            </a>
            <a href="#security" className="hover:text-text-primary transition-colors">
              {COPY.footer.security}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
