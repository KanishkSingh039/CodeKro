import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'success' | 'outline'
  size = 'sm',
  className = '',
}) {
  const variantStyles = {
    neutral: 'bg-bg-surface-subtle text-text-secondary border-border-default',
    success: 'bg-accent/10 text-accent border-accent/20',
    outline: 'bg-transparent text-text-muted border-border-default',
  }[variant] || 'bg-bg-surface-subtle text-text-secondary border-border-default';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
