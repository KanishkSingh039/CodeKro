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

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  }[size] || 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center rounded-[4px] font-medium border ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
}
