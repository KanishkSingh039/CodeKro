import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * SubmissionDetailModal Component
 * Read-only modal displaying historical submission code, language, runtime, and memory stats.
 */
export default function SubmissionDetailModal({ submission, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const handleCopy = () => {
    if (submission.code) {
      navigator.clipboard.writeText(submission.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <StatusBadge status={submission.status} size="sm" />
            <span className="text-xs font-mono text-text-secondary">
              {submission.language} • {submission.runtime} • {submission.memory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary rounded border border-border-default bg-bg-surface hover:bg-bg-surface-hover transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-bg-surface-hover cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-bg-input">
          <pre className="font-mono text-xs text-text-primary leading-relaxed whitespace-pre-wrap">
            <code>{submission.code || '// No code recorded'}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border-subtle bg-bg-surface-subtle text-[11px] text-text-muted flex justify-between items-center">
          <span>Submitted on {submission.submittedAt || submission.relativeTime}</span>
          <span className="font-mono text-text-muted">ID: {submission.id}</span>
        </div>
      </div>
    </div>
  );
}
