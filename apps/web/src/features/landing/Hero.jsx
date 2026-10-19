import React from 'react';
import Button from '../../components/ui/Button';
import ProductPreview from './ProductPreview';
import { ArrowRight, Terminal } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * Hero Component
 * Single color headline, supporting description, CTAs, and desktop product preview card.
 */
export function Hero({ onStartSolving, onBrowseProblems }) {
  const h = COPY.landing.hero;

  return (
    <section className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Headline + Copy + CTAs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-[1.15]">
              {h.headline}
            </h1>
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-lg">
              {h.subhead}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={onStartSolving}
                className="text-xs sm:text-sm font-semibold h-11 px-5 flex items-center justify-center gap-2"
              >
                <span>{h.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onBrowseProblems}
                className="text-xs sm:text-sm h-11 px-5 flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4 text-muted" />
                <span>{h.secondaryCta}</span>
              </Button>
            </div>

            <p className="text-xs text-muted">
              {h.note}
            </p>
          </div>
        </div>

        {/* Right Column: Static Product Preview (7 cols) */}
        <div className="lg:col-span-7 w-full">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

export default Hero;
