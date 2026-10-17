import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * HintList Component
 * Reveals hints one at a time via accessible disclosure toggles.
 */
export default function HintList({ hints = [] }) {
  const [openHints, setOpenHints] = useState({});

  if (!hints || hints.length === 0) return null;

  const toggleHint = (idx) => {
    setOpenHints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
        <Lightbulb className="w-3.5 h-3.5 text-[var(--difficulty-medium)]" />
        <span>{COPY.problem.meta.hints} ({hints.length})</span>
      </div>

      <div className="space-y-1.5">
        {hints.map((hint, idx) => {
          const isOpen = Boolean(openHints[idx]);
          return (
            <div
              key={idx}
              className="border border-border-default rounded-[var(--radius-sm)] overflow-hidden bg-bg-surface"
            >
              <button
                type="button"
                onClick={() => toggleHint(idx)}
                aria-expanded={isOpen}
                className="w-full px-3 py-2 text-xs font-medium text-text-primary hover:bg-bg-surface-hover flex items-center justify-between transition-colors cursor-pointer select-none"
              >
                <span>
                  {COPY.problem.meta.hint} {idx + 1}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-1 text-xs text-text-secondary leading-relaxed border-t border-border-subtle bg-bg-surface-subtle">
                  {hint}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
