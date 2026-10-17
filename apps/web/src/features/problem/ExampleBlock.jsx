import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { COPY } from '../../constants/copy';

/**
 * ExampleBlock Component
 * Displays problem examples as neutral monospace blocks with Input, Output, and Explanation.
 */
export default function ExampleBlock({ example }) {
  const [copied, setCopied] = useState(false);

  const handleCopyInput = () => {
    if (example?.input) {
      navigator.clipboard.writeText(example.input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between text-text-secondary font-medium">
        <span>{COPY.problem.meta.example} {example.id}:</span>
        <button
          type="button"
          onClick={handleCopyInput}
          className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          title="Copy input"
        >
          {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy input'}</span>
        </button>
      </div>

      <div className="p-3 rounded-[var(--radius-sm)] bg-bg-surface border border-border-default space-y-1.5 font-mono text-[12px] leading-relaxed select-text">
        <div>
          <span className="text-text-muted select-none">{COPY.problem.meta.input}: </span>
          <span className="text-text-primary">{example.input}</span>
        </div>
        <div>
          <span className="text-text-muted select-none">{COPY.problem.meta.output}: </span>
          <span className="text-text-primary">{example.output}</span>
        </div>
        {example.explanation && (
          <div className="font-sans text-xs text-text-secondary pt-1 border-t border-border-subtle mt-1.5">
            <span className="font-semibold text-text-muted select-none">{COPY.problem.meta.explanation}: </span>
            <span>{example.explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
