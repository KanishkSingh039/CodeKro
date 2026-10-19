import { ArrowRight } from 'lucide-react';
import { COPY } from '../../constants/copy';

export function FinalCta({ onGetStarted, onBrowseProblems }) {
  const fCopy = COPY.landing.finalCta;

  return (
    <section className="py-24 border-b border-border bg-surface" aria-labelledby="final-cta-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="final-cta-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
          {fCopy.headline}
        </h2>
        <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto">
          {fCopy.subhead}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded bg-accent text-accent-fg hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-opacity"
          >
            <span>{fCopy.button}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onBrowseProblems}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded border border-border bg-base text-text hover:bg-surface-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
          >
            <span>{fCopy.secondary}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
