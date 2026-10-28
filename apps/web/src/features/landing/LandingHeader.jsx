import React, { useState } from 'react';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * LandingHeader Component
 * Sticky 56px top bar with Logo, anchor navigation links, theme toggle,
 * and auth CTA buttons. Collapses to an accessible drawer on mobile.
 */
export function LandingHeader({
  theme = 'dark',
  onToggleTheme,
  onNavigateSignIn,
  onNavigateGetStarted,
  onSignIn,
  onGetStarted,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleSignIn = onSignIn || onNavigateSignIn;
  const handleGetStarted = onGetStarted || onNavigateGetStarted;

  const navLinks = [
    { label: COPY.landing.header.problems, href: '#problems' },
    { label: COPY.landing.header.contests, href: '#contests' },
    { label: COPY.landing.header.docs, href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border-default bg-bg-surface select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Logo + Nav links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-1.5 text-text-muted hover:text-text-primary rounded border border-border-default bg-bg-surface-subtle cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <a href="#" className="flex items-center focus-visible:outline-accent" aria-label="CodeKro Home">
            <Logo size="md" />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-muted" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-text-primary transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Theme Toggle + Sign In + Get Started CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded border border-border-default bg-bg-surface text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignIn}
            className="hidden sm:inline-flex text-xs h-8 px-3"
          >
            {COPY.landing.header.signIn}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleGetStarted}
            className="hidden sm:inline-flex text-xs h-8 px-3.5 font-medium"
          >
            {COPY.landing.header.getStarted}
          </Button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 bg-bg-surface border-r border-border-default h-full flex flex-col p-4 shadow-xl z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border-default mb-4">
              <Logo size="md" />
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block px-3 py-2.5 rounded text-xs font-medium text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-border-default space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsMobileOpen(false);
                  if (handleSignIn) handleSignIn();
                }}
                className="w-full text-xs h-9 justify-center"
              >
                {COPY.landing.header.signIn}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsMobileOpen(false);
                  if (handleGetStarted) handleGetStarted();
                }}
                className="w-full text-xs h-9 justify-center font-medium"
              >
                {COPY.landing.header.getStarted}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default LandingHeader;
