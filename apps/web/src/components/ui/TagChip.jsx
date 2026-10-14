import React from 'react';

/**
 * TagChip Component
 * Clean, calm neutral pill for topics, tags and company filters.
 * Selected state gets a green border (border-accent).
 */
export default function TagChip({
  label,
  count,
  selected = false,
  onClick,
  size = 'md',
  className = '',
}) {
  const isClickable = typeof onClick === 'function';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-[4px] gap-1',
    md: 'text-xs px-2.5 py-1 rounded-[var(--radius-sm)] gap-1.5',
  }[size] || 'text-xs px-2.5 py-1 rounded-[var(--radius-sm)] gap-1.5';

  const stateStyles = selected
    ? 'border-accent text-accent bg-bg-surface-subtle font-medium shadow-none'
    : 'border-border-default text-text-secondary bg-bg-surface hover:bg-bg-surface-hover hover:text-text-primary';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center justify-center border font-normal transition-colors whitespace-nowrap select-none ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      } ${sizeStyles} ${stateStyles} ${className}`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`text-[10px] font-mono px-1 rounded ${
            selected ? 'bg-accent/15 text-accent' : 'bg-bg-surface-subtle text-text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
