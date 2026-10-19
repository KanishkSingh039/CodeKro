import React from 'react';
import Card from '../../components/ui/Card';
import {
  Code2,
  Bot,
  Filter,
  Trophy,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * FeatureGrid Component
 * 2x3 grid with small neutral line icons, short title and one sentence each.
 */
export function FeatureGrid() {
  const f = COPY.landing.features;

  const iconMap = {
    'editor': Code2,
    'ai-feedback': Bot,
    'filters': Filter,
    'contests': Trophy,
    'tracking': Flame,
    'solutions': MessageSquare,
  };

  return (
    <section className="py-20 bg-surface border-b border-border" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-wider text-muted">Capabilities</p>
          <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            {f.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            {f.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {f.items.map((item) => {
            const Icon = iconMap[item.id] || Code2;
            return (
              <Card
                key={item.id}
                padding="md"
                className="space-y-4 border border-border bg-base hover:border-border transition-colors"
              >
                <div className="w-8 h-8 rounded border border-border bg-surface flex items-center justify-center text-muted">
                  <Icon className="w-4 h-4 text-text" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
