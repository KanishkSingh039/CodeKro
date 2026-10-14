import React from 'react';
import { CheckCircle2, CircleDot, Circle } from 'lucide-react';

/**
 * StatusIcon Component
 * Shows problem solve status: solved / attempted / todo
 * Green is exclusively used for 'solved' / 'accepted' states.
 */
export default function StatusIcon({ status, size = 16, className = '' }) {
  const norm = (status || '').toLowerCase();

  if (norm === 'solved') {
    return (
      <CheckCircle2
        size={size}
        className={`text-accent shrink-0 ${className}`}
        aria-label="Solved"
      />
    );
  }

  if (norm === 'attempted') {
    return (
      <CircleDot
        size={size}
        className={`text-[var(--difficulty-medium)] shrink-0 ${className}`}
        aria-label="Attempted"
      />
    );
  }

  // 'todo' or undefined
  return (
    <Circle
      size={size}
      className={`text-text-muted/40 shrink-0 ${className}`}
      aria-label="Todo"
    />
  );
}
