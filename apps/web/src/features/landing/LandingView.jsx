import { useEffect } from 'react';
import { LandingHeader } from './LandingHeader';
import { Hero } from './Hero';
import { ProblemPreviewTable } from './ProblemPreviewTable';
import { HowItWorks } from './HowItWorks';
import { FeatureGrid } from './FeatureGrid';
import { ContestTeaser } from './ContestTeaser';
import { ProgressPreview } from './ProgressPreview';
import { FaqAccordion } from './FaqAccordion';
import { FinalCta } from './FinalCta';
import { LandingFooter } from './LandingFooter';

export function LandingView({ onNavigate, theme, onToggleTheme }) {
  // Ensure title and meta tags are aligned
  useEffect(() => {
    document.title = 'CodeKro - Practice Coding, Prepare for Technical Interviews';
  }, []);

  const handleStartSolving = () => {
    if (onNavigate) {
      onNavigate('register');
    } else {
      window.location.hash = '#/register';
    }
  };

  const handleBrowseProblems = () => {
    // Scroll to the problem preview strip or navigate to problems
    const el = document.getElementById('problems');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('problems');
    }
  };

  const handleSignIn = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      window.location.hash = '#/login';
    }
  };

  const handleViewAllProblems = () => {
    if (onNavigate) {
      onNavigate('problems');
    } else {
      window.location.hash = '#/problems';
    }
  };

  return (
    <div className="min-h-screen bg-base text-text selection:bg-accent/20 selection:text-accent font-sans antialiased">
      {/* Skip to Content for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-fg focus:font-semibold focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* 1. Sticky Header */}
      <LandingHeader
        onSignIn={handleSignIn}
        onGetStarted={handleStartSolving}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* 2. Hero + Product Preview */}
        <Hero
          onStartSolving={handleStartSolving}
          onBrowseProblems={handleBrowseProblems}
        />

        {/* 3. Problem preview strip */}
        <ProblemPreviewTable
          onViewAll={handleViewAllProblems}
          onSelectProblem={(_slug) => {
            if (onNavigate) onNavigate('problems');
          }}
        />

        {/* 4. How it works */}
        <HowItWorks />

        {/* 5. Features Grid */}
        <FeatureGrid />

        {/* 6. Upcoming Contests Teaser */}
        <ContestTeaser />

        {/* 7. Progress Preview */}
        <ProgressPreview />

        {/* 8. Frequently Asked Questions */}
        <FaqAccordion />

        {/* 9. Final CTA Band */}
        <FinalCta
          onGetStarted={handleStartSolving}
          onBrowseProblems={handleBrowseProblems}
        />
      </main>

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
}

export default LandingView;
