import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'default',
  ...props
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-4 sm:p-7',
    lg: 'p-8',
  }[padding] || 'p-4 sm:p-7';

  return (
    <div
      className={`w-full max-w-full bg-bg-surface border border-border-default rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-hidden ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
