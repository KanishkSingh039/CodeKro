import React from 'react';
import Card from '../../components/ui/Card';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * BadgesTab Component
 * Earned badges with date and criteria; unearned badges muted with progress.
 * No decorative glow or unearnable flair.
 */
export default function BadgesTab({ badges = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} padding="md" className="space-y-3">
            <div className="h-4 w-32 bg-border-default rounded animate-pulse" />
            <div className="h-8 bg-border-default rounded animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <Card padding="md" className="text-center py-12 text-xs text-text-muted">
        {COPY.profile.empty.noBadges}
      </Card>
    );
  }

  const earned = badges.filter((b) => b.earnedDate !== null);
  const unearned = badges.filter((b) => b.earnedDate === null);

  return (
    <div className="space-y-6">
      {/* 1. Earned Badges */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Earned Badges ({earned.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {earned.map((b) => (
            <Card
              key={b.id}
              padding="md"
              className="flex items-start gap-3.5 border-border-default hover:border-accent/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-bg-surface-subtle border border-border-default flex items-center justify-center shrink-0 text-accent">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-text-primary truncate">{b.name}</h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Earned</span>
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">{b.description}</p>
                <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border-subtle mt-1.5 font-mono">
                  <span>Criteria: {b.criteria}</span>
                  <span>{b.earnedDate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. In Progress / Locked Badges */}
      {unearned.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            In Progress ({unearned.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {unearned.map((b) => {
              const progressPct = Math.min(100, Math.floor((b.progress / (b.maxProgress || 1)) * 100));
              return (
                <Card
                  key={b.id}
                  padding="md"
                  className="flex items-start gap-3.5 opacity-80 border-border-subtle bg-bg-surface-subtle"
                >
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-bg-surface border border-border-default flex items-center justify-center shrink-0 text-text-muted">
                    <Lock className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-text-secondary truncate">{b.name}</h4>
                      <span className="text-[10px] font-mono text-text-muted">
                        {b.progress}/{b.maxProgress}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-snug">{b.description}</p>

                    {/* Progress bar */}
                    <div className="w-full bg-bg-surface h-1.5 rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className="bg-text-secondary/50 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-text-muted pt-0.5 font-mono">
                      Criteria: {b.criteria}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
