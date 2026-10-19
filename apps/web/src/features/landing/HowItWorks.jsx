import React from 'react';
import Card from '../../components/ui/Card';
import { COPY } from '../../constants/copy';

/**
 * HowItWorks Component
 * 3 numbered steps in plain text using clean monospace numerals (no icon tiles).
 */
export function HowItWorks() {
  const h = COPY.landing.howItWorks;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 border-b border-border bg-base" aria-labelledby="how-it-works-heading">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-wider text-muted">Workflow</p>
        <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          {h.title}
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          {h.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {h.steps.map((step) => (
          <Card key={step.number} padding="md" className="space-y-4 border border-border bg-surface">
            <span className="font-mono text-3xl font-bold text-text/50 block tracking-tight">
              {step.number}
            </span>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-text">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
