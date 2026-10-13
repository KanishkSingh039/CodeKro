import React from 'react';

export default function Link({
  href,
  children,
  variant = 'accent', // 'accent' | 'muted' | 'default'
  onClick,
  className = '',
  ...props
}) {
  const variantStyles = {
    accent: 'text-accent hover:underline underline-offset-4',
    muted: 'text-text-muted hover:text-text-secondary hover:underline underline-offset-4',
    default: 'text-text-secondary hover:text-text-primary hover:underline underline-offset-4',
  }[variant] || 'text-accent hover:underline';

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center text-xs transition-colors cursor-pointer ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
