import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import { COPY } from '../../constants/copy';

export default function KeyboardShortcutsModal({ onClose }) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modifier = isMac ? '⌘' : 'Ctrl';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shortcuts = [
    { key: `${modifier} + '`, desc: 'Run code against current testcases' },
    { key: `${modifier} + Enter`, desc: 'Submit solution for judging' },
    { key: '/', desc: 'Focus global search in navbar' },
    { key: '?', desc: 'Open this keyboard shortcuts modal' },
    { key: 'Esc', desc: 'Close dialogs / modals' },
    { key: 'Esc then Tab', desc: 'Exit code editor focus for accessibility navigation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Command className="w-4 h-4 text-accent" />
            <span>{COPY.problem.shortcuts}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs divide-y divide-border-subtle">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
              <span className="text-text-secondary">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-bg-surface-subtle border border-border-default font-mono text-[11px] text-text-primary shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
