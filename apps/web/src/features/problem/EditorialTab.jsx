import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COPY } from '../../constants/copy';

/**
 * EditorialTab Component
 * Displays official solution approaches with complexity breakdown and code tabs.
 */
export default function EditorialTab({ editorial = [], isLocked = false, onUnlock }) {
  const [selectedLangs, setSelectedLangs] = useState({});

  if (isLocked) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <div className="w-10 h-10 rounded-full bg-bg-surface-subtle border border-border-default flex items-center justify-center text-text-muted">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-sm font-semibold text-text-primary">
            {COPY.problem.editorial.lockedTitle}
          </h3>
          <p className="text-xs text-text-muted">
            {COPY.problem.editorial.lockedDesc}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onUnlock}
          className="gap-1.5 mt-2"
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>{COPY.problem.editorial.unlockBtn}</span>
        </Button>
      </div>
    );
  }

  if (!editorial || editorial.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted">
        No official editorial approaches published yet.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 select-text overflow-y-auto">
      {editorial.map((approach, idx) => {
        const langKeys = Object.keys(approach.code || {});
        const activeLang = selectedLangs[approach.id] || langKeys[0] || 'cpp';

        return (
          <div key={approach.id || idx} className="space-y-3 pb-6 border-b border-border-default last:border-b-0">
            <h2 className="text-sm font-semibold text-text-primary">
              {approach.title}
            </h2>

            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
              {approach.description}
            </p>

            {/* Complexity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface space-y-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  {COPY.problem.editorial.timeComplexity}
                </span>
                <span className="font-mono text-xs text-text-primary block">
                  {approach.timeComplexity}
                </span>
              </div>

              <div className="p-3 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface space-y-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  {COPY.problem.editorial.spaceComplexity}
                </span>
                <span className="font-mono text-xs text-text-primary block">
                  {approach.spaceComplexity}
                </span>
              </div>
            </div>

            {/* Multi-language Code Snippet */}
            {langKeys.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {/* Language switcher pills */}
                <div className="flex items-center gap-1.5 border-b border-border-default pb-1">
                  {langKeys.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        setSelectedLangs((prev) => ({ ...prev, [approach.id]: lang }))
                      }
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        activeLang === lang
                          ? 'bg-bg-surface-subtle text-accent border border-accent/20 font-medium'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-[var(--radius-sm)] bg-bg-surface border border-border-default overflow-x-auto">
                  <pre className="font-mono text-xs text-text-primary leading-relaxed">
                    <code>{approach.code[activeLang]}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
