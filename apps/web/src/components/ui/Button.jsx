import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-11 gap-2.5',
  }[size] || 'text-sm px-4 py-2 h-10 gap-2';

  const variantStyles = {
    primary: 'bg-accent hover:bg-accent-hover text-accent-text font-semibold border border-transparent shadow-none',
    secondary: 'bg-bg-surface hover:bg-bg-surface-hover text-text-primary border border-border-default',
    ghost: 'bg-transparent hover:bg-bg-surface-subtle text-text-secondary hover:text-text-primary border border-transparent',
  }[variant] || 'bg-accent hover:bg-accent-hover text-accent-text';

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin w-4 h-4 shrink-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="3" 
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}
